import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function AdminPanel() {
  const { t } = useTranslation();
  const [admin, setAdmin] = useState();
  const [allUser, setAllUser] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [click, setClick] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  function openAdminColls(userId) {
    navigate("/admin/collections");
    localStorage.setItem("userId", userId);
  }
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedUsers(allUser.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleCheckChange = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  function logoutHandler() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("status");
    navigate("/");
  }
  function deleteUser() {
    console.log("clicked");
    fetch("https://usercollection.onrender.com/admin/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds: selectedUsers, adminId: admin._id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        return response.json();
      })
      .then((data) => {
        setClick((prev) => !prev);
        if (data.message === "Admin was deleted.") {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("status");
          navigate("/auth/signup");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function BlockUser() {
    fetch("https://usercollection.onrender.com/admin/block", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ userIds: selectedUsers, adminId: admin._id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        return response.json();
      })
      .then((data) => {
        setSelectedUsers([]);
        // setSelectAll(false);
        setClick((prev) => !prev);
        if (data.message === "Admin was Blocked.") {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("status");
          navigate("/");
          // setForUpdate((prev) => !prev);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function UnblockUser() {
    fetch("https://usercollection.onrender.com/admin/unblock", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ userIds: selectedUsers }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        return response.json();
      })
      .then((data) => {
        setClick((prev) => !prev);
        setSelectedUsers([]);
        // setSelectAll(false);
        // setForUpdate((prev) => !prev);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetch("https://usercollection.onrender.com/admin", {
      method: "GET",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        const users = resData.users;

        const filteredUsers = users.filter((user) => user.role !== "admin");
        setAllUser(filteredUsers);
      })

      .catch((err) => {
        console.log(`here is error ${err}`);
      });
  }, [click]);

  useEffect(() => {
    fetch("https://usercollection.onrender.com/admin/admin", {
      method: "GET",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setAdmin(resData.user);
      })

      .catch((err) => {
        console.log(`here is error ${err}`);
      });
  }, []);
  return (
    <UsersContainer>
      <ActiveUserContainer>
        <ActiveUserInfo>
          <AdminSubContainer>
            <AdminKeys>Admin:</AdminKeys>
            <AdminName>{admin?.name}</AdminName>
          </AdminSubContainer>
        </ActiveUserInfo>

        <AdminButtonsContainer>
          <BlockBtn onClick={() => BlockUser()}>Block User</BlockBtn>
          <UNLOCKICON
            src={process.env.PUBLIC_URL + "/assets/unlock.png"}
            onClick={() => UnblockUser()}
          />
          <TrashIcon
            src={process.env.PUBLIC_URL + "/assets/trash.png"}
            onClick={() => deleteUser(selectedUsers)}
          />
          <LogoutBtn onClick={() => logoutHandler()}>{t("logout")}</LogoutBtn>
        </AdminButtonsContainer>
      </ActiveUserContainer>

      <div>
        <Table>
          <THREAD>
            <TR>
              <TH>
                <input
                  type="checkbox"
                  id="selectUsers"
                  value={isChecked}
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </TH>
              <TH>Name</TH>
              <TH>ID</TH>
              <TH>Email</TH>
              <TH>Registration time</TH>
              <TH>Status</TH>
              <TH>Manage</TH>
            </TR>
          </THREAD>
          <tbody>
            {allUser?.map((user, index) => (
              <TR key={index}>
                <TD>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleCheckChange(user._id)}
                  />
                </TD>
                <TD>{user.name}</TD>
                <TD>{user._id}</TD>
                <TD>{user.email}</TD>
                <TD>{user.createdAt}</TD>
                <TDACTIVE active={user.active}>
                  {user.active ? "Active" : "Blocked"}
                </TDACTIVE>
                <TD>
                  <OpenBtn onClick={() => openAdminColls(user._id)}>
                    {t("open")}
                  </OpenBtn>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
    </UsersContainer>
  );
}
export default AdminPanel;

const UsersContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding-left: 20px;
  padding-right: 20px;
  // background-color: #364652;
`;

const ActiveUserContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
  width: 600px;

  // height: 200px;
  background-color: #b7e4e6;
  margin-bottom: 30px;
`;

const AdminSubContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;
const AdminName = styled.p`
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
  color: green;
  font-weight: 700;
`;
const AdminKeys = styled.p`
  font-size: 16px;
  font-weight: 700;
  font-family: "Open Sans", sans-serif;
`;
const AdminButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActiveUserInfo = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  gap: 15px;
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
const TDACTIVE = styled.td`
  color: ${(props) => (props.active ? "green" : "red")};
  height: 40px;
  text-align: center;
  font-weight: 700;
  width: 90px;
  background-color: #e2ebf0;
`;
const TrashIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
const BlockBtn = styled.button`
  background-color: red;
  border: none;
  width: 100px;
  height: 30px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
`;
const UNLOCKICON = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
const LogoutBtn = styled.button`
  width: 80px;
  height: 25px;
  margin-left: 50px;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
`;
const OpenBtn = styled.button`
  height: 25px;
  width: 50px;
  border: none;
  cursor: pointer;
  background-color: #66de7b;
  border-radius: 10px;
`;
