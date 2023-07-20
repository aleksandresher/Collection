import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function LastCreatedItems() {
  const { t } = useTranslation();
  const [lastItems, setLastItems] = useState("");

  useEffect(() => {
    fetch(`https://usercollection.onrender.com/collections/lastCollections`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setLastItems(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <LastItemsWrapper>
      <LastItemsHeader>{t("lastItems")}</LastItemsHeader>
      <LastItemsContainer>
        {lastItems[0]?.lastCreatedItems.map((item) => (
          <LastItemBox key={item._id}>
            <ItemText>
              {t("name")}: {item.name}
            </ItemText>
            <ItemText>
              {t("description")}: {item.description}
            </ItemText>
            <ItemText>
              {t("author")}: {item.author}
            </ItemText>
          </LastItemBox>
        ))}
      </LastItemsContainer>
    </LastItemsWrapper>
  );
}
export default LastCreatedItems;

const LastItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 20px;
  align-items: center;
  margin-top: 30px;
  background-color: #f1f1f1;
  padding-bottom: 30px;
`;

const LastItemsContainer = styled.div`
  display: grid;
  width: 80%;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

const ItemText = styled.p`
  font-size: 16px;
`;

const LastItemsHeader = styled.h1`
  font-size: 26px;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  color: #485661;
`;
const ItemImage = styled.img`
  width: 300px;
  height: auto;
`;

const LastItemBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;
