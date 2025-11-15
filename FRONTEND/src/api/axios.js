// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 

// const api = axios.create({
//   baseURL: `${API_BASE}/api`,
//   headers: { "Content-Type": "application/json" },

// });

// // attach token if present
// api.interceptors.request.use((config) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (token && token !== "undefined") {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (e) {}
//   return config;
// });

// // gentle error handler (don't hard-redirect while debugging)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API ERROR:", error?.config?.url, error?.response?.status, error?.response?.data);
//     return Promise.reject(error);
//   }
// );

// export default api;



// src/lib/axios.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true // enable only if you use cookie sessions
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error?.config?.url, error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);

export default api;
