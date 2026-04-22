import { api } from "@/libs/api";
import type {
  ForgotPasswordPayload,
  GetMeResponse,
  GoogleAuthPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  SignupPayload,
  SignupResponse,
} from "./types";

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload, {
    headers: {
      "x-client-type": "mobile",
    },
  });

  return response.data;
}

export async function signupUser(
  payload: SignupPayload
): Promise<SignupResponse> {
  const response = await api.post<SignupResponse>("/auth/register", payload, {
    headers: {
      "x-client-type": "mobile",
    },
  });

  return response.data;
}

export async function googleLoginUser(
  payload: GoogleAuthPayload
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/google", payload, {
    headers: {
      "x-client-type": "mobile",
    },
  });

  return response.data;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    "/reset/forgot-password",
    payload
  );

  return response.data;
}

export async function resetPassword(
  token: string,
  payload: ResetPasswordPayload
): Promise<{ message: string }> {
  const response = await api.put<{ message: string }>(
    `/reset/reset-password/${token}`,
    payload
  );

  return response.data;
}

export async function getMe(): Promise<GetMeResponse> {
  const response = await api.get<GetMeResponse>("/auth/me");
  return response.data;
}

export async function logoutUser(): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
}