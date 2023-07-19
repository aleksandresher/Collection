import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function ItemForView() {
  const { t } = useTranslation();
  console.log("some random text");
  const { collectionId, itemId } = useParams();
  const [item, setItem] = useState();
  const [tagItem, setTagItem] = useState();
  console.log(`collectionId: ${collectionId}, itemId: ${itemId}`);
  useEffect(() => {
    fetch(
      `https://usercollection.onrender.com/collections/getItem/${collectionId}/${itemId}`
    )
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
  }, [collectionId, itemId]);

  useEffect(() => {
    fetch(`https://usercollection.onrender.com/collections/item/${itemId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setTagItem(resData.item);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <SingleItemWrapper>
      {item ? (
        <SingleItemContainer>
          <p>
            {t("name")}: {item?.name}
          </p>
          <p>
            {t("description")}: {item?.description}
          </p>
          <p>
            {t("itemCreationTime")}:{" "}
            {item?.createdAt && new Date(item.createdAt).toLocaleString()}
          </p>
          <LikeContainer>
            <LikeIcon src={process.env.PUBLIC_URL + "/assets/like.png"} />
            <p>{item?.likeCount}</p>
          </LikeContainer>

          <CommentContainer>
            {item?.comments.map((comment, index) => (
              <CommentBox key={index}>
                <CommentAuthor>{comment.author}</CommentAuthor>
                <CommentText>{comment.content} </CommentText>
              </CommentBox>
            ))}
          </CommentContainer>
        </SingleItemContainer>
      ) : (
        <SingleItemContainer>
          <p>Name: {tagItem?.name}</p>
          <p>Description: {tagItem?.description}</p>
          <p>
            Creation Time:{" "}
            {tagItem?.createdAt && new Date(tagItem.createdAt).toLocaleString()}
          </p>
          <LikeContainer>
            <LikeIcon src={process.env.PUBLIC_URL + "/assets/like.png"} />
            <p>{tagItem?.likeCount}</p>
          </LikeContainer>

          <CommentContainer>
            {tagItem?.comments?.map((comment, index) => (
              <CommentBox key={index}>
                <CommentAuthor>{comment.author}</CommentAuthor>
                <CommentText>{comment.content} </CommentText>
              </CommentBox>
            ))}
          </CommentContainer>
        </SingleItemContainer>
      )}
    </SingleItemWrapper>
  );
}
export default ItemForView;

const SingleItemWrapper = styled.div`
  display: flex;
  padding: 20px;
  justify-content: flex-start;
`;
const SingleItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 400px;
  width: 400px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f0f2f5;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #d1d5da;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #aeb3b8;
  }
`;

const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  background-color: #f0f2f5;
  border-radius: 10px;
  padding: 5px;
`;
const CommentAuthor = styled.p`
  font-size: 16px;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
`;

const CommentText = styled.p`
  font-size: 16px;
  font-weight: 400;
  font-family: "Open Sans", sans-serif;
`;
const LikeContainer = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`;

const LikeIcon = styled.img`
  width: 16px;
  height: 16px;
`;
