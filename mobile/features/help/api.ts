import { api } from "@/libs/api";

export type SupportMessagePayload = {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  reason: string;
  message: string;
};

export async function createSupportMessage(payload: SupportMessagePayload) {
  const response = await api.post<{
    message: string;
    supportMessage: any;
  }>("/support", payload);

  return response.data;
}