import { MantineProvider } from "@mantine/core";
import axios from "axios";
import {
  AdminContact,
  Authentication,
  CRM,
  CheckOut,
  CreatePurchase,
  CreateUser,
  Home,
  LegalsAndAgreements,
  Members,
  Notifications,
  OptionPage,
  Products,
  Profile,
  PurchaseOrder,
  Sales,
  SharedDocuments,
  Tree,
  Unauthorized,
  UserManagement,
} from "./pages";
import { Navigate, Route, Routes } from "react-router-dom";
import { EditUser, Login, UserInfo } from "./components";
import { useEffect, useState } from "react";
import { GridSkeleton } from "./components/skeletons/GridSkeleton";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log("refreshToken in logout: ", userData.refreshToken);
      await axios.post("/logout");
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.log("error in handleLogout", error);
    }
  };

  useEffect(() => {
    setUser(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Routes>
        <Route path="/components" element={<GridSkeleton />} />
        <Route
          exact
          path="/"
          element={
            user ? (
              <Navigate to={"/home/profile"} />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />
        <Route
          path="/home"
          element={
            user ? (
              <Home handleLogout={handleLogout} />
            ) : (
              <Login setUser={setUser} />
            )
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="crm" element={<CRM />} />
          <Route path="admin-contact" element={<AdminContact />}>
            <Route path="user-info" element={<UserInfo />} />
          </Route>
          <Route path="members" element={<Members />} />
          <Route path="check-out" element={<CheckOut />} />
          <Route path="option" element={<OptionPage />} />
          <Route path="create-purchase-order" element={<CreatePurchase />} />
          <Route path="tree" element={<Tree />} />
          <Route path="purchase-order" element={<PurchaseOrder />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="sales" element={<Sales />} />
          <Route path="legals-agreements" element={<LegalsAndAgreements />} />
          <Route path="shared-documents" element={<SharedDocuments />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="edit-user" element={<EditUser />} />
          <Route path="authentications" element={<Authentication />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}
