"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/libs/api";
import StarRating from "@/components/reviews/StarRating";
import ReviewThreadList, {
  ReviewItem,
} from "@/components/reviews/ReviewThreadList";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  MessageSquareText,
  Star,
  MessageCircleMore,
  Smile,
  Meh,
  Frown,
} from "lucide-react";

type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
};

type PublicProfile = {
  id: string;
  slug?: string;
  firstName?: string;
  lastName?: string;
};

export default function PublicUserReviewsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;

  const { user, isHydrated } = useAuth();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    if (!slug) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);

        const profileRes = await api.get<PublicProfile>(
          `/profile/public/slug/${slug}`
        );

        const nextProfile = profileRes.data;
        setProfile(nextProfile);

        if (!nextProfile?.id) {
          setReviews([]);
          setSummary({
            averageRating: 0,
            totalReviews: 0,
          });
          return;
        }

        const [reviewsRes, avgRes] = await Promise.all([
          api.get(`/reviews/owner/${nextProfile.id}`),
          api.get(`/reviews/owner/${nextProfile.id}/average`),
        ]);

        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
        setSummary({
          averageRating: avgRes.data?.averageRating || 0,
          totalReviews: avgRes.data?.totalReviews || 0,
        });
      } catch (error) {
        console.error("Failed to fetch owner reviews", error);
        setProfile(null);
        setReviews([]);
        setSummary({
          averageRating: 0,
          totalReviews: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [slug]);

  const handleReviewUpdated = (updatedReview: ReviewItem) => {
    setReviews((prev) =>
      prev.map((item) => (item._id === updatedReview._id ? updatedReview : item))
    );
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-[#dfe6eb] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-4 h-5 w-32 rounded bg-gray-200" />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f7f7f7] shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <div className="h-8 w-72 rounded bg-gray-200" />
                <div className="mt-6 flex gap-10">
                  <div className="h-12 w-20 rounded bg-gray-200" />
                  <div className="h-12 w-20 rounded bg-gray-200" />
                  <div className="h-12 w-20 rounded bg-gray-200" />
                </div>
              </div>

              <div className="space-y-5 p-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-xl bg-[#dfe6eb] p-5">
                    <div className="h-5 w-40 rounded bg-gray-200" />
                    <div className="mt-4 h-4 w-full rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-4/5 rounded bg-gray-200" />
                    <div className="mt-4 h-4 w-28 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-fit rounded-xl border border-gray-200 bg-[#f7f7f7] p-8 shadow-sm">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-200" />
              <div className="mt-6 h-4 w-full rounded bg-gray-200" />
              <div className="mt-2 h-4 w-5/6 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-4/6 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dfe6eb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/profile/${slug}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-[#8A715D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f7f7f7] shadow-sm">
            <div className="border-b border-gray-200 px-6 py-7 sm:px-8">
              <h1 className="text-2xl font-bold text-black sm:text-3xl">
                Feedback about{" "}
                <span className="text-[#00b341] underline underline-offset-4">
                  Seller Reviews
                </span>
              </h1>

              <div className="mt-8 flex flex-wrap items-center gap-8 sm:gap-12">
                <div className="flex items-start gap-2">
                  <Smile className="mt-0.5 h-5 w-5 text-[#00b341]" />
                  <div>
                    <p className="text-3xl font-bold leading-none text-[#00b341]">
                      {summary.totalReviews}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#00b341]">
                      Positive
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Meh className="mt-0.5 h-5 w-5 text-[#ff9a2f]" />
                  <div>
                    <p className="text-3xl font-bold leading-none text-[#ff9a2f]">
                      0
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#ff9a2f]">
                      Neutral
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Frown className="mt-0.5 h-5 w-5 text-[#ff3b30]" />
                  <div>
                    <p className="text-3xl font-bold leading-none text-[#ff3b30]">
                      0
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#ff3b30]">
                      Negative
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl bg-white/70 px-4 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8A715D] text-white shadow-sm">
                  <Star className="h-5 w-5 fill-current" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Overall rating</p>
                  <div className="mt-1 flex items-center gap-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {summary.averageRating.toFixed(1)}
                    </p>
                    <StarRating value={summary.averageRating} size={18} />
                  </div>
                </div>
              </div>

              {!currentUserId && reviews.length > 0 && (
                <div className="mb-6 rounded-xl border border-[#eadfd6] bg-[#f8f4f1] px-4 py-3">
                  <p className="text-sm text-gray-700">
                    Log in first to mark a review as helpful or reply to a review.
                  </p>
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <MessageSquareText className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-gray-900">
                    No reviews yet
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    This user has not received any public reviews yet.
                  </p>
                </div>
              ) : (
                <div
                  className="
                    [&_.review-card]:rounded-xl
                    [&_.review-card]:border-0
                    [&_.review-card]:bg-[#dfe6eb]
                    [&_.review-card]:shadow-none
                    [&_.review-card]:p-5
                    [&_.review-card]:sm:p-6
                    [&_.review-card_*]:border-gray-200
                  "
                >
                  <ReviewThreadList
                    reviews={reviews}
                    sellerId={profile?.id || ""}
                    onReviewUpdated={handleReviewUpdated}
                  />
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-xl border border-gray-200 bg-[#f7f7f7] p-8 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm">
              <MessageCircleMore className="h-10 w-10" />
            </div>

            <p className="mx-auto mt-8 max-w-xs text-lg leading-9 text-gray-800">
              Your feedback is very important for the seller review. Please,
              leave the honest review to help other buyers and the seller in the
              customer attraction.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}