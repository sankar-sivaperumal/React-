import React, { useEffect, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

type Props = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isSignedUp, isLoggedIn } = useAuth();

  useEffect(() => {
    const hasShownToast = localStorage.getItem("hasShownToast");
    if (!hasShownToast && !isSignedUp) {
      toast.error("Please sign up first");
      localStorage.setItem("hasShownToast", "true");
    }
  }, [isSignedUp]);

  if (!isSignedUp) {
    return <Navigate to="/signup" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
