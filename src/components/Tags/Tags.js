import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setTags } from "../../features/TagsSlice";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function Tags({ onChange }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [values, setValues] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    onChange(values.map((tag) => tag.value));
  }, [values, onChange]);
  const handleOnInputChange = (e) => {
    setInput(e.target.value);
    setSearchKeyword(e.target.value);
  };

  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (searchKeyword.trim() === "") {
      return;
    }
    fetch(`http://localhost:8080/collections/tags?query=${searchKeyword}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error("Error searching items:", error);
      });
  }, [searchKeyword]);

  const handleKeyDown = (event) => {
    const isDuplicate = values.some((tag) => tag.value === input);
    const getIdx = values.filter((rec) => rec.value === input);
    if (!isDuplicate && input && event.key === "Enter") {
      const newTag = {
        value: input,
      };
      setValues([...values, newTag]);
      setInput("");
      setSearchResults([]);
      event.preventDefault();
    }
  };

  const handleDelete = (val, index) => {
    console.log("val, index", val, index);
    const currentValues = Object.assign([], values);
    currentValues.splice(index, 1);
    setValues(currentValues);
  };

  const handleClickWrapper = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    const tagValues = values.map((tag) => tag.value);
    dispatch(setTags(tagValues));
  }, [values, dispatch]);

  function handleTagSelect(tag) {
    setInput(tag);
  }

  return (
    <TagsWrapper>
      <NameAndResultWrapper>
        <p>{t("tags")}</p>
        <TagInputBox>
          {values.map((v, idx) => {
            if (v.value !== null) {
              return (
                <Tag key={idx}>
                  <span>{v.value}</span>
                  <CancelIcon
                    src={process.env.PUBLIC_URL + "/assets/cancel.png"}
                    onClick={() => handleDelete(v, idx)}
                  />
                </Tag>
              );
            }
          })}
        </TagInputBox>
      </NameAndResultWrapper>

      <TagsContainer onClick={handleClickWrapper}>
        <TagInput
          ref={inputRef}
          value={input}
          type={"text"}
          placeholder={"enter tags"}
          onChange={handleOnInputChange}
          onKeyDown={handleKeyDown}
        />
        <SearchResultWrapper>
          {searchResults?.map((result) => (
            <UlContainer key={result._id}>
              {result.matchingTag.map((tag) => (
                <li key={tag} onClick={() => handleTagSelect(tag)}>
                  {tag}
                </li>
              ))}
            </UlContainer>
          ))}
        </SearchResultWrapper>
      </TagsContainer>
    </TagsWrapper>
  );
}

const NameAndResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 5px;
`;

const TagsWrapper = styled.div`
  display: flex;

  @media (max-width: 440px) {
    justify-content: space-between;
  }
`;

const SearchResultWrapper = styled.div`
  display: flex;

  flex-direction: column;
  padding: 10px;
`;

const UlContainer = styled.ul`
  list-style: none;
`;

const TagsContainer = styled.div`
  border-radius: 2px;

  max-width: 50%;
  border: 1px solid #000;
  background-color: #fff;

  font-family: sans-serif;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 5px;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-height: 300px;
  overflow-y: scroll;

  @media (max-width: 440px) {
    max-height: 150px;
    overflow-y: scroll;
  }
`;

const CancelIcon = styled.img`
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const TagInput = styled.input`
  background: transparent;
  align-self: start;
  border: 0;
  color: #777;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 6px;
  margin-top: 1px;
  outline: none;
  padding: 5px;
`;

const Tag = styled.div`
  background-color: rgb(230, 230, 230);
  // height: 30px;
  border-radius: 2px;
  border: 1px solid #a5d24a;
  color: #000;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 5px;
  max-width: 600px;

  margin-right: 5px;
  padding: 5px;
  display: flex;
`;
const TagInputBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 500px;
  overflow: break-word;
`;
