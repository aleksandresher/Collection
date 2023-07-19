import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const LanguageButton = () => {
  const { t, i18n } = useTranslation();
  const [languageListVisible, setLanguageListVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const changeLanguage = (lng) => {
    localStorage.setItem("language", lng);
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    setLanguageListVisible(false);
  };

  return (
    <LanguageBtnWrapper>
      <FlagImage
        src={
          selectedLanguage === "en"
            ? `${process.env.PUBLIC_URL}/assets/stateFlag.png`
            : `${process.env.PUBLIC_URL}/assets/georgiaFlag.png`
        }
        alt="Flag"
        onClick={() => setLanguageListVisible(!languageListVisible)}
      />

      {languageListVisible && (
        <ListContainer>
          <ListItem
            onClick={() => changeLanguage("en")}
            selected={selectedLanguage === "en"}
          >
            English
          </ListItem>
          <ListItem
            onClick={() => changeLanguage("ka")}
            selected={selectedLanguage === "ka"}
          >
            Georgian
          </ListItem>
        </ListContainer>
      )}
    </LanguageBtnWrapper>
  );
};

export default LanguageButton;

const LanguageBtnWrapper = styled.div`
  margin-left: 30px;
  position: relative;
`;

const FlagImage = styled.img`
  width: 24px;
  height: 24px;
`;
const ListContainer = styled.ul`
  width: 80px;
  background-color: #fff;

  border: 1px solid #e3e9ed;
  position: absolute;
  list-style: none;
  border-radius: 4px;
  right: 5px;
`;
const ListItem = styled.li`
  font-family: "Open Sans", sans-serif;
  width: 100%;
  padding: 5px;
  cursor: pointer;

  background-color: ${(props) => (props.selected ? "#f1f1f1" : "transparent")};

  &: hover {
    background-color: #f1f1f1;
  }
`;
