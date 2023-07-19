import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import CollectionModal from "../../components/Collection/CollectionModal";
import { useDispatch } from "react-redux";
import { setCollectionId } from "../../features/CollectionSlice";
import { setUserId } from "../../features/UserSlice";
import { useTranslation } from "react-i18next";

function UsersPage({ toggleStatus }) {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState();
  const [collections, setCollections] = useState("");
  const [checkState, setCheckState] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCollections, setSelectedCollections] = useState([]);

  function handleCollection(collectionId, userId) {
    localStorage.setItem("CollectionId", collectionId);
    localStorage.setItem("UserId", userId);
    dispatch(setCollectionId(collectionId));
    dispatch(setUserId(userId));
    navigate(`/${collectionId}`);
  }

  function changeModal() {
    setModal((prev) => !prev);
  }

  const handleCheckChange = (collectionId) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(
        selectedCollections.filter((id) => id !== collectionId)
      );
    } else {
      setSelectedCollections([...selectedCollections, collectionId]);
    }
  };
  function logoutHandler() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("collectionId");
    navigate("/");
  }

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("https://usercollection.onrender.com/users/getUsers/" + userId, {})
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setUser(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch("https://usercollection.onrender.com/collections/getCollections/" + userId, {})
      .then((res) => {
        if (res.status !== 200) {
          console.log("Error retrieving collections.");
          throw new Error("Failed to retrieve collections.");
        }
        return res.json();
      })
      .then((resData) => {
        setCollections(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [modal, checkState]);

  function deleteCollection(collectionId) {
    fetch("https://usercollection.onrender.com/collections/delete/" + collectionId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        return response.json();
      })
      .then((data) => {
        setCheckState((prev) => !prev);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <UsersContainer>
      {modal ? (
        <ModalDiv>
          <CollectionModal
            modalActive={changeModal}
            userId={userId}
            collectionId={user?.user.collections._id}
          />
        </ModalDiv>
      ) : (
        ""
      )}
      {/* <ActiveUserInfo> */}
      <AdminSubContainer>
        <HomeBtn onClick={() => navigate("/")}>{t("home")}</HomeBtn>
        <NameBox>
          <NameKey>{t("user")}</NameKey>
          <KeyValue>{user?.user?.name}</KeyValue>
        </NameBox>
        <EmailBox>
          <EmailKey>{t("email")}</EmailKey>
          <KeyValue>{user?.user?.email}</KeyValue>
        </EmailBox>

        <AddAndTrashWrapper>
          <AddCollBtn onClick={() => setModal((prev) => !prev)}>
            {t("addColl")}
          </AddCollBtn>
          <TrashIcon
            src={process.env.PUBLIC_URL + "/assets/trash.png"}
            onClick={() => deleteCollection(selectedCollections)}
          />
        </AddAndTrashWrapper>

        <LogoutBtn onClick={() => logoutHandler()}>{t("logout")}</LogoutBtn>
      </AdminSubContainer>

      <div>
        <Table>
          <THREAD>
            <TR>
              <TH></TH>
              <TH>{t("name")}</TH>
              <TH>{t("description")}</TH>
              <TH>{t("category")}</TH>
              <TH>Image</TH>
              <TH>Manage</TH>
            </TR>
          </THREAD>
          <tbody>
            {collections?.collections?.map((collection, index) => (
              <TR key={index}>
                <TD>
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(collection._id)}
                    onChange={() => handleCheckChange(collection._id)}
                  />
                </TD>
                <TD>{collection.name}</TD>
                <TD>{collection.description}</TD>
                <TD> {t(`categories.${collection.category}`)}</TD>

                <TD>
                  <a href={collection.image}>{collection.image}</a>
                </TD>
                <TD>
                  <OpenBtn
                    onClick={() =>
                      handleCollection(collection._id, user.user._id)
                    }
                  >
                    {t("open")}
                  </OpenBtn>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
    </UsersContainer>
  );
}

export default UsersPage;

const AddAndTrashWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
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

const HomeBtn = styled.button`
  border: none;
  border-radius: 4px;
  height: 30px;
  background-color: #c086e7;
  padding: 5px;
  cursor: pointer;
`;

const AddCollBtn = styled.button`
  border-radius: 10px;
  background-color: #66de7b;
  border: none;
  height: 30px;
  width: 140px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;

  @media (max-width: 1172px) {
    height: 40px;
    padding: 5px;
  }

  @media (max-width: 440px) {
    font-size: 14px;
    width: 150px;
    padding: 0;
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

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100ch;
  padding-left: 20px;
  padding-right: 20px;
  // background-color: #364652;
  position: relative;
`;

const AdminSubContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  padding: 15px;

  @media (max-width: 440px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 5px;
  }
`;

const NameKey = styled.p`
  font-size: 16px;
  font-weight: 700;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;

  @media (max-width: 440px) {
    font-size: 14px;
  }
`;

const EmailKey = styled.p`
  font-size: 16px;
  font-weight: 700;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;

  @media (max-width: 440px) {
    font-size: 14px;
  }
`;

const Table = styled.table`
  width: 100%;
`;
const TR = styled.tr`
  // border: 1px solid;
  align-items: center;

  @media (max-width: 440px) {
  }
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
    font-size: 14px;
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
`;
const TDACTIVE = styled.td`
  color: ${(props) => (props.active ? "green" : "red")};
  height: 40px;
  text-align: center;
  font-weight: 700;
  width: 90px;
  background-color: #e2ebf0;
`;
const NameBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
`;

const EmailBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const KeyValue = styled.p`
  font-family: "Open Sans", sans-serif;
`;
