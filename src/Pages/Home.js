import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import SingIn from "./LoginSign/SignIn";
import SignUp from "./LoginSign/SignUp";
import Search from "../components/Search/Search";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BiggestColls from "../components/LastAndBiggest/BiggestColls";
import TagsCloud from "../components/Tags/TagsCloud";
import LastCreatedItems from "../components/LastAndBiggest/LastCreatedItems";
import { useTranslation } from "react-i18next";
import LanguageButton from "../components/Language/LanguageBtn";

function HomePage() {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const signupModal = useSelector((state) => state.signup);

  const navigate = useNavigate();

  function handleModal() {
    setShowModal((prev) => !prev);
  }
  function handleRouteToPersonal() {
    navigate("/users");
  }

  const userId = localStorage.getItem("userId");

  function logoutHandler() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("collectionId");
    navigate("/");
  }

  function handleSignInLogOut() {
    if (userId) {
      logoutHandler();
    } else {
      navigate("/signIn");
    }
  }

  return (
    <div>
      <Header>
        <Search />
        <LanguageButton />
        <PersonalPageBtn onClick={() => handleRouteToPersonal()}>
          {t("goto")}
        </PersonalPageBtn>
        <SignInWrapper onClick={() => handleSignInLogOut()}>
          <SignInBtn src={process.env.PUBLIC_URL + "/assets/user.png"} />
          {userId ? <p>{t("logout")}</p> : <p>{t("signIn")}</p>}
        </SignInWrapper>
      </Header>
      <TagsCloud />
      <BiggestColls />
      <LastCreatedItems />
    </div>
  );
}
export default HomePage;

const SignInWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;
const SignInBtn = styled.img`
  width: 24px;
  height: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding-top: 10px;
`;

const PersonalPageBtn = styled.button`
  background-color: #66de7b;
  border: none;
  padding: 4px;
  border-radius: 8px;
  margin-left: 20px;
  cursor: pointer;
`;
