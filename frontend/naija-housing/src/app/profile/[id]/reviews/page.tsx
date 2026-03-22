"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/libs/api";
import StarRating from "@/components/reviews/StarRating";
import Link from "next/link";

export default function PublicUserReviewsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [reviews, setReviews] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        const [reviewsRes, avgRes] = await Promise.all([
          api.get(`/reviews/owner/${id}`),
          api.get(`/reviews/owner/${id}/average`),
        ]);

        setReviews(reviewsRes.data || []);
        setSummary({
          averageRating: avgRes.data.averageRating || 0,
          totalReviews: avgRes.data.totalReviews || 0,
        });
      } catch (error) {
        console.error("Failed to fetch owner reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen p-6">Loading reviews...</div>;
  }

  return (
    <div className="min-h-screen bg-[#EDEDED] p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <Link
          href={`/profile/${id}`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to profile
        </Link>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold">Ratings & Reviews</h1>

          <div className="flex items-center gap-3 mt-3">
            <StarRating value={summary.averageRating} size={24} />
            <span className="text-gray-700">
              {summary.averageRating.toFixed(1)} · {summary.totalReviews} review
              {summary.totalReviews === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <StarRating value={review.rating} size={20} />
                <p className="mt-2 text-gray-700">{review.comment}</p>

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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}