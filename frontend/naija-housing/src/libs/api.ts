import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function apiRequest(endpoint: string, method: string, data?: any) {
  try {
    const res = await api({
      method,
      url: endpoint,
      data,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Something went wrong");
  }
}

export default api;
