import styled from "styled-components";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Search() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
  background-color: #98eecc;
  border-radius: 25px;

  @media (max-width: 440px) {
    width: 300px;
    height: 30px;
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
  font-family: "Open Sans", sans-serif;
`;
const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  top: 20px;
  cursor: pointer;
  margin-right: 10px;
`;
