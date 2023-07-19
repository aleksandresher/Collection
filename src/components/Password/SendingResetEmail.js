import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

function SendingResetEmail() {
  const { t } = useTranslation();
  const [message, setMessage] = useState();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (message === "Password reset link sent to your email.") {
      setModal(true);
    }
  }, [message]);
  function handleSendingLink(email) {
    fetch("http://localhost:8080/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Could not initiate password reset.");
        }
        return res.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [resetEmail, setResetEmail] = useState("");
  return (
    <EmailSendContainer>
      <EmailSendWrapper>
        {modal && <Message>{t("linkSend")}</Message>}
        <EmailSendText>{t("enterEmail")}</EmailSendText>
        <EmailSendText>{t("emailSendText")}</EmailSendText>
        <UserInput
          type="email"
          placeholder={t("enterEmailInput")}
          onChange={(e) => setResetEmail(e.target.value)}
        />
        <EmailSendBtnContainer>
          <EmailSendBtn onClick={() => handleSendingLink(resetEmail)}>
            {t("send")}
          </EmailSendBtn>
          <CancelBtn onClick={() => navigate("/")}>{t("cancel")}</CancelBtn>
        </EmailSendBtnContainer>
      </EmailSendWrapper>
    </EmailSendContainer>
  );
}
export default SendingResetEmail;

const EmailSendContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmailSendWrapper = styled.div`
  display: flex;

  flex-direction: column;
  width: 400px;
  z-index: 100;

  position: absolute;
  top: 200px;

  gap: 5px;
`;

const EmailSendText = styled.p`
  font-family: "Open Sans", sans-serif;
`;
const EmailSendBtnContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
`;

const EmailSendBtn = styled.button`
  width: 30%;
  height: 30px;
  cursor: pointer;

  background-color: #34ebe1;
  border-radius: 8px;
  font-family: "Open Sans", sans-serif;
  border: none;
`;
const CancelBtn = styled.button`
  width: 20%;
  height: 30px;
  cursor: pointer;
  border-radius: 8px;
  font-family: "Open Sans", sans-serif;
  border: none;
`;

const UserInput = styled.input`
  height: 40px;
  widht: 300px;
  font-size: 14px;
  font-family: "Open Sans", sans-serif;
  border-radius: 4px;
  outline: none;
  border: 1px solid #c0c5c1;
  padding: 10px 10px;

  &:focus {
    border: 1px solid #d8ccbd;
    outline: none;
  }
`;
const Message = styled.p`
  margin-bottom: 20px;
  font-size: 14px;
  font-family: "Open Sans", sans-serif;
  color: red;
`;
