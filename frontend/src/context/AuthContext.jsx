// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // user: { id, name, email, role }
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------------
  // AUTO-LOGIN: Validate session on refresh
  // ---------------------------------------------------------------------
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      setUser({ ...res.data.user, role: res.data.user.role.toLowerCase() });
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------------------
  const login = async (email, password) => {
    const res = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
      const u = res.data.user;
      const safeUser = { ...u, role: u?.role?.toLowerCase() };
      setUser(safeUser);
      return safeUser;
  };

  // ---------------------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------------------
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      setUser(null);  // clear state
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkSession,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
