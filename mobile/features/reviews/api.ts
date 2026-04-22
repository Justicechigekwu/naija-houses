// import { api } from "@/libs/api";

// export async function getOwnerAverageRating(ownerId: string) {
//   const response = await api.get<{
//     averageRating?: number;
//     totalReviews?: number;
//   }>(`/reviews/owner/${ownerId}/average`);

//   return response.data;
// }



import { api } from "@/libs/api";
import type {
  ReviewEligibilityResponse,
  ReviewItem,
  ReviewsAverageResponse,
} from "@/types/review";

export async function getReviewEligibility(listingId: string) {
  const response = await api.get<ReviewEligibilityResponse>(
    `/reviews/eligibility/${listingId}`
  );
  return response.data;
}

export async function createReview(payload: {
  listingId: string;
  rating: number;
  comment: string;
}) {
  const response = await api.post<ReviewItem>("/reviews", payload);
  return response.data;
}

export async function updateReview(reviewId: string, payload: {
  rating: number;
  comment: string;
}) {
  const response = await api.put<ReviewItem>(`/reviews/${reviewId}`, payload);
  return response.data;
}

export async function getOwnerReviews(ownerId: string) {
  const response = await api.get<ReviewItem[]>(`/reviews/owner/${ownerId}`);
  return response.data;
}

export async function getOwnerAverageRating(ownerId: string) {
  const response = await api.get<ReviewsAverageResponse>(
    `/reviews/owner/${ownerId}/average`
  );
  return response.data;
}

export async function toggleHelpfulVote(reviewId: string) {
  const response = await api.post<{ message: string; review: ReviewItem }>(
    `/reviews/${reviewId}/helpful`
  );
  return response.data;
}

export async function replyToReview(reviewId: string, text: string) {
  const response = await api.post<ReviewItem>(`/reviews/${reviewId}/reply`, {
    text,
  });
  return response.data;
}

export async function addReviewComment(reviewId: string, text: string) {
  const response = await api.post<ReviewItem>(`/reviews/${reviewId}/comments`, {
    text,
  });
  return response.data;
}