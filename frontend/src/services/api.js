import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Automatically attach token
api.interceptors.request.use((config) => {
  // Get user object from localStorage
  const userStr = localStorage.getItem("user");
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }

  return config;
});

export default api;
