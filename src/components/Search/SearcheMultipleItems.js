import { useState, useEffect } from "react";
import styled from "styled-components";

function MultipleItems() {
  const itemsIdsString = localStorage.getItem("itemsIds");
  const itemsIds = JSON.parse(itemsIdsString);
  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/collections/items/${itemsIds}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch items by IDs");
        }
        return response.json();
      })
      .then((data) => {
        setItemsData(data.itemss);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  console.log(itemsIds);
  return (
    <ItemsWrapper>
      {itemsData?.map((item, index) => (
        <SingleItemContainer key={index}>
          <p>Name: {item.name}</p>
          <p>Description: {item.description}</p>
          <p>
            Creation Time:{" "}
            {item.createdAt && new Date(item.createdAt).toLocaleString()}
          </p>
          <LikeContainer>
            <LikeIcon src={process.env.PUBLIC_URL + "/assets/like.png"} />
            <p>{item.likeCount ? item.likeCount : 0}</p>
          </LikeContainer>

          <CommentContainer>
            {item.comments?.map((comment, index) => (
              <CommentBox key={index}>
                <CommentAuthor>{comment.author}</CommentAuthor>
                <CommentText>{comment.content} </CommentText>
              </CommentBox>
            ))}
          </CommentContainer>
        </SingleItemContainer>
      ))}
    </ItemsWrapper>
  );
}
export default MultipleItems;

const ItemsWrapper = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const SingleItemContainer = styled.div`
  display: flex;
  flex-direction: column;
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
