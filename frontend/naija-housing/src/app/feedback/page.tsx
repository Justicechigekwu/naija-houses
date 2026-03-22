"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";
import StarRating from "@/components/reviews/StarRating";
import Link from "next/link";

export default function FeedbackPage() {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<any[]>([]);
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
          api.get(`/reviews/owner/${user.id}`),
          api.get(`/reviews/owner/${user.id}/average`),
        ]);

        setReviews(reviewsRes.data || []);
        setAverageRating(avgRes.data?.averageRating || 0);
        setTotalReviews(avgRes.data?.totalReviews || 0);
      } catch (error) {
        console.error("Failed to fetch feedbacks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user?.id]);

  if (loading) {
    return <div className="min-h-screen p-6">Loading feedbacks...</div>;
  }

  return (
    <div className="min-h-screen bg-[#EDEDED] p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="mb-6">
          <Link href="/profile" className="text-blue-600 hover:underline text-sm">
            ← Back to profile
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Feedbacks</h1>

          <div className="flex items-center gap-3 mt-3">
            <StarRating value={averageRating} size={24} />
            <span className="text-gray-700">
              {averageRating.toFixed(1)} · {totalReviews} review
              {totalReviews === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500">You do not have any feedback yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <StarRating value={review.rating} size={20} />

                {review.comment && (
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <img
                    src={review.reviewer?.avatar || "/default-avatar.png"}
                    alt={`${review.reviewer?.firstName || ""} ${review.reviewer?.lastName || ""}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600">
                    {review.reviewer?.firstName} {review.reviewer?.lastName}
                  </span>
                </div>

                {review.listing && (
                  <div className="mt-2">
                    <Link
                      href={`/listings/${review.listing._id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View listing
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}