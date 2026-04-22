"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/libs/api";
import StarRating from "./StarRating";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/hooks/useUi";
import { MessageCircle, ThumbsUp, Send } from "lucide-react";
import { AxiosError } from "axios";

type UserPreview = {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
};

type SellerReply = {
  user?: UserPreview;
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

type ReviewComment = {
  _id: string;
  user?: UserPreview;
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewItem = {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  reviewer?: UserPreview;
  seller?: UserPreview;
  listing?: {
    _id?: string;
    title?: string;
  };
  helpfulCount?: number;
  isHelpfulByCurrentUser?: boolean;
  sellerReply?: SellerReply | null;
  comments?: ReviewComment[];
};

export default function ReviewThreadList({
  reviews,
  sellerId,
  onReviewUpdated,
}: {
  reviews: ReviewItem[];
  sellerId: string;
  onReviewUpdated?: (updatedReview: ReviewItem) => void;
}) {
  const { user } = useAuth();
  const { showToast } = useUI();

  const currentUserId = user?.id || user?._id;

  const handleReplaceReview = (updatedReview: ReviewItem) => {
    onReviewUpdated?.(updatedReview);
  };

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          sellerId={sellerId}
          currentUserId={currentUserId}
          onUpdated={handleReplaceReview}
          showToast={showToast}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  sellerId,
  currentUserId,
  onUpdated,
  showToast,
}: {
  review: ReviewItem;
  sellerId: string;
  currentUserId?: string;
  onUpdated: (updatedReview: ReviewItem) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}) {
  const isSeller =
    !!currentUserId && String(currentUserId) === String(sellerId);

  const [replyText, setReplyText] = useState(
    isSeller ? review.sellerReply?.text || "" : ""
  );
  const [replyLoading, setReplyLoading] = useState(false);
  const [helpfulLoading, setHelpfulLoading] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    if (isSeller) {
      setReplyText(review.sellerReply?.text || "");
    }
  }, [isSeller, review.sellerReply?.text]);

  const reviewerName = `${review.reviewer?.firstName || ""} ${
    review.reviewer?.lastName || ""
  }`.trim();

  const sellerReplyName = `${review.sellerReply?.user?.firstName || ""} ${
    review.sellerReply?.user?.lastName || ""
  }`.trim();

  const commentsCount = review.comments?.length || 0;
  const helpfulCount = review.helpfulCount || 0;
  const isHelpful = !!review.isHelpfulByCurrentUser;

  const handleHelpful = async () => {
    if (!currentUserId) {
      showToast("Please log in to mark this review helpful", "error");
      return;
    }

    try {
      setHelpfulLoading(true);
      const res = await api.post(`/reviews/${review._id}/helpful`);
      onUpdated(res.data.review);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        showToast(
          (err.response?.data as { message?: string })?.message ||
            "Failed to update helpful vote",
          "error"
        );
      } else {
        showToast("Failed to update helpful vote", "error");
      }
    } finally {
      setHelpfulLoading(false);
    }
  };

  const handleReply = async () => {
    if (!currentUserId) {
      showToast("Please log in to reply", "error");
      return;
    }

    if (!replyText.trim()) {
      showToast("Please enter a reply", "error");
      return;
    }

    try {
      setReplyLoading(true);

      const res = isSeller
        ? await api.post(`/reviews/${review._id}/reply`, {
            text: replyText.trim(),
          })
        : await api.post(`/reviews/${review._id}/comments`, {
            text: replyText.trim(),
          });

      const updatedReview = res.data.review || res.data;

      onUpdated(updatedReview);
      setReplyText(isSeller ? updatedReview?.sellerReply?.text || "" : "");
      setShowReplyBox(false);
      setShowComments(true);
      showToast(isSeller ? "Reply saved" : "Reply added", "success");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        showToast(
          (err.response?.data as { message?: string })?.message ||
            "Failed to reply",
          "error"
        );
      } else {
        showToast("Failed to reply", "error");
      }
    } finally {
      setReplyLoading(false);
    }
  };

  const reviewDate = useMemo(() => {
    if (!review.createdAt) return "";
    return new Date(review.createdAt).toLocaleDateString();
  }, [review.createdAt]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <img
            src={review.reviewer?.avatar || "/default-avatar.png"}
            alt={reviewerName || "Reviewer"}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">
                {reviewerName || "Anonymous user"}
              </p>
              {reviewDate && (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                  {reviewDate}
                </span>
              )}
            </div>

            <div className="mt-2">
              <StarRating value={review.rating} size={18} />
            </div>

            {!!review.comment && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {review.comment}
              </p>
            )}

            {review.sellerReply && (
              <div className="mt-4 rounded-2xl border border-[#e8dfd7] bg-[#f7f4f1] p-4">
                <div className="flex items-center gap-2">
                  <img
                    src={review.sellerReply.user?.avatar || "/default-avatar.png"}
                    alt={sellerReplyName || "Seller"}
                    className="h-8 w-8 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {sellerReplyName || "Seller"}
                    </p>
                    <p className="text-xs text-gray-500">Seller reply</p>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {review.sellerReply.text}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleHelpful}
                disabled={helpfulLoading}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isHelpful
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{helpfulLoading ? "..." : helpfulCount}</span>
              </button>

              <button
                onClick={() => setShowReplyBox((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                <MessageCircle className="h-4 w-4" />
                {isSeller
                  ? review.sellerReply
                    ? "Edit reply"
                    : "Reply"
                  : "Reply"}
              </button>

              <button
                onClick={() => setShowComments((prev) => !prev)}
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                {showComments ? "Hide" : "Show"} replies ({commentsCount})
              </button>
            </div>

            {showReplyBox && (
              <div className="mt-4 rounded-2xl bg-[#fafafa] p-4">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full rounded-2xl border border-gray-300 p-3 text-sm outline-none transition focus:border-[#8A715D] focus:ring-2 focus:ring-[#8A715D]/10"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleReply}
                    disabled={replyLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#8A715D] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#755e4d] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Send className="h-4 w-4" />
                    {replyLoading ? "Saving..." : "Post reply"}
                  </button>
                </div>
              </div>
            )}

            {showComments && commentsCount > 0 && (
              <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
                {review.comments?.map((item) => {
                  const commenterName = `${item.user?.firstName || ""} ${
                    item.user?.lastName || ""
                  }`.trim();

                  return (
                    <div key={item._id} className="flex items-start gap-3">
                      <img
                        src={item.user?.avatar || "/default-avatar.png"}
                        alt={commenterName || "Reply user"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="flex-1 rounded-2xl bg-gray-50 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {commenterName || "User"}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}