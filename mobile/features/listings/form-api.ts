import { api } from "@/libs/api";
import type { Listing } from "@/types/listing";

export async function createListing(formData: FormData) {
  const response = await api.post("/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updateListing(listingId: string, formData: FormData) {
  const response = await api.put<Listing>(`/listings/${listingId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}