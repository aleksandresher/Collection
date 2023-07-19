import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Select from "react-select";
import CustomFields from "../CustomField/CustomFields";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import gfm from "remark-gfm";

function CollectionModal({ modalActive, userId, collectionId }) {
  const { t } = useTranslation();
  const [additionalField, setAdditionalField] = useState(false);
  const [description, setDescription] = useState("");
  const fields = useSelector((state) => state.fields);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [collections, setCollections] = useState({
    name: "",
    description: "",
    image: "",
  });
  const categoryOptions = [
    { value: "books", label: t("categories.books") },
    { value: "drinks", label: t("categories.drinks") },
    { value: "clothes", label: t("categories.clothes") },
    { value: "movies", label: t("categories.movies") },
    { value: "music", label: t("categories.music") },
    { value: "recipes", label: t("categories.recipes") },
    { value: "travel", label: t("categories.travel") },
    { value: "games", label: t("categories.games") },
    { value: "coins", label: t("categories.coins") },
    { value: "plants", label: t("categories.plants") },
    { value: "accessories", label: t("categories.accessories") },
    { value: "wine", label: t("categories.wine") },
    { value: "board games", label: t("categories.boardgame") },
    { value: "photography", label: t("categories.photography") },
    { value: "cars", label: t("categories.cars") },
    { value: "pets", label: t("categories.pets") },
    { value: "furniture", label: t("categories.furniture") },
    { value: "other", label: t("categories.others") },
  ];

  function handleCategoryChange(selectedOption) {
    if (selectedOption && selectedOption.value === "other") {
      setAdditionalField(true);
      setSelectedCategory("");
    } else if (selectedOption) {
      setAdditionalField(false);
      setSelectedCategory(selectedOption.value);
    } else {
      setAdditionalField(false);
      setSelectedCategory(null);
    }
  }

  function handleCustomCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  const [image, setImage] = useState(null);
  console.log(`selectedCategory: ${selectedCategory}`);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setCollections((prevCollections) => ({
      ...prevCollections,
      [name]: value,
    }));
  }

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dlku11fhn",
        uploadPreset: "ugdmft9d",
      },
      function(error, result) {
        if (!error && result && result.event === "success") {
          setCollections((prevCollections) => ({
            ...prevCollections,
            image: result.info.secure_url,
          }));
          setImage(result.info.secure_url);
        }
      }
    );
  }, []);

  function handleUpload() {
    widgetRef.current.open();
  }

  function createCollection(event, collections, userId, fields) {
    event.preventDefault();
    fetch("http://localhost:8080/collections/create", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collections: {
          ...collections,
          category: selectedCategory,
          description: description,
        },
        userId: userId,
        dynamicFields: fields,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          console.log("Error updating collections.");
          throw new Error("Failed to update collections.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  console.log(`selectedCategory: ${selectedCategory}`);

  return (
    <ModalContainer>
      <CollectionModalForm>
        <InputContainer>
          <InputLabel htmlFor="name">{t("name")}</InputLabel>
          <CollInput
            type="text"
            id="name"
            name="name"
            onChange={handleInputChange}
          />
        </InputContainer>
        <DescriptionInputContainer>
          <InputContainer>
            <InputLabel htmlFor="description">{t("description")}</InputLabel>
            <DescriptionInput
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </InputContainer>
          <MarkDownWrapper>
            <MarkDownLabel>{t("preview")}</MarkDownLabel>
            <MarkDownContainer>
              <ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown>
            </MarkDownContainer>
          </MarkDownWrapper>
        </DescriptionInputContainer>
        <ReactSelect
          options={categoryOptions}
          value={selectedCategory?.value}
          onChange={handleCategoryChange}
          placeholder={t("selectCategory")}
          isClearable
          isSearchable
          menuPlacement="auto"
        />
        {additionalField && (
          <CustomCategoryInput
            placeholder="Enter a category"
            value={selectedCategory}
            onChange={handleCustomCategoryChange}
          />
        )}

        <ImgUploadBtn type="button" onClick={() => handleUpload()}>
          {t("imageUpload")}
        </ImgUploadBtn>

        <CustomFields />
        <CollectionBtnContainer>
          <CollCreateBtn
            onClick={(event) =>
              createCollection(event, collections, userId, fields)
            }
          >
            {t("createColl")}
          </CollCreateBtn>
          <CancelBtn onClick={() => modalActive()}>{t("close")}</CancelBtn>
        </CollectionBtnContainer>

        {image ? <UploadedImage src={image} /> : ""}
      </CollectionModalForm>
    </ModalContainer>
  );
}

export default CollectionModal;

const CollectionModalForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalContainer = styled.div`
  display: flex;
  width: 800px;
  height: 600px;
  padding: 30px;
  background-color: #f8f8f8;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 5px;
`;
const DescriptionInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 600px;
  align-items: center;
  gap: 15px;

  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

const MarkDownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const MarkDownContainer = styled.div`
  max-width: 300px;
  height: 120px;
  word-wrap: break-word;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  border-radius: 4px;
  outline: none;
  border: 1px solid #c0c5c1;
  padding: 10px 10px;
`;

const InputLabel = styled.label`
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
`;
const MarkDownLabel = styled.label`
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
`;
const UploadedImage = styled.img`
  width: 300px;
  height: 200px;
`;

const CollInput = styled.input`
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
const DescriptionInput = styled.textarea`
  height: 50px;
  width: 300px;
  height: 120px;
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

const CollectionBtnContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;

  @media (max-width: 440px) {
    justify-content: flex-start;
  }
`;

const CollCreateBtn = styled.button`
  width: 30%;
  height: 30px;
  cursor: pointer;

  background-color: #34ebe1;
  border-radius: 8px;
  font-family: "Open Sans", sans-serif;
  border: none;

  @media (max-width: 440px) {
    width: 130px;
  }
`;
const CancelBtn = styled.button`
  width: 20%;
  height: 30px;
  cursor: pointer;
  border-radius: 8px;
  font-family: "Open Sans", sans-serif;
  border: none;
`;

const ImgUploadBtn = styled.button`
  width: 120px;
  height: 30px;
  font-family: "Open Sans", sans-serif;
  border: none;
  cursor: pointer;
  background-color: #3ad649;
  border-radius: 10px;
`;
const CustomCategoryInput = styled.input`
  height: 40px;
  border-radius: 4px;
  outline: none;
  border: 1px solid #c0c5c1;
  padding: 10px 10px;
  font-size: 16px;

  &:focus {
    border: 1px solid #d8ccbd;
    outline: none;
  }
`;

const ReactSelect = styled(Select)`
  width: 100%;

  @media (max-width: 440px) {
    width: 300px;
  }
`;
