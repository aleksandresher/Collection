import styled from "styled-components";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Search() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://usercollection.onrender.com/collections/search/${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <SearchWrapper>
      <SearchInput
        type="text"
        placeholder={t("search")}
        value={searchQuery}
        onChange={handleInputChange}
      />
      <SearchIcon
        src={process.env.PUBLIC_URL + "/assets/search1.png"}
        onClick={() => handleSearch()}
      />
      <ResultBox>
        {searchResults.length > 0 ? (
          <div>
            {searchResults?.map((item, index) => (
              <p key={index} onClick={() => navigate(`/item/${item._id}`)}>
                {item.name}:{item._id}
              </p>
            ))}
          </div>
        ) : (
          ""
        )}
      </ResultBox>
    </SearchWrapper>
  );
}
export default Search;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 100px;
  width: 500px;
  height: 50px;
  background-color: #fff;
  border-radius: 25px;
  position: relative;

  @media (max-width: 440px) {
    width: 170px;
    height: 30px;
    margin-left: 20px;
  }
`;
const SearchInput = styled.input`
  width: 100%;
  height: 30px;
  background: transparent;
  size: 16px;
  outline: none;
  border: none;
  padding: 15px;
  font-size: 20px;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;

  @media (max-width: 440px) {
    width: 150px;
    font-size: 15px;
  }
`;
const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  top: 20px;
  cursor: pointer;
  margin-right: 10px;
`;

const ResultBox = styled.div`
  display: flex;
  background-color: #fff;
  position: absolute;
  top: 60px;
`;
