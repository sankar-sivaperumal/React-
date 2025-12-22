import { createContext, useState, useEffect, useContext } from "react";
import bcrypt from "bcryptjs";

type User = {
  email: string;
  password: string;
};

type AuthContextType = {
  isSignedUp: boolean;
  isLoggedIn: boolean;
  users: User[];
  currentUser: User | null;
  completeSignup: (email: string, password: string) => Promise<void>;
  completeLogin: (email: string, password: string) => void;
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
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      setIsSignedUp(parsedUsers.length > 0);
    }

    const savedLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(savedLoggedIn);

    const savedEmail = localStorage.getItem("currentUser");
    if (savedEmail && savedUsers) {
      const userList: User[] = JSON.parse(savedUsers);
      const user = userList.find((u) => u.email === savedEmail);
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Update completeSignup to hash the password before saving it
  const completeSignup = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
        const newUser = { email, password: hashedPassword };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setIsSignedUp(true);
        localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save users to localStorage

        resolve(); // Resolve the promise after successful signup
      } catch (err) {
        reject(err); // Reject the promise if there's an error
      }
    });
  };

  const completeLogin = (email: string, password: string) => {
    const user = users.find((u) => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", user.email);
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
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
      value={{
        isSignedUp,
        isLoggedIn,
        users,
        currentUser,
        completeSignup,
        completeLogin,
        logout,
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
