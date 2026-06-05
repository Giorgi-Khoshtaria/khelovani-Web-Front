import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  // Send/receive the httpOnly auth cookie on cross-origin requests.
  withCredentials: true,
});

/**
 * Request interceptor — attaches the `lang` query param (client only). Auth
 * is no longer attached here: the browser sends the httpOnly `access-token`
 * cookie automatically (client), and server-side callers pass a Bearer token
 * explicitly via the request function's optional `token` argument.
 */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const lang = localStorage.getItem("lang") || "ge";
    config.params = { ...config.params, lang };
  }
  return config;
});

/**
 * Response interceptor — on 401, clear the readable session flag + cached
 * profile and redirect to /login (client only). The httpOnly cookie itself
 * can't be cleared from JS; it's invalid/expired and gets overwritten on the
 * next login. Server-side calls just propagate the error.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isAuthEndpoint = /\/(login|register|forgot|reset)/.test(
        error.config?.url ?? "",
      );
      if (!isAuthEndpoint) {
        localStorage.removeItem("user-name-en");
        localStorage.removeItem("user-name-ge");
        localStorage.removeItem("user-profile-image");
        document.cookie = "logged_in=; path=/; max-age=0";
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
