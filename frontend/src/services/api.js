import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("➡️ REQUEST URL:", config.url);
  console.log("➡️ RAW TOKEN:", token);

  if (
    token &&
    config.url !== "/auth/login" &&
    config.url !== "/auth/register"
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;