import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import RatingStar from "../Rating/RatingStar";
import { useTranslation } from "react-i18next";

function BiggestColl() {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getBiggestColls = async () => {
      try {
        const response = await fetch(
          "https://usercollection.onrender.com/collections/getBiggestCollectionsIds"
        );
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching biggest collections:", error);
      }
    };

    getBiggestColls();
  }, []);

  return (
    <BiggestCollsWrapper>
      <BigCollHeader>{t("biggestColls")}</BigCollHeader>
      <BiggestCollsContainer>
        {collections.map((collection) => {
          const sumOfRatings = collection.ratings.reduce(
            (total, rating) => total + rating.rating,
            0
          );
          const averageRating =
            collection.ratings.length > 0
              ? sumOfRatings / collection.ratings.length
              : 0;

          return (
            <CollBox
              key={collection._id}
              onClick={() => navigate(`/guest/${collection._id}`)}
            >
              <CollectionImage src={collection.image} alt={collection.name} />
              <CollTextWrapper>
                <CollText>
                  {t("name")}: {collection.name}
                </CollText>
                <CollText>
                  {t("description")}: {collection.description}
                </CollText>
                <CollText>
                  {t("author")}: {collection.author}
                </CollText>
                <CollText>
                  {t("category")}: {t(`categories.${collection.category}`)}
                </CollText>
              </CollTextWrapper>
              <RatingContainer>
                <RatingStar
                  collectionId={collection._id}
                  averagescore={averageRating}
                />
                <p>{averageRating}</p>
                <p>({collection.ratings.length})</p>
              </RatingContainer>
            </CollBox>
          );
        })}
      </BiggestCollsContainer>
    </BiggestCollsWrapper>
  );
}

export default BiggestColl;

const BiggestCollsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 20px;
  align-items: center;

  @media (max-width: 440px) {
    justify-content: center;
  }
`;
const BigCollHeader = styled.h1`
  font-size: 26px;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  color: #485661;
`;
const BiggestCollsContainer = styled.div`
  display: grid;
  width: 80%;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

const CollTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: flex-start;
  gap: 5px;
  padding: 20px;
`;

const CollBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  padding: 15px;

  height: 350px;
  background-color: #fff;
  cursor: pointer;
`;

const CollText = styled.p`
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
`;

const CollectionImage = styled.img`
  width: 300px;
  height: auto;
`;
const RatingContainer = styled.div`
  display: flex;
  gap: 5px;
  align-self: flex-start;
  padding-left: 20px;
`;
