// import { useState, useEffect } from "react";
// import styled from "styled-components";
// import { useTranslation } from "react-i18next";

// function AdminColls() {
//   const { t } = useTranslation();
//   const [collectionItems, setCollectionItems] = useState();
//   const [selectedCollections, setSelectedCollections] = useState([]);
//   const [user, setUser] = useState();
//   console.log(`collectionItemsAdmin: ${collectionItems}`);
//   const userId = localStorage.getItem("userId");

//   useEffect(() => {
//     fetch("http://localhost:8080/users/getUsers/" + userId, {})
//       .then((res) => {
//         if (res.status !== 200) {
//           throw new Error("Failed to fetch status");
//         }
//         return res.json();
//       })
//       .then((resData) => {
//         setUser(resData);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   useEffect(() => {
//     fetch("http://localhost:8080/collections/getCollections/" + userId, {})
//       .then((res) => {
//         if (res.status !== 200) {
//           console.log("Error retrieving collections.");
//           throw new Error("Failed to retrieve collections.");
//         }
//         return res.json();
//       })
//       .then((resData) => {
//         setCollectionItems(resData);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   const handleCheckChange = (collectionId) => {
//     if (selectedCollections.includes(collectionId)) {
//       setSelectedCollections(
//         selectedCollections.filter((id) => id !== collectionId)
//       );
//     } else {
//       setSelectedCollections([...selectedCollections, collectionId]);
//     }
//   };
//   return (
//     <UsersContainer>
//       {/* {modal ? (
//         <ModalDiv>
//           <CollectionModal
//             modalActive={changeModal}
//             userId={userId}
//             collectionId={user?.user.collections._id}
//           />
//         </ModalDiv>
//       ) : (
//         ""
//       )} */}
//       {/* <ActiveUserInfo> */}
//       <AdminSubContainer>
//         <NameBox>
//           <NameKey>{t("user")}</NameKey>
//           <KeyValue>{user?.user?.name}</KeyValue>
//         </NameBox>
//         <EmailBox>
//           <EmailKey>{t("email")}</EmailKey>
//           <KeyValue>{user?.user?.email}</KeyValue>
//         </EmailBox>

//         <AddCollBtn onClick={() => setModal((prev) => !prev)}>
//           {t("addColl")}
//         </AddCollBtn>
//         <TrashIcon
//           src={process.env.PUBLIC_URL + "/assets/trash.png"}
//           onClick={() => deleteCollection(selectedCollections)}
//         />
//         <LogoutBtn onClick={() => logoutHandler()}>{t("logout")}</LogoutBtn>
//       </AdminSubContainer>

//       <div>
//         <Table>
//           <THREAD>
//             <TR>
//               <TH></TH>
//               <TH>Name</TH>
//               <TH>Description</TH>
//               <TH>Theme</TH>
//               <TH>Image</TH>
//               <TH>Manage</TH>
//             </TR>
//           </THREAD>
//           <tbody>
//             {collectionItems?.collections?.map((collection, index) => (
//               <TR key={index}>
//                 <TD>
//                   <input
//                     type="checkbox"
//                     checked={selectedCollections.includes(collection._id)}
//                     onChange={() => handleCheckChange(collection._id)}
//                   />
//                 </TD>
//                 <TD>{collection.name}</TD>
//                 <TD>{collection.description}</TD>
//                 <TD>{collection._id}</TD>
//                 <TD>
//                   <a href={collection.image}>{collection.image}</a>
//                 </TD>
//                 <TD>
//                   {/* <OpenBtn
//                     onClick={() =>
//                       handleCollection(collection._id, user.user._id)
//                     }
//                   >
//                     {t("open")}
//                   </OpenBtn> */}
//                 </TD>
//               </TR>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </UsersContainer>
//   );
// }

// export default AdminColls;

// const TrashIcon = styled.img`
//   width: 24px;
//   height: 24px;
//   cursor: pointer;
// `;

// const LogoutBtn = styled.button`
//   width: 80px;
//   height: 30px;
//   margin-left: 50px;
//   border: none;
//   font-weight: 700;
//   border-radius: 10px;
//   cursor: pointer;
//   font-family: "Open Sans", sans-serif;
//   background-color: #ed5237;
//   text-transform: uppercase;
// `;

// const AddCollBtn = styled.button`
//   border-radius: 10px;
//   background-color: #66de7b;
//   border: none;
//   height: 30px;
//   width: 140px;
//   font-weight: 700;
//   text-transform: uppercase;
//   cursor: pointer;
// `;

// const OpenBtn = styled.button`
//   height: 25px;
//   width: 50px;
//   border: none;
//   cursor: pointer;
//   background-color: #66de7b;
//   border-radius: 10px;
// `;

// const ModalDiv = styled.div`
//   position: absolute;
// `;

// const UsersContainer = styled.div`
//   width: 100%;
//   height: 100ch;
//   padding-left: 20px;
//   padding-right: 20px;
//   // background-color: #364652;
//   position: relative;
// `;

// const AdminSubContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 15px;

//   padding: 15px;
// `;

// const NameKey = styled.p`
//   font-size: 16px;
//   font-weight: 700;
//   font-family: "Open Sans", sans-serif;
//   text-transform: uppercase;
// `;

// const EmailKey = styled.p`
//   font-size: 16px;
//   font-weight: 700;
//   font-family: "Open Sans", sans-serif;
//   text-transform: uppercase;
// `;

// const Table = styled.table`
//   width: 100%;
// `;
// const TR = styled.tr`
//   // border: 1px solid;
//   align-items: center;
// `;
// const TH = styled.th`
//   // border: 1px solid;
//   color: #fff;
//   text-transform: uppercase;
//   font-family: "Open Sans", sans-serif;
//   font-size: 20px;
// `;

// const TD = styled.td`
//   height: 50px;
//   text-align: center;

//   background-color: #e2ebf0;
// `;

// const ImageTD = styled.td`
//   height: 50px;
//   text-align: center;

//   background-color: #e2ebf0;
// `;

// const THREAD = styled.thead`
//   background-color: #364652;
//   height: 40px;
// `;
// const TDACTIVE = styled.td`
//   color: ${(props) => (props.active ? "green" : "red")};
//   height: 40px;
//   text-align: center;
//   font-weight: 700;
//   width: 90px;
//   background-color: #e2ebf0;
// `;
// const NameBox = styled.div`
//   display: flex;
//   gap: 10px;
//   align-items: center;
// `;

// const EmailBox = styled.div`
//   display: flex;
//   gap: 10px;
//   align-items: center;
// `;
// const KeyValue = styled.p`
//   font-family: "Open Sans", sans-serif;
// `;
