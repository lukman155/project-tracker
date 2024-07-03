import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,  
});

api.interceptors.request.use((config) => {
  const csrf_token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf_access_token"))
    ?.split("=")[1];
  if (csrf_token) {
    config.headers["X-CSRF-TOKEN"] = csrf_token;
  }
  return config;
});

export default api;
