// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Initialize user from localStorage / token
//   useEffect(() => {
//     const initUser = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch("/api/auth/me", {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch user");

//         const data = await res.json();
//         setUser(data.user);
//         setUserRole(data.user.role);
//       } catch (err) {
//         console.error(err);
//         localStorage.removeItem("authToken");
//         setUser(null);
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initUser();
//   }, []);

//   // Sign up
//   const signUp = async (email, password, fullName, role = "customer") => {
//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, fullName, role }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("authToken", data.token);
//         setUser(data.user);
//         setUserRole(data.user.role);
//       }

//       return { data, error: data.error };
//     } catch (error) {
//       return { data: null, error };
//     }
//   };

//   // Sign in
//   const signIn = async (email, password) => {
//     try {
//       const res = await fetch("/api/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("authToken", data.token);
//         setUser(data.user);
//         setUserRole(data.user.role);
//       }

//       return { error: data.error };
//     } catch (error) {
//       return { error };
//     }
//   };

//   // Sign out
//   const signOut = () => {
//     localStorage.removeItem("authToken");
//     setUser(null);
//     setUserRole(null);
//     navigate("/auth");
//   };

//   return {
//     user,
//     userRole,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//   };
// };

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize user from token
  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);
        setUserRole(data.user.role);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("authToken");
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // Sign up
  const signUp = async (name, email, password, role = "user") => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setUserRole(data.user.role);
      }

      return { data, error: data.error };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign in
  const signIn = async (email, password) => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setUserRole(data.user.role);
      }

      return { error: data.error };
    } catch (error) {
      return { error };
    }
  };

  // Sign out
  const signOut = () => {
    localStorage.removeItem("authToken");
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