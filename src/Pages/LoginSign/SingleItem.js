import { useState, useEffect } from "react";
import CommentSection from "../../components/Comments/CommentSection";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import EditForm from "../../components/Item/ItemEdit";

function SingleItem() {
  const { t } = useTranslation();
  const [item, setItem] = useState();
  const [oneItem, setOneItem] = useState();
  const itemId = localStorage.getItem("itemId");
  const userId = localStorage.getItem("UserId");
  const collectionId = localStorage.getItem("CollectionId");
  const [editModal, setEditModal] = useState(false);
  const [names, setNames] = useState();
  const [namesModal, setNamesModal] = useState(false);
  console.log(`names: ${names}`);

  function changeEditModal() {
    setEditModal((prev) => !prev);
  }

  function onCancel() {
    setEditModal(false);
  }

  useEffect(() => {
    fetch(`http://localhost:8080/collections/getItem/${collectionId}/${itemId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setItem(resData.item);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function fetchUsernames(userIds) {
    return fetch("http://localhost:8080/users/getUsersNames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to retrieve usernames");
        }
        return response.json();
      })
      .then((data) => {
        setNames(data.usernames);
        setNamesModal(true);
      })
      .catch((error) => {
        console.error("Error retrieving usernames:", error);
        throw error;
      });
  }

  function likeItem(userId, collectionId, itemId) {
    fetch(
      `http://localhost:8080/collections/likeItem/${userId}/${collectionId}/${itemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.status !== 200) {
          console.log("Error updating collections.");
          throw new Error("Failed to update collections.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetch(`http://localhost:8080/collections/item/${itemId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setOneItem(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [itemId]);

  return (
    <SingleItemContainer>
      <ItemHeadBox>
        <p>{t("name")}:</p>
        <p>{item?.name}</p>
        <EditBtn onClick={changeEditModal}>{t("editItem")}</EditBtn>
      </ItemHeadBox>

      <p>
        {t("itemCreationTime")}:{" "}
        {item?.createdAt && new Date(item.createdAt).toLocaleString()}
      </p>
      <TagsContainer>
        <p>tags:</p>
        {item?.tags.map((tag, i) => (
          <p key={i}>#{tag}</p>
        ))}
      </TagsContainer>
      <LikeContainer>
        <LikeIcon
          src={process.env.PUBLIC_URL + "/assets/like.png"}
          onClick={() => likeItem(userId, collectionId, itemId)}
          onMouseEnter={() => fetchUsernames(item?.likes)}
          onMouseLeave={() => setNamesModal(false)}
        />
        <p>{item?.likeCount}</p>
        {/* <p onClick={() => fetchUsernames(item?.likes)}>{item?.likes}</p> */}
        {namesModal && (
          <NameList>
            {names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </NameList>
        )}
      </LikeContainer>
      {item?.dynamicFields && (
        <div>
          {Object.entries(item.dynamicFields).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
        </div>
      )}
      {editModal && (
        <EditFormWrapper>
          <EditForm
            item={item}
            collectionId={collectionId}
            itemId={itemId}
            onCancel={onCancel}
          />
        </EditFormWrapper>
      )}

      <div>
        <CommentSection
          userId={userId}
          itemId={itemId}
          collectionId={collectionId}
          item={item}
        />
      </div>
    </SingleItemContainer>
  );
}
export default SingleItem;

const SingleItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px;
  gap: 15px;
  position: relative;
`;

const ItemHeadBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const LikeContainer = styled.div`
  display: flex;
  gap: 3px;
  justify-items: center;
`;

const LikeIcon = styled.img`
  width: 16px;
  height: 16px;
  position: relative;
`;
const EditBtn = styled.button`
  border-radius: 10px;
  background-color: #66de7b;
  border: none;
  height: 30px;
  margin-left: 60px;
  width: 80px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
`;
const EditFormWrapper = styled.div`
  position: absolute;
  top: 400px;
`;
const TagsContainer = styled.div`
  display: flex;
  gap: 10px;
`;
const NameList = styled.ul`
  width: 150px;
  padding: 10px;
  background-color: #faf3f2;
  position: absolute;
  left: 80px;
  border-radius: 8px;
  list-style: none;
`;
