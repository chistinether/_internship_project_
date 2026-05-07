// src/context/UserContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name:  localStorage.getItem("name")  || "User",
    email: localStorage.getItem("email") || "—",
    phone: localStorage.getItem("phone") || "",
    role:  localStorage.getItem("role")  || "student",
    token: localStorage.getItem("token") || "",
  });

  const updateUser = useCallback((changes) => {
    // Persist to localStorage
    Object.entries(changes).forEach(([k, v]) => localStorage.setItem(k, v));
    // Update React state → triggers re-render in ALL consumers
    setUser(prev => ({ ...prev, ...changes }));
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser({ name: "", email: "", phone: "", role: "", token: "" });
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);