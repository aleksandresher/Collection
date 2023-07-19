import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SignUp from "./Pages/LoginSign/SignUp";
import SingIn from "./Pages/LoginSign/SignIn";
import UsersPage from "./Pages/LoginSign/Users";
import SingleCollection from "./Pages/LoginSign/SingleCollection";
import AdminPanel from "./Pages/Admin/Admin";
import SingleItem from "./Pages/LoginSign/SingleItem";
import HomePage from "./Pages/Home";
import PasswordReset from "./components/Password/PasswordReset";
import SendingResetEmail from "./components/Password/SendingResetEmail";
import MultipleItems from "./components/Search/SearcheMultipleItems";
import CollectionForView from "./components/Collection/CollectionForView";
import ItemForView from "./components/Item/ItemForView";
import AdminColls from "./Pages/Admin/AdminColl";
import { useTranslation } from "react-i18next";
// import { socket } from "./socket";

function App() {
  const { t } = useTranslation();
  const [isAuth, setIsAuth] = useState(localStorage.getItem("status"));

  function toggleStatus() {
    setIsAuth((prev) => !prev);
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signIn" element={<SingIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/collections" element={<UsersPage />} />

        {isAuth ? (
          <Route
            path="/users"
            element={<UsersPage toggleStatus={toggleStatus} />}
          />
        ) : (
          ""
        )}
        <Route path="/:collectionId" element={<SingleCollection />} />
        <Route path="/item/:itemId" element={<SingleItem />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/password-reset" element={<SendingResetEmail />} />
        <Route path="/multipleItems" element={<MultipleItems />} />
        <Route path="/guest/:collectionId" element={<CollectionForView />} />
        <Route path="/guest/:collectionId/:itemId" element={<ItemForView />} />
      </Routes>
    </div>
  );
}
export default App;
