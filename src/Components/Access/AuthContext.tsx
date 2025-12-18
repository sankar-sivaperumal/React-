import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  isSignedUp: boolean;
  isLoggedIn: boolean;
  completeSignup: () => void;
  completeLogin: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isSignedUp,
        isLoggedIn,
        completeSignup: () => setIsSignedUp(true),
        completeLogin: () => setIsLoggedIn(true),
        logout: () => {
          setIsSignedUp(false);
          setIsLoggedIn(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
