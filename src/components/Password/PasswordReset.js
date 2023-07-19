import React, { useState } from "react";
import styled from "styled-components";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token");

    try {
      const response = await fetch(
        `http://localhost:8080/reset-password?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);

        window.location.href = "/";
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred while resetting the password");
    }
  };

  return (
    <PasswordResetWrapper>
      <Wrapper>
        <InputFormContainer onSubmit={handleSubmit}>
          <UserInput
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="New Password"
            required
          />
          <UserInput
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm New Password"
            required
          />
          <ResetBtn type="submit">Reset Password</ResetBtn>
        </InputFormContainer>
      </Wrapper>
    </PasswordResetWrapper>
  );
};

export default PasswordReset;

const PasswordResetWrapper = styled.div`
  width: 100%;
  margin: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 15px;
`;

const InputFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const ResetBtn = styled.button`
  width: 300px;
  height: 40px;
  margin-top: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  color: #fff;
  transition: 0.5s;

  box-shadow: 0 0 20px #eee;
  background-image: linear-gradient(
    to right,
    #d31027 0%,
    #ea384d 51%,
    #d31027 100%
  );
`;
