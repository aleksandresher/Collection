import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
function CollectionForView() {
  const [collection, setCollection] = useState();
  const { collectionId } = useParams();
  const navigate = useNavigate();

  function handleItemRoute(itemId) {
    localStorage.setItem("itemId", itemId);
    navigate(`/guest/${collectionId}/${itemId}`);
  }
  useEffect(() => {
    fetch(
      `https://usercollection.onrender.com/collections/singleCollection/${collectionId}`
    )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setCollection(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <CollectionForViewWrapper>
      <Table>
        <THREAD>
          <TR>
            <TH>Name</TH>
            <TH>Tags</TH>
            <TH>Manage</TH>
          </TR>
        </THREAD>
        <tbody>
          {collection?.collection.items.map((item, index) => (
            <TR key={index}>
              <TD>{item.name}</TD>
              <TD>{item.tags}</TD>
              <TD>
                <OpenBtn onClick={() => handleItemRoute(item._id)}>
                  Open
                </OpenBtn>
              </TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </CollectionForViewWrapper>
  );
}
export default CollectionForView;
const CollectionForViewWrapper = styled.div`
  width: 100%;
`;
const Table = styled.table`
  width: 100%;
`;
const TR = styled.tr`
  // border: 1px solid;
  align-items: center;
`;
const TH = styled.th`
  // border: 1px solid;
  color: #fff;
  text-transform: uppercase;
  font-family: "Open Sans", sans-serif;
  font-size: 20px;

  @media (max-width: 440px) {
    font-size: 14px;
  }
`;

const TD = styled.td`
  height: 50px;
  text-align: center;

  background-color: #e2ebf0;
`;
const THREAD = styled.thead`
  background-color: #364652;
  height: 40px;
`;
const OpenBtn = styled.button`
  height: 25px;
  width: 50px;
  border: none;
  cursor: pointer;
  background-color: #66de7b;
  border-radius: 10px;
`;
