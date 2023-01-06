import Cookies from "js-cookie";
import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const token = Cookies.get("token");
  const isLoggedIn = Cookies.get("isLoggedIn");

  if (
    token &&
    isLoggedIn &&
    JSON.parse(Cookies.get("user")).roles.includes("ADMIN")
  ) {
    return true;
  } else {
    return false;
  }
};

const ProtectedRoutes = () => {
  const auth = useAuth();
  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
