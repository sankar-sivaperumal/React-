import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
