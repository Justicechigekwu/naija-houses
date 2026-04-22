import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "@/libs/env";
import { getAccessToken, removeAccessToken } from "@/libs/auth-storage";

type ApiErrorResponse = {
  message?: string;
  code?: string;
};


export const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});
console.log("Using Api base URL:", env.apiUrl);

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401) {
      await removeAccessToken();
    }

    if (status === 403 && code === "ACCOUNT_BANNED") {
      await removeAccessToken();
    }

    return Promise.reject(error);
  }
);