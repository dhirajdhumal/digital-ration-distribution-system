import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Automatically attach token
api.interceptors.request.use(
  (config) => {
    // Get user object from localStorage
    const userStr = localStorage.getItem("user");
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          // Validate token format (basic check)
          const token = user.token.trim();
          if (token && token.length > 20) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            console.warn("Invalid token format, clearing localStorage");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid, clear localStorage and redirect to login
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message || "";
      if (message.includes("token") || message.includes("authorized")) {
        console.warn("Token invalid, clearing localStorage");
        localStorage.removeItem("user");
        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
