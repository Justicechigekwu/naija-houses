
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/libs/api";
import StarRating from "./StarRating";

export default function ReviewsList({
  ownerId,
  previewCount = 3,
}: {
  ownerId: string;
  previewCount?: number;
}) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ownerId) return;

    const fetch = async () => {
      try {
        const [reviewsRes, avgRes] = await Promise.all([
          api.get(`/reviews/owner/${ownerId}`),
          api.get(`/reviews/owner/${ownerId}/average`),
        ]);

        setReviews(reviewsRes.data);
        setAvgRating(avgRes.data.averageRating || 0);
        setTotalReviews(avgRes.data.totalReviews || reviewsRes.data.length || 0);
      } catch (err) {
        console.error("Failed to fetch owner reviews", err);
      }
    };

    fetch();
  }, [ownerId]);

  const preview = useMemo(
    () => reviews.slice(0, previewCount),
    [reviews, previewCount]
  );

  const remainingCount = Math.max(0, reviews.length - previewCount);

  return (
    <div className="space-y-4">

      <div className="flex items-center gap-2">
        <StarRating value={avgRating} />
        <span className="text-gray-600 text-sm">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </span>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      ) : (
        <>
          {preview.map((r) => (
            <div key={r._id} className="border-b pb-3">
              <StarRating value={r.rating} size={20} />
              <p className="text-gray-700">{r.comment}</p>
              
              <div className="flex items-center gap-2 mt-1">
                <img src={
                  r.reviewer?.avatar
                  ? r.reviewer.avatar.startsWith('http')
                  ? r.reviewer.avatar
                  : `http://localhost:5000${r.reviewer.avatar}`
                  : '/default-avatar.png'
                }
                 alt={`${r.reviewer?.firstName} ${r.reviewer?.lastName}`} 
                 className="h-6 w-6 rounded-full"
                />
                <span className="text-xs text-gray-800 object-cover">
                  {r.reviewer?.firstName} {r.reviewer?.lastName}
                </span>
              </div>
            </div>
          ))}

          {remainingCount > 0 && (
            <button
              onClick={() => setOpen(true)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View {remainingCount} more review{remainingCount > 1 ? "s" : ""}
            </button>
          )}
        </>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-lg shadow-lg p-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">All Reviews</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <StarRating value={avgRating} />
              <span className="text-gray-600 text-sm">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>

            {reviews.map((r) => (
              <div key={r._id} className="border-b pb-3 mb-3">
                <StarRating value={r.rating} size={20} />
                <p className="text-gray-700">{r.comment}</p>
                <span className="text-xs text-gray-500">
                  by {r.reviewer?.firstName} {r.reviewer?.lastName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}