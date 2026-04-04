"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/libs/api";
import StarRating from "./StarRating";

type ReviewsAverageResponse = {
  averageRating?: number;
  totalReviews?: number;
};

export default function ReviewsList({
  ownerId,
  refreshKey = 0,
  reviewsPageHref,
}: {
  ownerId: string;
  previewCount?: number;
  refreshKey?: number;
  reviewsPageHref?: string;
}) {
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (!ownerId) return;

    let active = true;

    const fetchAverage = async () => {
      try {
        const res = await api.get<ReviewsAverageResponse>(
          `/reviews/owner/${ownerId}/average`
        );

        if (!active) return;

        setAvgRating(res.data?.averageRating || 0);
        setTotalReviews(res.data?.totalReviews || 0);
      } catch (err) {
        if (!active) return;
        console.error("Failed to fetch owner review average", err);
        setAvgRating(0);
        setTotalReviews(0);
      }
    };

    fetchAverage();

    return () => {
      active = false;
    };
  }, [ownerId, refreshKey]);

  const content = (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <StarRating value={avgRating} size={18} />
      <span className="text-sm font-medium text-gray-700">
        {avgRating.toFixed(1)} · {totalReviews}{" "}
        {totalReviews === 1 ? "review" : "reviews"}
      </span>
    </div>
  );

  if (reviewsPageHref) {
    return (
      <Link
        href={reviewsPageHref}
        className="inline-flex rounded-2xl transition hover:-translate-y-0.5"
      >
        {content}
      </Link>
    );
  }

  return content;
}