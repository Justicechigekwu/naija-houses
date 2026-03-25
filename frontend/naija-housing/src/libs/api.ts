import axios from "axios";
import { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error?.response?.data?.code;
    const message = error?.response?.data?.message;

    if (typeof window !== "undefined" && code === "ACCOUNT_BANNED") {
      alert(
        message ||
          "Your account has been banned for violating marketplace/community standards."
      );

      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// export async function apiRequest(endpoint: string, method: string, data?: unknown) {
//   try {
//     const res = await api({
//       method,
//       url: endpoint,
//       data,
//     });
//     return res.data;
//   } catch (err: unknown) {
//     if (err instanceof AxiosError) {
//       throw new Error(err.response?.data?.message || "Something went wrong");
//     }
//     throw err;
//   }
// }


export async function apiRequest(
  endpoint: string,
  method: string,
  data?: unknown
) {
  try {
    const res = await api({
      method,
      url: endpoint,
      data,
    });
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw new Error(
        (err.response?.data as { message?: string })?.message ||
          "Something went wrong"
      );
    }
    throw err;
  }
}
export default api;