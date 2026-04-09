import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const adminApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let sessionExpiredHandler: null | (() => void) = null;

export const setAdminSessionExpiredHandler = (handler: () => void) => {
  sessionExpiredHandler = handler;
};

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const requestUrl = error?.config?.url || "";

    const isAuthRoute =
      requestUrl.includes("/admin/auth/login") ||
      requestUrl.includes("/admin/auth/register") ||
      requestUrl.includes("/admin/auth/logout");

    const isAdminAuthError =
      status === 401 &&
      (message === "Invalid or expired token" ||
        message === "Unauthorized, token missing." ||
        message === "Unauthorized");

    if (!isAuthRoute && isAdminAuthError && typeof window !== "undefined") {
      sessionExpiredHandler?.();
    }

    return Promise.reject(error);
  }
);

export default adminApi;