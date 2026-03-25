"use client";
import { useState } from "react";
import api from "@/libs/api";
import StarRating from "./StarRating";
import { AxiosError } from "axios";

export default function ReviewForm({
  listingId,
  existingReview,
}: {
  listingId: string;
  existingReview?: { rating: number; comment: string; _id: string };
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!rating) return setStatus("Please select rating");

    try {
      setLoading(true);

      if (existingReview) {
        await api.put(`/reviews/${existingReview._id}`, {
          rating,
          comment,
        });
        setStatus("Review updated");
      } else {
        await api.post(`/reviews`, {
          listingId,
          rating,
          comment,
        });
        setStatus("Review added");
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

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">
        {existingReview ? "Edit Your Review" : "Rate this Seller"}
      </h3>

      <StarRating value={rating} onChange={setRating} />

      <textarea
        className="w-full border rounded p-2 mt-3"
        rows={3}
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : existingReview ? "Update Review" : "Submit Review"}
      </button>

      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}