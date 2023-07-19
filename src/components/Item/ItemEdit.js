import React, { useState, useEffect, useCallback } from "react";
import Tags from "../Tags/Tags";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

function EditForm({ item, onCancel, collectionId, itemId }) {
  const { t } = useTranslation();
  const [editedItem, setEditedItem] = useState({ ...item });
  const [tags, setTags] = useState([]);
  const [dynamicFields, setDynamicFields] = useState(null);

  const handleTagsChange = useCallback((tags) => {
    setTags(tags);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/collections/singleCollection/${collectionId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setDynamicFields(resData.dynamicFields);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [collectionId]);

  function updateItem(collectionId, itemId, item) {
    const { dynamicFields, ...rest } = item;
    const updatedItem = {
      ...rest,
      dynamicFields: { ...dynamicFields },
      tags: [...item.tags, ...tags],
    };

    Object.entries(dynamicFields).forEach(([key, value]) => {
      updatedItem[key] = value;
    });

    return fetch(
      `http://localhost:8080/collections/${collectionId}/${itemId}/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update item");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated item:", data.item);
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  }

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    let fieldValue;

    if (type === "checkbox") {
      fieldValue = checked;
    } else if (name in editedItem.dynamicFields) {
      setEditedItem((prevItem) => ({
        ...prevItem,
        dynamicFields: {
          ...prevItem.dynamicFields,
          [name]: value,
        },
      }));
      return;
    } else {
      fieldValue = value;
    }

    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: fieldValue,
    }));
  };

  const handleCancel = () => {
    onCancel();
  };

  const renderFields = () => {
    if (!dynamicFields) {
      return null;
    }

    return Object.entries(dynamicFields).map(([key, field]) => {
      const fieldType = field.type;
      const fieldLabel = field.label;
      let inputField = null;

      switch (fieldType) {
        case "date":
          inputField = (
            <input
              type="date"
              name={fieldLabel}
              value={editedItem.dynamicFields[fieldLabel] || ""}
              onChange={handleFieldChange}
            />
          );
          break;
        case "checkbox":
          inputField = (
            <input
              type="checkbox"
              name={fieldLabel}
              checked={editedItem.dynamicFields[fieldLabel] || false}
              onChange={handleFieldChange}
            />
          );
          break;
        case "text":
          inputField = (
            <Input
              type="text"
              name={fieldLabel}
              value={editedItem.dynamicFields[fieldLabel] || ""}
              onChange={handleFieldChange}
            />
          );
          break;
        case "number":
          inputField = (
            <Input
              type="number"
              name={fieldLabel}
              value={editedItem.dynamicFields[fieldLabel] || ""}
              onChange={handleFieldChange}
            />
          );
          break;
        case "textarea":
          inputField = (
            <textarea
              name={fieldLabel}
              value={editedItem.dynamicFields[fieldLabel] || ""}
              onChange={handleFieldChange}
            />
          );
          break;
        default:
          inputField = (
            <Input
              type="text"
              name={fieldLabel}
              value={editedItem.dynamicFields[fieldLabel] || ""}
              onChange={handleFieldChange}
            />
          );
          break;
      }

      return (
        <div key={key}>
          <label>
            {fieldLabel}: {inputField}
          </label>
        </div>
      );
    });
  };

  return (
    <ItemEditWrapper>
      <NameWrapper>
        <label htmlFor="nameOf">{t("name")}</label>
        <Input
          id="nameOf"
          type="text"
          name="name"
          value={editedItem.name}
          onChange={handleFieldChange}
        />
      </NameWrapper>
      <Tags onChange={handleTagsChange} />

      {renderFields()}
      <BtnWrapper>
        <UpdateBtn onClick={() => updateItem(collectionId, itemId, editedItem)}>
          {t("update")}
        </UpdateBtn>
        <CancelBtn onClick={() => handleCancel()}>{t("cancel")}</CancelBtn>
      </BtnWrapper>
    </ItemEditWrapper>
  );
}

export default EditForm;

const ItemEditWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  background-color: #fbda9d;
  border-radius: 4px;
`;
const BtnWrapper = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 20px;

  @media (max-width: 440px) {
    width: 300px;
  }
`;
const UpdateBtn = styled.button`
  width: 80px;
  border-radius: 8px;
  background-color: #66de7b;
  border: none;
`;

const CancelBtn = styled.button`
  width: 80px;
  border-radius: 8px;
  background-color: #ed5237;
  border: none;
`;
const NameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Input = styled.input`
  height: 30px;
  padding: 5px;
`;
