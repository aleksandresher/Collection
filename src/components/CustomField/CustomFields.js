import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setCustomFields } from "../../features/CustomFieldsSlice";
import { useTranslation } from "react-i18next";

const CustomFields = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState([]);
  const [fieldType, setFieldType] = useState("date");
  const [fieldLabel, setFieldLabel] = useState("");
  const [errorMode, setErrorMode] = useState(false);
  const dispatch = useDispatch();

  const handleAddField = () => {
    if (!fieldLabel) {
      return;
    }
    const newField = {
      type: fieldType,
      label: fieldLabel,
    };

    const maxFields = getMaxFields(fieldType);
    if (countFieldsOfType(fieldType) >= maxFields) {
      setErrorMode(true);
      return;
    }
    setErrorMode(false);
    setFields([...fields, newField]);
    setFieldLabel("");
  };
  const getMaxFields = (type) => {
    switch (type) {
      case "date":
      case "boolean":
      case "checkbox":
      case "text":
      case "textarea":
        return 3;
      case "number":
        return 1;
      default:
        return 0;
    }
  };

  const countFieldsOfType = (type) => {
    return fields.filter((field) => field.type === type).length;
  };

  useEffect(() => {
    dispatch(setCustomFields(fields));
  }, [dispatch, fields]);

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleChangeLabel = (index, label) => {
    const updatedFields = [...fields];
    updatedFields[index].label = label;
    setFields(updatedFields);
  };

  const renderField = (field, index) => {
    let inputField = null;

    switch (field.type) {
      case "date":
        inputField = <input type="date" />;
        break;
      case "checkbox":
        inputField = <input type="checkbox" />;
        break;
      case "text":
        inputField = <input type="text" />;
        break;
      case "textarea":
        inputField = <textarea />;
        break;
      case "number":
        inputField = <input type="number" />;
        break;
      default:
        inputField = null;
    }

    return (
      <OutputField key={index}>
        <label>{field.label}</label>
        {inputField}
        <RemoveBtn onClick={() => handleRemoveField(index)}>
          {t("remove")}
        </RemoveBtn>
      </OutputField>
    );
  };

  return (
    <FieldsContainer>
      <FieldsSelectHeader>{t("customInput")}</FieldsSelectHeader>
      <FiedlSelectBox>
        <FieldInputWrapper>
          <label>{t("fieldType")}:</label>
          <FieldSelect
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="checkbox">Checkbox</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="textarea">TextArea</option>
          </FieldSelect>
        </FieldInputWrapper>
        <FieldInputWrapper>
          <label>{t("fieldLabel")}:</label>
          <InputField
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
          />
        </FieldInputWrapper>
        <AddBtb onClick={handleAddField}>{t("add")}</AddBtb>
      </FiedlSelectBox>
      <FieldsSelectHeader>{t("addedFields")}</FieldsSelectHeader>
      {errorMode && (
        <ErrorMsg>
          You can only create a maximum of 3 fields for one type.
        </ErrorMsg>
      )}
      <FieldsBox>
        {fields.map((field, index) => renderField(field, index))}
      </FieldsBox>
    </FieldsContainer>
  );
};

export default CustomFields;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  background-color: rgb(248, 248, 248);
  min-heght: 300px;
  gap: 20px;

  @media (max-width: 440px) {
    width: 390px;
    padding: 10px;
  }
`;
const FieldInputWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const FiedlSelectBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 440px) {
    flex-direction: column;
    align-items: flex-start;
    width: 390px;
  }
`;

const FieldsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 390px;
`;

const FieldsSelectHeader = styled.h1`
  font-size: 20px;
  font-family: "Open Sans", sans-serif;
  text-transform: capitalize;
`;
const AddBtb = styled.button`
  width: 70px;
  height: 30px;
  border: none;
  background-color: #3ad649;
  border-radius: 4px;
  cursor: pointer;
`;
const InputField = styled.input`
  height: 30px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #d8ccbd;
  font-family: "Open Sans", sans-serif;
  &:focus {
    border: 1px solid #d8ccbd;
    outline: none;
  }
`;
const FieldSelect = styled.select`
  height: 30px;
  border: 1px solid #d8ccbd;
  border-radius: 4px;
  font-family: "Open Sans", sans-serif;
  &:focus {
    border: 1px solid #d8ccbd;
    outline: none;
  }
`;
const OutputField = styled.div`
  display: flex;
  gap: 5px;
  background-color: rgb(248, 248, 248);

  @media (max-width: 440px) {
    width: 300px;
  }
`;

const RemoveBtn = styled.button`
  width: 60px;
  background-color: #ed5237;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
`;
