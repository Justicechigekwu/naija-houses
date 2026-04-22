import { api } from "@/libs/api";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

type LocationParams = {
  page?: number;
  limit?: number;
  lat?: number | null;
  lng?: number | null;
  city?: string;
  state?: string;
  manualLocationFilter?: "true";
  q?: string;
  category?: string;
  subcategory?: string;
  listingType?: "Sale" | "Rent" | "Shortlet";
};

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );
}

export async function getHomeLocationFeed(params: LocationParams) {
  const response = await api.get<PaginatedListingsResponse>(
    "/listings/feed/location",
    {
      params: cleanParams(params),
    }
  );

  return response.data;
}

export async function getInfiniteLocationFeed(params: LocationParams) {
  const response = await api.get<PaginatedListingsResponse>(
    "/listings/feed/location",
    {
      params: cleanParams(params),
    }
  );

  return response.data;
}

export async function searchListingsByLocation(params: LocationParams) {
  const response = await api.get<PaginatedListingsResponse>(
    "/listings/search/location",
    {
      params: cleanParams(params),
    }
  );

  return response.data;
}

export async function getUserListings(userId: string) {
  const response = await api.get<Listing[]>(`/profile/${userId}`);
  return response.data;
}

export async function getListingBySlug(slug: string) {
  const response = await api.get<{ listing: Listing }>(`/listings/slug/${slug}`);
  return response.data;
}

export async function deleteListingById(listingId: string) {
  const response = await api.delete<{ message: string }>(`/listings/${listingId}`);
  return response.data;
}

export async function getRelatedListings(
  listingId: string,
  params: LocationParams
) {
  const response = await api.get<PaginatedListingsResponse>(
    `/listings/${listingId}/related`,
    {
      params: cleanParams(params),
    }
  );

  return response.data;
}