import styled from "styled-components";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { io } from "socket.io-client";
const socket = io("https://usercollection.onrender.com");

function CommentSection({ itemId, collectionId, item }) {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [fetchedComments, setFetchedComments] = useState("");
  const userId = localStorage.getItem("userId");
  console.log(`collectionId: ${collectionId}, itemId: ${itemId}`);

  function sendComment(userId) {
    fetch(
      `https://usercollection.onrender.com/collections/addComment/${collectionId}/${itemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment,
          userId: userId,
        }),
      }
    )
      .then((res) => {
        if (res.status !== 200) {
          console.log("Error updating comments.");
          throw new Error("Failed to add comment.");
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
    fetch(
      `https://usercollection.onrender.com/collections/getComments/${collectionId}/${itemId}`
    )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setFetchedComments(resData);
        socket.on("commentAdd", (data) => {
          setFetchedComments(data.comment);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <CommentWrapper>
      <CommentContainer>
        {fetchedComments?.comments?.map((comment, index) => (
          <CommentBox key={index}>
            <CommentAuthor>{comment.author}</CommentAuthor>
            <CommentText>{comment.content} </CommentText>
          </CommentBox>
        ))}
      </CommentContainer>
      <CommentInputWrapper>
        <label htmlFor="commnetField">{t("Wcomment")}</label>
        <TextField
          id="commentField"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("commentPlaceholder")}
        />
        <AddBtn disabled={!comment} onClick={() => sendComment(userId)}>
          {t("comment")}
        </AddBtn>
      </CommentInputWrapper>
    </CommentWrapper>
  );
}
export default CommentSection;

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 500px;
  justify-content: space-between;
`;

const AddBtn = styled.button`
  border-radius: 10px;
  background-color: #66de7b;
  border: none;
  height: 30px;

  width: 80px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
`;

const CommentInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextField = styled.textarea`
  width: 80%;
  height: 80px;
  resize: none;
  padding: 5px;
  border-radius: 8px;
`;
const CommentsBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
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
