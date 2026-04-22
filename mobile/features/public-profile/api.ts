import { api } from "@/libs/api";
import type { Listing } from "@/types/listing";

export type PublicProfile = {
  id: string;
  slug?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  totalReviews?: number;
  averageRating?: number;
};

export async function getPublicProfileBySlug(slug: string) {
  const response = await api.get<PublicProfile>(`/profile/public/slug/${slug}`);
  return response.data;
}

export async function getPublicUserListings(userId: string) {
  const response = await api.get<Listing[]>(`/profile/public/${userId}/listings`);
  return response.data;
}