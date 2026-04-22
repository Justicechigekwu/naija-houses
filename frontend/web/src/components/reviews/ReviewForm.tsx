"use client";
import { useEffect, useState } from "react";
import api from "@/libs/api";
import StarRating from "./StarRating";
import { AxiosError } from "axios";

type ExistingReview = {
  _id: string;
  rating: number;
  comment: string;
};

type EligibilityResponse = {
  canReview: boolean;
  alreadyReviewed: boolean;
  existingReview?: ExistingReview | null;
};

export default function ReviewForm({
  listingId,
  onSubmitted,
}: {
  listingId: string;
  onSubmitted?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(null);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    const loadEligibility = async () => {
      try {
        setPageLoading(true);
        const res = await api.get<EligibilityResponse>(
          `/reviews/eligibility/${listingId}`
        );

        setCanReview(res.data.canReview || res.data.alreadyReviewed);

        if (res.data.existingReview) {
          setExistingReview(res.data.existingReview);
          setRating(res.data.existingReview.rating);
          setComment(res.data.existingReview.comment);
        }
      } catch (err) {
        console.error("Failed to load review eligibility", err);
        setCanReview(false);
      } finally {
        setPageLoading(false);
      }
    };

    if (listingId) loadEligibility();
  }, [listingId]);

  const handleSubmit = async () => {
    if (!rating) {
      setStatus("Please select rating");
      return;
    }

    try {
      setLoading(true);

      if (existingReview) {
        const res = await api.put(`/reviews/${existingReview._id}`, {
          rating,
          comment,
        });
        setExistingReview(res.data);
        setStatus("Review updated");
        onSubmitted?.();
      } else {
        const res = await api.post(`/reviews`, {
          listingId,
          rating,
          comment,
        });
        setExistingReview(res.data);
        setStatus("Review added");
        setCanReview(true);
        onSubmitted?.();
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setStatus(
          (err.response?.data as { message?: string })?.message ||
            "Failed to submit review"
        );
      } else if (err instanceof Error) {
        setStatus(err.message || "Failed to submit review");
      } else {
        setStatus("Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        Loading review...
      </div>
    );
  }

  if (!canReview && !existingReview) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-gray-900">
          {existingReview ? "Edit Your Review" : "Rate this Seller"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Share an honest experience about your conversation or transaction.
        </p>
      </div>

      <div className="rounded-2xl bg-[#fafafa] p-4">
        <StarRating value={rating} onChange={setRating} />
      </div>

      <textarea
        className="mt-4 w-full rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-[#8A715D] focus:ring-2 focus:ring-[#8A715D]/10"
        rows={4}
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-2xl bg-[#8A715D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#755e4d] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saving..." : existingReview ? "Update Review" : "Submit Review"}
        </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}