import { useState } from "react";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";

function RatingStar({ collectionId, averagescore }) {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const userId = localStorage.getItem("userId");

  function rateCollection(collectionId, userId, rating) {
    const url = `https://usercollection.onrender.com/collections/rate/${userId}/${collectionId}`;

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: rating }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to rate the collection.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log("Collection rated:", resData.collection);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        const currentrating = index + 1;

        const handleClick = () => {
          setRating(currentrating);
          rateCollection(collectionId, userId, currentrating);
        };
        return (
          <label key={index}>
            <RadioInput
              type="radio"
              name="rating"
              value={currentrating}
              onClick={() => handleClick()}
            />
            <StarIcon
              size={20}
              currentrating={currentrating}
              hover={hover}
              rating={rating}
              averagescore={averagescore}
              onMouseEnter={() => setHover(currentrating)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}
export default RatingStar;

const StarIcon = styled(FaStar)`
  color: ${(props) =>
    props.currentrating <= (props.hover || props.rating)
      ? "#ffc107"
      : props.currentrating <= props.averagescore
      ? "#85bb2f"
      : "#e4e5e9"}; // Gray color for remaining stars
  width: 15px;
  height: 15px;
  cursor: pointer;
`;
const RadioInput = styled.input`
  display: none;
`;
