import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Інтерцептор для додавання JWT токена до кожного запиту
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
