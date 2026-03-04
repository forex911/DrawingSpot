import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );
  const [userId, setUserId] = useState(
    localStorage.getItem("userId") || null
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || "USER"
  );
  const [isGoogleUser, setIsGoogleUser] = useState(
    localStorage.getItem("isGoogleUser") === "true"
  );

  // Global state for chat UI
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Accept a user object { id, name, email, role } from the login response
  const login = (user) => {
    localStorage.setItem("auth", "true");
    if (user && user.id) {
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name || "");
      localStorage.setItem("userRole", user.role || "USER");
      localStorage.setItem("isGoogleUser", user.isGoogleUser ? "true" : "false");
      setUserId(user.id);
      setUserName(user.name || "");
      setUserRole(user.role || "USER");
      setIsGoogleUser(!!user.isGoogleUser);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isGoogleUser");
    setIsAuthenticated(false);
    setUserId(null);
    setUserName("");
    setUserRole("USER");
    setIsGoogleUser(false);
    setIsChatOpen(false); // Close chat on logout
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated, login, logout,
      userId, userName, userRole, isGoogleUser,
      isChatOpen, setIsChatOpen, login // <-- wait I shouldn't duplicate login
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
