import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor to attach `lang` param automatically to every outgoing request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const lang = localStorage.getItem("lang") || "ge";
    config.params = { ...config.params, lang };
  }
  return config;
});

export default api;
