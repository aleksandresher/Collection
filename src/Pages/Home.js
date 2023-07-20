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
    <HomePageWrapper>
      <Header>
        <Logo src={process.env.PUBLIC_URL + "/assets/svg.png"} />
        <Search />
        <BtnWrapper>
          <LanguageButton />
          <PersonalPageBtn onClick={() => handleRouteToPersonal()}>
            {t("profile")}
          </PersonalPageBtn>
          <SignInBtn onClick={() => handleSignInLogOut()}>
            {userId ? <p>{t("logout")}</p> : <p>{t("signIn")}</p>}
          </SignInBtn>
        </BtnWrapper>
      </Header>
      <TagsCloud />
      <BiggestColls />
      <LastCreatedItems />
    </HomePageWrapper>
  );
}
export default HomePage;

const HomePageWrapper = styled.div`
  background-color: #f1f1f1;
  height: 100%;

  @media (max-width: 440px) {
    width: 440px;
  }
`;

const SignInBtn = styled.button`
  width: 70px;
  height: 30px;
  background-color: #ec3120;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-transform: capitalize;
  letter-spacing: 0.8px;

  @media (max-width: 440px) {
    width: 60px;
    grid-area: d;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dfdfdf;
  padding-top: 10px;
  height: 120px;
`;

const PersonalPageBtn = styled.button`
  background-color: #66de7b;
  border: none;
  padding: 4px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  text-transform: capitalize;
  letter-spacing: 0.8px;
`;
const BtnWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  height: 60px;

  @media (max-width: 440px) {
    font-size: 16px;
    gap: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "a a b"
      "a a b"
      "c d d";
  }
`;
const Logo = styled.img`
  width: 50px;
  height: 50px;

  @media (max-width: 440px) {
    width: 30px;
    height: 30px;
  }
`;
