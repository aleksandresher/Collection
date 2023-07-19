import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ItemModal from "../../components/Item/ItemModal";
import { useTranslation } from "react-i18next";

function SingleCollection() {
  const { t } = useTranslation();
  const [collection, setCollection] = useState(null);
  const [collectionItems, setCollectionItems] = useState();
  const [dynamicFields, setDynamicFields] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [state, setState] = useState(false);
  const [modal, setModal] = useState(false);
  console.log(`se: ${selectedItems}`);

  const tags = useSelector((state) => state.tags);

  const navigate = useNavigate();

  const handleCheckChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  function changeModal() {
    setModal((prev) => !prev);
  }
  function updateValue() {
    setState((prev) => !prev);
  }

  const [item, setItem] = useState({
    name: "",
    description: "",
    price: null,
    tags: tags,
  });
  console.log(item);
  const [image, setImage] = useState(null);

  function handleInputChange(event) {
    const { name, value } = event.target;
    const parsedValue = name === "price" ? parseFloat(value) : value;
    setItem((prevCollections) => ({
      ...prevCollections,
      [name]: parsedValue,
    }));
  }

  useEffect(() => {
    setItem((prevItem) => ({
      ...prevItem,
      tags: tags,
    }));
  }, [tags]);
  const userId = localStorage.getItem("UserId");
  const collectionId = localStorage.getItem("CollectionId");

  useEffect(() => {
    fetch(`http://localhost:8080/collections/singleCollection/${collectionId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setCollection(resData);
        setDynamicFields(resData.dynamicFields);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleItemRoute(itemId) {
    localStorage.setItem("itemId", itemId);
    navigate(`/item/${itemId}`);
  }

  function deleteItem(collectionId, itemId) {
    fetch(
      `http://localhost:8080/collections/delete/${collectionId}/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetch(`http://localhost:8080/collections/getItems/${collectionId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setCollectionItems(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state]);

  function logoutHandler() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("collectionId");
    navigate("/");
  }

  return (
    <SingleCollectionContainer>
      <CollectionHeaderContainer>
        <HomeBtn onClick={() => navigate("/")}>{t("home")}</HomeBtn>
        <CollectionHeader>
          <NameKey>{t("collName")}:</NameKey>
          <KeyValue>{collection?.collection?.name}</KeyValue>
        </CollectionHeader>
        <CollectionHeader>
          <NameKey>{t("collCategory")}:</NameKey>
          <KeyValue>
            {" "}
            {t(`categories.${collection?.collection?.category}`)}
          </KeyValue>
        </CollectionHeader>
        <AddAndTrashWrapper>
          <AddItemBtn onClick={() => setModal((prev) => !prev)}>
            {t("addItem")}
          </AddItemBtn>
          <TrashIcon
            src={process.env.PUBLIC_URL + "/assets/trash.png"}
            onClick={() =>
              deleteItem(collection?.collection._id, selectedItems)
            }
          />
        </AddAndTrashWrapper>

        <LogoutBtn onClick={() => logoutHandler()}>{t("logout")}</LogoutBtn>
      </CollectionHeaderContainer>
      {modal ? (
        <ModalDiv>
          <ItemModal
            dynamicFields={dynamicFields}
            changeModal={changeModal}
            updateValue={updateValue}
          />
        </ModalDiv>
      ) : (
        ""
      )}

      <InputContainer></InputContainer>

      <div>
        <Table>
          <THREAD>
            <TR>
              <TH></TH>
              <TH>{t("name")}</TH>
              <TH>ID</TH>
              <TH>{t("tags")}</TH>
              <TH>Image</TH>
              <TH>Manage</TH>
            </TR>
          </THREAD>
          <tbody>
            {collectionItems?.items?.map((item, index) => (
              <TR key={index}>
                <TD>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleCheckChange(item._id)}
                  />
                </TD>
                <TD>{item.name}</TD>
                <TD></TD>
                <TD>#{item.tags}</TD>
                <TD></TD>
                <TD>
                  <OpenBtn onClick={() => handleItemRoute(item._id)}>
                    {t("open")}
                  </OpenBtn>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
      {/* </ItemsContainer> */}
    </SingleCollectionContainer>
  );
}

export default SingleCollection;

const SingleCollectionContainer = styled.div`
  width: 100%;
  height: 100ch;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
`;

const AddAndTrashWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const CollectionHeaderContainer = styled.div`
  display: flex;
  gap: 15px;
  padding: 10px;
  align-items: center;

  @media (max-width: 440px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CollectionHeader = styled.div`
  display: flex;
  gap: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 200px;
  gap: 5px;
`;

const AddItemBtn = styled.button`
  border-radius: 10px;
  background-color: #66de7b;
  border: none;
  height: 30px;
  width: 100px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
`;

const TrashIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const LogoutBtn = styled.button`
  width: 80px;
  height: 30px;
  margin-left: 50px;
  border: none;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Open Sans", sans-serif;
  background-color: #ed5237;
  text-transform: uppercase;

  @media (max-width: 1070px) {
    width: 120px;
    margin-left: 20px;
  }
  @media (max-width: 440px) {
    position: absolute;
    left: 250px;
  }
`;

const OpenBtn = styled.button`
  height: 25px;
  width: 50px;
  border: none;
  cursor: pointer;
  background-color: #66de7b;
  border-radius: 10px;
`;

const ModalDiv = styled.div`
  position: absolute;
`;

const Table = styled.table`
  width: 100%;
`;
const TR = styled.tr`
  // border: 1px solid;
  align-items: center;
`;
const TH = styled.th`
  // border: 1px solid;
  color: #fff;
  text-transform: uppercase;
  font-family: "Open Sans", sans-serif;
  font-size: 20px;

  @media (max-width: 440px) {
    font-size: 16px;
  }
`;

const TD = styled.td`
  height: 50px;
  text-align: center;

  background-color: #e2ebf0;

  @media (max-width: 440px) {
    font-size: 16px;
  }
`;

const ImageTD = styled.td`
  height: 50px;
  text-align: center;

  background-color: #e2ebf0;
`;

const THREAD = styled.thead`
  background-color: #364652;
  height: 40px;
  @media (max-width: 440px) {
    width: 380px;
  }
`;
const TDACTIVE = styled.td`
  color: ${(props) => (props.active ? "green" : "red")};
  height: 40px;
  text-align: center;
  font-weight: 700;
  width: 90px;
  background-color: #e2ebf0;
`;
const NameKey = styled.p`
  font-size: 16px;
  font-weight: 700;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
`;
const KeyValue = styled.p`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
`;
const HomeBtn = styled.button`
  border: none;
  border-radius: 4px;
  height: 30px;
  background-color: #c086e7;
  padding: 5px;
  cursor: pointer;

  @media (max-width: 440px) {
    position: relative;
  }
`;
