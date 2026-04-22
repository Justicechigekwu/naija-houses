import { api } from "@/libs/api";
import type { Listing } from "@/types/listing";

export async function getUserListings(userId: string) {
  const response = await api.get<Listing[]>(`/profile/${userId}`);
  return response.data;
}