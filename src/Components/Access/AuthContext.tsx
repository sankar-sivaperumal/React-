import { createContext, useState, useEffect, useContext } from "react";

type User = {
  email: string;
  password: string;
};

type AuthContextType = {
  isSignedUp: boolean;
  isLoggedIn: boolean;
  users: User[];
  currentUser: User | null;
  completeSignup: (email: string, password: string) => void;
  completeLogin: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(savedLoggedIn);

    const savedEmail = localStorage.getItem("currentUser");
    if (savedEmail && savedUsers) {
      const userList: User[] = JSON.parse(savedUsers);
      const user = userList.find((u) => u.email === savedEmail);
      if (user) setCurrentUser(user);
    }

    setIsSignedUp(users.length > 0);
  }, []);

  const completeSignup = (email: string, password: string) => {
    const newUser = { email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setIsSignedUp(true);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const completeLogin = (email: string) => {
    const user = users.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", user.email);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{ isSignedUp, isLoggedIn, users, currentUser, completeSignup, completeLogin, logout }}
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
