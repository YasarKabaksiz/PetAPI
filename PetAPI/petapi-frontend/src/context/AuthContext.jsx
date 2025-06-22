import React, { createContext, useState, useEffect } from "react";
import { getUserInfo } from "../services/authService";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getUserInfo(token);
          setUser(userData);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const loginAction = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginAction, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 