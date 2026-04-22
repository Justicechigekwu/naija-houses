import { api } from "@/libs/api";
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "./types";

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  const formData = new FormData();

  if (payload.firstName) formData.append("firstName", payload.firstName);
  if (payload.lastName) formData.append("lastName", payload.lastName);
  if (payload.email) formData.append("email", payload.email);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.location) formData.append("location", payload.location);
  if (payload.bio) formData.append("bio", payload.bio);
  if (payload.dob) formData.append("dob", payload.dob);
  if (payload.sex) formData.append("sex", payload.sex);

  if (payload.avatar) {
    formData.append("avatar", {
      uri: payload.avatar.uri,
      name: payload.avatar.name,
      type: payload.avatar.type,
    } as any);
  }

  const response = await api.put<UpdateProfileResponse>("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const response = await api.put<{ message: string }>(
    "/profile/change-password",
    payload
  );

  return response.data;
}