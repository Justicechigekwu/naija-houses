import { api } from "@/libs/api";
import type { AppealListing } from "@/types/marketplace";

export async function getAppealListing(listingId: string) {
  const response = await api.get<AppealListing>(`/listings/${listingId}/appeal`);
  return response.data;
}

export async function submitAppeal(listingId: string, appealMessage: string) {
  const response = await api.post(`/listings/${listingId}/appeal`, {
    appealMessage,
  });
  return response.data;
}