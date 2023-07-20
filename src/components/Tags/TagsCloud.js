import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
function TagsCloud() {
  const [tags, setTags] = useState("");
  const [foundedItems, setFoundedItem] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("https://usercollection.onrender.com/collections/getTags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        return response.json();
      })
      .then((data) => {
        setTags(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function searchItemsByTag(tag) {
    fetch(`https://usercollection.onrender.com/collections/search?tag=${tag}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to search items by tag");
        }
        return response.json();
      })
      .then((data) => {
        setFoundedItem(data);
        if (data.items.length === 1) {
          const itemId = data.items[0]._id;
          localStorage.setItem("itemId", itemId);
          navigate(`/guest/:collectionId/${itemId}`);
        } else {
          const itemIds = data.items.map((item) => item._id);
          localStorage.setItem("itemsIds", JSON.stringify(itemIds));
          navigate("/multipleItems");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  return (
    <TagsCloudWrapper>
      <TagsContainer>
        {tags?.tags?.map((tag, index) => (
          <TagsBox key={index}>
            <Tag onClick={() => searchItemsByTag(tag)}>#{tag}</Tag>
          </TagsBox>
        ))}
      </TagsContainer>
    </TagsCloudWrapper>
  );
}
export default TagsCloud;

const TagsCloudWrapper = styled.div`
  display: flex;
  justify-content: center;

  max-width: 100%;
  padding: 20px;
  margin-top: 30px;
  margin-bottom: 20px;
`;
const TagsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  gap: 10px;

  @media (max-width: 1110px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 440px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;
const TagsBox = styled.div`
  display: flex;
  align-items: center;

  height: 30px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
`;
const Tag = styled.p`
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
`;
