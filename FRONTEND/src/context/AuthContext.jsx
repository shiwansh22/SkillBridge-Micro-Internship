// // // "use client"

// // // import { createContext, useState, useContext, useEffect } from "react"
// // // import api from "../api/axios"

// // // const AuthContext = createContext()

// // // export function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(null)
// // //   const [loading, setLoading] = useState(true)
// // //   const [error, setError] = useState(null)

// // //   // Check if user is already logged in on mount
// // //   useEffect(() => {
// // //     const token = localStorage.getItem("token")
// // //     const userData = localStorage.getItem("user")

// // //     if (token && userData) {
// // //       setUser(JSON.parse(userData))
// // //       api.defaults.headers.common["Authorization"] = `Bearer ${token}`
// // //     }

// // //     setLoading(false)
// // //   }, [])

// // //   const login = async (email, password, role) => {
// // //     try {
// // //       setError(null)
// // //       const response = await api.post("/users/login", { email, password, role })
// // //       const { token, user: userData } = response.data

// // //       localStorage.setItem("token", token)
// // //       localStorage.setItem("user", JSON.stringify(userData))
// // //       api.defaults.headers.common["Authorization"] = `Bearer ${token}`

// // //       setUser(userData)
// // //       return userData
// // //     } catch (err) {
// // //       const message = err.response?.data?.message || "Login failed"
// // //       setError(message)
// // //       throw new Error(message)
// // //     }
// // //   }

// // //   const register = async (email, password, name, role) => {
// // //     try {
// // //       setError(null)
// // //       const response = await api.post("/users/register", { email, password, name, role })
// // //       const { token, user: userData } = response.data

// // //       localStorage.setItem("token", token)
// // //       localStorage.setItem("user", JSON.stringify(userData))
// // //       api.defaults.headers.common["Authorization"] = `Bearer ${token}`

// // //       setUser(userData)
// // //       return userData
// // //     } catch (err) {
// // //       const message = err.response?.data?.message || "Registration failed"
// // //       setError(message)
// // //       throw new Error(message)
// // //     }
// // //   }

// // //   const logout = () => {
// // //     localStorage.removeItem("token")
// // //     localStorage.removeItem("user")
// // //     delete api.defaults.headers.common["Authorization"]
// // //     setUser(null)
// // //   }

// // //   return (
// // //     <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>{children}</AuthContext.Provider>
// // //   )
// // // }

// // // export function useAuth() {
// // //   const context = useContext(AuthContext)
// // //   if (!context) {
// // //     throw new Error("useAuth must be used within AuthProvider")
// // //   }
// // //   return context
// // // }

// // // src/context/AuthContext.jsx
// // "use client";

// // import React, { createContext, useState, useContext, useEffect } from "react";
// // import api from "../api/axios";

// // const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const userData = localStorage.getItem("user");
// //       if (token && token !== "undefined") {
// //         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //         if (userData) setUser(JSON.parse(userData));
// //       } else if (userData) {
// //         // If there's a user stored but no token, still restore the user (session style)
// //         setUser(JSON.parse(userData));
// //       } else {
// //         setUser(null);
// //       }
// //     } catch (e) {
// //       setUser(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   // Login tolerant to token-less responses
// //   const login = async (email, password, role) => {
// //     try {
// //       setError(null);
// //       const response = await api.post("/users/login", { email, password, role });

// //       console.log("LOGIN RESPONSE:", response.data);

// //       // Try common token keys
// //       const token =
// //         response.data?.token ||
// //         response.data?.accessToken ||
// //         response.data?.jwt ||
// //         response.data?.data?.token ||
// //         response.data?.data?.accessToken ||
// //         null;

// //       // Try common user keys
// //       const userData =
// //         response.data?.user ||
// //         response.data?.userData ||
// //         response.data?.data?.user ||
// //         response.data ||
// //         null; // sometimes backend returns the user object directly

// //       // If there's a token, persist it.
// //       if (token) {
// //         localStorage.setItem("token", token);
// //         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //       } else {
// //         // No token — remove any existing token and continue with user-only flow
// //         localStorage.removeItem("token");
// //         delete api.defaults.headers.common["Authorization"];
// //       }

// //       // If backend returned a user object, persist it and set state
// //       if (userData) {
// //         // If the response is wrapped in { success: true, data: { ... } }
// //         const resolvedUser = userData?.data ? userData.data : userData;
// //         localStorage.setItem("user", JSON.stringify(resolvedUser));
// //         setUser(resolvedUser);
// //         return resolvedUser;
// //       }

// //       // If neither token nor user present, throw a helpful error
// //       if (!token && !userData) {
// //         const msg = "Login succeeded but server didn't return token or user. Check backend response.";
// //         setError(msg);
// //         throw new Error(msg);
// //       }

// //       return null;
// //     } catch (err) {
// //       const message = err.response?.data?.message || err.message || "Login failed";
// //       setError(message);
// //       throw new Error(message);
// //     }
// //   };

// //   const register = async (email, password, name, role) => {
// //     try {
// //       setError(null);
// //       const response = await api.post("/users/register", { email, password, name, role });

// //       console.log("REGISTER RESPONSE:", response.data);

// //       const token =
// //         response.data?.token ||
// //         response.data?.accessToken ||
// //         response.data?.jwt ||
// //         response.data?.data?.token ||
// //         null;

// //       const userData =
// //         response.data?.user ||
// //         response.data?.userData ||
// //         response.data?.data?.user ||
// //         response.data ||
// //         null;

// //       if (token) {
// //         localStorage.setItem("token", token);
// //         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //       } else {
// //         localStorage.removeItem("token");
// //         delete api.defaults.headers.common["Authorization"];
// //       }

// //       if (userData) {
// //         const resolvedUser = userData?.data ? userData.data : userData;
// //         localStorage.setItem("user", JSON.stringify(resolvedUser));
// //         setUser(resolvedUser);
// //         return resolvedUser;
// //       }

// //       if (!token && !userData) {
// //         const msg = "Registration succeeded but server didn't return token or user.";
// //         setError(msg);
// //         throw new Error(msg);
// //       }

// //       return null;
// //     } catch (err) {
// //       const message = err.response?.data?.message || err.message || "Registration failed";
// //       setError(message);
// //       throw new Error(message);
// //     }
// //   };

// //   const logout = () => {
// //     try {
// //       localStorage.removeItem("token");
// //       localStorage.removeItem("user");
// //     } catch (e) {}
// //     delete api.defaults.headers.common["Authorization"];
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export function useAuth() {
// //   const context = useContext(AuthContext);
// //   if (!context) throw new Error("useAuth must be used within AuthProvider");
// //   return context;
// // }




// // src/context/AuthContext.jsx
// "use client";

// import React, { createContext, useState, useContext, useEffect } from "react";
// import api from "../api/axios";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     try {
//       const token = localStorage.getItem("token");
//       const userData = localStorage.getItem("user");
//       if (token && token !== "undefined") {
//         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//         if (userData) setUser(JSON.parse(userData));
//       } else if (userData) {
//         setUser(JSON.parse(userData));
//       } else {
//         setUser(null);
//       }
//     } catch (e) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // login -> POST to /api/users/login via axios base
//   const login = async (email, password, role) => {
//     try {
//       setError(null);
//       const response = await api.post("/users/login", { email, password, role });

//       // Backend in your project returns user directly (no token). Handle both forms.
//       const token =
//         response.data?.token ||
//         response.data?.accessToken ||
//         response.data?.jwt ||
//         response.data?.data?.token ||
//         null;

//       const userData =
//         response.data?.user ||
//         response.data?.userData ||
//         response.data?.data?.user ||
//         response.data ||
//         null;

//       if (token) {
//         localStorage.setItem("token", token);
//         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       } else {
//         localStorage.removeItem("token");
//         delete api.defaults.headers.common["Authorization"];
//       }

//       if (userData) {
//         const resolvedUser = userData?.data ? userData.data : userData;
//         localStorage.setItem("user", JSON.stringify(resolvedUser));
//         setUser(resolvedUser);
//         return resolvedUser;
//       }

//       const msg = "Login succeeded but server didn't return token or user. Check backend response.";
//       setError(msg);
//       throw new Error(msg);
//     } catch (err) {
//       const message = err.response?.data || err.message || "Login failed";
//       setError(message);
//       throw new Error(message);
//     }
//   };

//   const register = async (name, email, password, role) => {
//     try {
//       setError(null);
//       const response = await api.post("/users/register", { name, email, password, role });

//       // backend returns created user; handle tokenless flow too
//       const token =
//         response.data?.token ||
//         response.data?.accessToken ||
//         response.data?.jwt ||
//         response.data?.data?.token ||
//         null;

//       const userData =
//         response.data?.user ||
//         response.data?.userData ||
//         response.data?.data?.user ||
//         response.data ||
//         null;

//       if (token) {
//         localStorage.setItem("token", token);
//         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       } else {
//         localStorage.removeItem("token");
//         delete api.defaults.headers.common["Authorization"];
//       }

//       if (userData) {
//         const resolvedUser = userData?.data ? userData.data : userData;
//         localStorage.setItem("user", JSON.stringify(resolvedUser));
//         setUser(resolvedUser);
//         return resolvedUser;
//       }

//       const msg = "Registration succeeded but server didn't return token or user.";
//       setError(msg);
//       throw new Error(msg);
//     } catch (err) {
//       const message = err.response?.data || err.message || "Registration failed";
//       setError(message);
//       throw new Error(message);
//     }
//   };

//   const logout = () => {
//     try {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     } catch (e) {}
//     delete api.defaults.headers.common["Authorization"];
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// }






"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && token !== "undefined") {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        if (userData) setUser(JSON.parse(userData));
      } else if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGIN
  const login = async (email, password, role) => {
    try {
      setError(null);

      const response = await api.post("/users/login", { email, password, role });

      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.jwt ||
        response.data?.data?.token ||
        null;

      const userData =
        response.data?.user ||
        response.data?.userData ||
        response.data?.data?.user ||
        response.data ||
        null;

      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      }

      if (userData) {
        const resolvedUser = userData?.data ? userData.data : userData;
        localStorage.setItem("user", JSON.stringify(resolvedUser));
        setUser(resolvedUser);
        return resolvedUser;
      }

      throw new Error("Login succeeded but backend returned no user.");
    } catch (err) {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : JSON.stringify(err.response?.data) || err.message;

      setError(msg);
      throw new Error(msg);
    }
  };

  // REGISTER — FIXED SIGNATURE (name, email, password, role)
  const register = async (name, email, password, role) => {
    try {
      setError(null);

      console.log("axios baseURL:", api.defaults.baseURL);

      const response = await api.post("/users/register", {
        name,
        email,
        password,
        role,
      });

      const userData = response.data || null;

      localStorage.removeItem("token"); // no token backend

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
      }

      throw new Error("Registration succeeded but no user returned.");
    } catch (err) {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : JSON.stringify(err.response?.data) || err.message;

      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
