import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
});

/**
 * Request interceptor — attaches `lang` query param and `Authorization`
 * header automatically. Both pulled from client-side storage; on the
 * server, callers must pass these explicitly (or use cookies upstream).
 */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const lang = localStorage.getItem("lang") || "ge";
    config.params = { ...config.params, lang };

    if (!config.headers?.Authorization) {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

/**
 * Response interceptor — on 401, clear stored auth and redirect to /login
 * (client only). Server-side calls just propagate the error.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isAuthEndpoint = /\/(login|register|forgot|reset)/.test(
        error.config?.url ?? "",
      );
      if (!isAuthEndpoint) {
        localStorage.removeItem("access-token");
        localStorage.removeItem("user-name-en");
        localStorage.removeItem("user-name-ge");
        localStorage.removeItem("user-profile-image");
        document.cookie = "access-token=; path=/; max-age=0";
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
