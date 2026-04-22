import { api } from "@/libs/api";
import type { Listing } from "@/types/listing";

export async function getMyFavorites() {
  const response = await api.get<Listing[]>("/favorites");
  return response.data;
}

export async function checkFavoriteStatus(listingId: string) {
  const response = await api.get<{ isFavorited: boolean }>(
    `/favorites/${listingId}/status`
  );
  return response.data;
}

export async function toggleFavorite(listingId: string) {
  const response = await api.post<{
    message: string;
    isFavorited: boolean;
  }>(`/favorites/${listingId}/toggle`);

  return response.data;
}