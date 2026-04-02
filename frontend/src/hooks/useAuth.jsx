import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const getStoredUser = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role) return { user: null, role: null };

  return {
    user: {
      _id: localStorage.getItem("userId") || "",
      name: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
      role,
    },
    role,
  };
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored.user);
    setUserRole(stored.role);
    setLoading(false);
  }, []);

  const storeUser = (authUser, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", authUser.role);
    localStorage.setItem("userId", authUser._id || authUser.id || "");
    localStorage.setItem("userName", authUser.name || "");
    localStorage.setItem("userEmail", authUser.email || "");
    setUser(authUser);
    setUserRole(authUser.role);
  };

  const signUp = async (name, email, password, role = "customer") => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        storeUser(data.user, data.token);
      }

      return { data, error: data.message || data.error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        storeUser(data.user, data.token);
      }

      return { data, error: data.message || data.error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null);
    setUserRole(null);
    navigate("/auth");
  };

  return {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
