"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";
import StarRating from "@/components/reviews/StarRating";
import ReviewThreadList, {
  ReviewItem,
} from "@/components/reviews/ReviewThreadList";
import Link from "next/link";
import PageReadyLoader from "@/components/pages/PageReadyLoader";
import { ArrowLeft, MessageSquareText, Star } from "lucide-react";

type SummaryResponse = {
  averageRating?: number;
  totalReviews?: number;
};

export default function FeedbackPage() {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const [reviewsRes, avgRes] = await Promise.all([
          api.get<ReviewItem[]>(`/reviews/owner/${user.id}`),
          api.get<SummaryResponse>(`/reviews/owner/${user.id}/average`),
        ]);

        setReviews(reviewsRes.data || []);
        setAverageRating(avgRes.data?.averageRating || 0);
        setTotalReviews(avgRes.data?.totalReviews || 0);
      } catch (error) {
        console.error("Failed to fetch feedbacks", error);
        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user?.id]);

  const handleReviewUpdated = (updatedReview: ReviewItem) => {
    setReviews((prev) =>
      prev.map((item) => (item._id === updatedReview._id ? updatedReview : item))
    );
  };

  return (
    <PageReadyLoader ready={!loading}>
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#8A715D] hover:text-[#8A715D]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gradient-to-r from-[#111827] to-[#1f2937] px-6 py-8 text-white sm:px-8">
              <p className="text-sm text-white/70">Your public reputation</p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                My Feedbacks
              </h1>
              <p className="mt-2 text-sm text-white/75 sm:text-base">
                See how buyers and sellers rate your conversations and transactions.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-8 rounded-3xl border border-gray-200 bg-[#fafafa] p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Overall rating
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8A715D] text-white shadow-sm">
                        <Star className="h-6 w-6 fill-current" />
                      </div>

                      <div>
                        <p className="text-3xl font-bold text-gray-900">
                          {averageRating.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {totalReviews} review{totalReviews === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-gray-100">
                    <StarRating value={averageRating} size={22} />
                  </div>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-[#fafafa] px-6 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <MessageSquareText className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-gray-900">
                    No feedback yet
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    You do not have any feedback yet.
                  </p>
                </div>
              ) : (
                <ReviewThreadList
                  reviews={reviews}
                  sellerId={user?.id || ""}
                  onReviewUpdated={handleReviewUpdated}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageReadyLoader>
  );
}