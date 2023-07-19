import styled from "styled-components";
import Tags from "../Tags/Tags";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ItemModal({ dynamicFields, changeModal, updateValue }) {
  const { t } = useTranslation();
  const [itemData, setItemData] = useState({ dynamicFields: {} });
  const { collectionId } = useParams();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setItemData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDynamicFieldChange = (fieldName, value) => {
    setItemData((prevData) => ({
      ...prevData,
      dynamicFields: {
        ...prevData.dynamicFields,
        [fieldName]: value,
      },
    }));
  };

  const handleTagsChange = useCallback((tags) => {
    setItemData((prevData) => ({
      ...prevData,
      tags: tags,
    }));
  }, []);
  function createItem(collectionId, item) {
    const { name, dynamicFields, tags } = item;
    fetch(
      "https://usercollection.onrender.com/collections/addItem/" + collectionId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: {
            name: name,
            dynamicFields: dynamicFields,
            tags: tags,
          },
        }),
      }
    )
      .then((res) => {
        if (res.status !== 200) {
          console.log("Error updating collections.");
          throw new Error("Failed to update collections.");
        }
        return res.json();
      })
      .then((resData) => {
        updateValue();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <ItemModalContainer>
      <InputContainer>
        <InputLabel htmlFor="itemName">{t("name")}</InputLabel>
        <InputField type="text" id="name" onChange={handleInputChange} />
      </InputContainer>

      {dynamicFields?.map((field, index) => {
        if (field.type === "text") {
          return (
            <InputContainer key={index}>
              <InputLabel>{field.label}</InputLabel>
              <InputField
                type="text"
                onChange={(e) =>
                  handleDynamicFieldChange(field.label, e.target.value)
                }
                id={field.label}
              />
            </InputContainer>
          );
        } else if (field.type === "date") {
          return (
            <InputContainer key={index}>
              <InputLabel>{field.label}</InputLabel>
              <InputField
                type="date"
                onChange={(e) =>
                  handleDynamicFieldChange(field.label, e.target.value)
                }
                id={field.label}
              />
            </InputContainer>
          );
        } else if (field.type === "checkbox") {
          return (
            <InputContainer key={index}>
              <InputLabel>{field.label}</InputLabel>
              <InputField
                type="checkbox"
                onChange={(e) =>
                  handleDynamicFieldChange(field.label, e.target.value)
                }
                id={field.label}
              />
            </InputContainer>
          );
        }
        return null;
      })}
      <Tags onChange={handleTagsChange} />
      <ItemBtnContainer>
        <ItemCreateBtn onClick={() => createItem(collectionId, itemData)}>
          {t("createItem")}
        </ItemCreateBtn>
        <CancelBtn onClick={() => changeModal()}>{t("close")}</CancelBtn>
      </ItemBtnContainer>
    </ItemModalContainer>
  );
}

export default ItemModal;

const ItemModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 800px;
  height: 600px;
  padding: 30px;
  background-color: #f8f8f8;
`;

const InputContainer = styled.div`
  display: flex;
  width: 200px;
  gap: 10px;
`;

const InputLabel = styled.label`
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
`;
const InputField = styled.input`
  height: 30px;
`;

const ItemBtnContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;

  // @media (max-width: 440px) {
  //   align-items: center;
  // }
`;

const ItemCreateBtn = styled.button`
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
