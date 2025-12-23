import React, { createContext, useState, useContext } from 'react';

interface User {
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean; 
  currentUser: User | null; 
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState<User | null>(
    localStorage.getItem('currentUser') ? { email: localStorage.getItem('currentUser')! } : null
  );

  const login = (email: string, token: string) => {
   
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", email);
    localStorage.setItem("isLoggedIn", "true");

    //  Update state to trigger NavBar
    setIsLoggedIn(true); 
    setCurrentUser({ email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
