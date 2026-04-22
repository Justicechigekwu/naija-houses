import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  MessageCircleMore,
  MessageSquareText,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
  MessageCircle,
} from "lucide-react-native";

import AppScreen from "@/components/ui/AppScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Avatar from "@/components/ui/Avatar";
import AppButton from "@/components/ui/AppButton";
import StarRating from "@/components/reviews/StarRating";
import {
  addReviewComment,
  getOwnerAverageRating,
  getOwnerReviews,
  toggleHelpfulVote,
} from "@/features/reviews/api";
import { getPublicProfileBySlug, type PublicProfile } from "@/features/public-profile/api";
import type { ReviewItem } from "@/types/review";
import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}

export default function PublicProfileReviewsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();
  const { showToast } = useUI();
  const user = useAuthStore((state) => state.user);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const nextProfile = await getPublicProfileBySlug(String(slug));
        setProfile(nextProfile || null);

        if (!nextProfile?.id) {
          setReviews([]);
          setAverageRating(0);
          setTotalReviews(0);
          return;
        }

        const [reviewsRes, avgRes] = await Promise.all([
          getOwnerReviews(nextProfile.id),
          getOwnerAverageRating(nextProfile.id),
        ]);

        setReviews(Array.isArray(reviewsRes) ? reviewsRes : []);
        setAverageRating(avgRes.averageRating || 0);
        setTotalReviews(avgRes.totalReviews || 0);
      } catch {
        setProfile(null);
        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const sentiment = useMemo(() => {
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    for (const review of reviews) {
      if (review.rating >= 4) positive += 1;
      else if (review.rating === 3) neutral += 1;
      else negative += 1;
    }

    return { positive, neutral, negative };
  }, [reviews]);

  const handleToggleHelpful = async (reviewId: string) => {
    if (!user) {
      showToast("Please log in first", "error");
      return;
    }

    try {
      const res = await toggleHelpfulVote(reviewId);
      setReviews((prev) =>
        prev.map((item) => (item._id === reviewId ? res.review : item))
      );
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to update helpful vote",
        "error"
      );
    }
  };

  const handleSubmitReply = async (reviewId: string) => {
    if (!user) {
      showToast("Please log in first", "error");
      return;
    }

    const text = replyText.trim();
    if (!text) return;

    try {
      setSubmittingReply(true);
      const updated = await addReviewComment(reviewId, text);

      setReviews((prev) =>
        prev.map((item) => (item._id === reviewId ? updated : item))
      );

      setReplyingReviewId(null);
      setReplyText("");
      showToast("Reply added", "success");
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to reply",
        "error"
      );
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <AppScreen scroll padded>
      <Pressable
        onPress={() => router.push(`/profile/${slug}` as any)}
        className="mb-4 flex-row items-center self-start"
      >
        <ArrowLeft size={16} color={colors.text} />
        <Text className="ml-2 text-sm font-medium" style={{ color: colors.text }}>
          Back to profile
        </Text>
      </Pressable>

      <View className="gap-5">
        <View
          className="rounded-[28px] border"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <View className="border-b px-5 py-5" style={{ borderColor: colors.border }}>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              Feedback about{" "}
              <Text style={{ color: "#00B341", textDecorationLine: "underline" }}>
                Seller Reviews
              </Text>
            </Text>

            <View className="mt-6 flex-row flex-wrap items-center gap-8">
              <View className="flex-row items-start gap-2">
                <Smile size={18} color="#00B341" />
                <View>
                  <Text className="text-2xl font-bold" style={{ color: "#00B341" }}>
                    {sentiment.positive}
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: "#00B341" }}>
                    Positive
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-2">
                <Meh size={18} color="#F59E0B" />
                <View>
                  <Text className="text-2xl font-bold" style={{ color: "#F59E0B" }}>
                    {sentiment.neutral}
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: "#F59E0B" }}>
                    Neutral
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-2">
                <Frown size={18} color="#EF4444" />
                <View>
                  <Text className="text-2xl font-bold" style={{ color: "#EF4444" }}>
                    {sentiment.negative}
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: "#EF4444" }}>
                    Negative
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="p-5">
            <View
              className="mb-5 rounded-2xl p-4"
              style={{
                backgroundColor: resolvedTheme === "dark" ? colors.background : "#FFFFFF",
              }}
            >
              <Text className="text-sm" style={{ color: colors.muted }}>
                Overall rating
              </Text>

              <View className="mt-2 flex-row items-center gap-3">
                <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                  {averageRating.toFixed(1)}
                </Text>
                <StarRating value={averageRating} size={18} />
                <Text className="text-sm" style={{ color: colors.muted }}>
                  {totalReviews} review{totalReviews === 1 ? "" : "s"}
                </Text>
              </View>
            </View>

            {!user && reviews.length > 0 ? (
              <View
                className="mb-5 rounded-2xl border px-4 py-3"
                style={{
                  borderColor: "#EADFD6",
                  backgroundColor: resolvedTheme === "dark" ? colors.surface : "#F8F4F1",
                }}
              >
                <Text className="text-sm" style={{ color: colors.text }}>
                  Log in first to mark a review as helpful or reply to a review.
                </Text>
              </View>
            ) : null}

            {reviews.length === 0 ? (
              <View
                className="rounded-2xl border border-dashed px-6 py-12"
                style={{
                  borderColor: colors.border,
                  backgroundColor: resolvedTheme === "dark" ? colors.surface : "#FFFFFF",
                }}
              >
                <View className="items-center">
                  <View
                    className="h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.background }}
                  >
                    <MessageSquareText size={28} color={colors.muted} />
                  </View>
                  <Text className="mt-4 text-lg font-semibold" style={{ color: colors.text }}>
                    No reviews yet
                  </Text>
                  <Text className="mt-2 text-center text-sm" style={{ color: colors.muted }}>
                    This user has not received any public reviews yet.
                  </Text>
                </View>
              </View>
            ) : (
              <View className="gap-4">
                {reviews.map((review) => {
                  const reviewerName = `${review.reviewer?.firstName || ""} ${review.reviewer?.lastName || ""}`.trim();

                  return (
                    <View
                      key={review._id}
                      className="rounded-2xl border p-4"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: resolvedTheme === "dark" ? colors.surface : "#FFFFFF",
                      }}
                    >
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-row items-start gap-3 flex-1">
                          <Avatar
                            uri={review.reviewer?.avatar}
                            name={reviewerName || "U"}
                            size={40}
                          />
                          <View className="flex-1">
                            <Text
                              className="text-sm font-semibold"
                              style={{ color: colors.text }}
                            >
                              {reviewerName || "Unknown user"}
                            </Text>

                            <View className="mt-1 flex-row items-center gap-2">
                              <StarRating value={review.rating} size={14} />
                              <Text className="text-xs" style={{ color: colors.muted }}>
                                {formatDate(review.createdAt)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <Text
                        className="mt-3 text-sm leading-6"
                        style={{ color: colors.text }}
                      >
                        {review.comment}
                      </Text>

                      {review.sellerReply?.text ? (
                        <View
                          className="mt-4 rounded-2xl border p-3"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: resolvedTheme === "dark" ? colors.background : "#FAF7F4",
                          }}
                        >
                          <Text className="text-xs font-semibold" style={{ color: colors.muted }}>
                            Seller reply
                          </Text>
                          <Text className="mt-2 text-sm leading-6" style={{ color: colors.text }}>
                            {review.sellerReply.text}
                          </Text>
                        </View>
                      ) : null}

                      {review.comments?.length ? (
                        <View className="mt-4 gap-3">
                          {review.comments.map((comment) => {
                            const commentName = `${comment.user?.firstName || ""} ${comment.user?.lastName || ""}`.trim();

                            return (
                              <View
                                key={comment._id}
                                className="rounded-2xl border p-3"
                                style={{
                                  borderColor: colors.border,
                                  backgroundColor:
                                    resolvedTheme === "dark" ? colors.background : "#FAFAFA",
                                }}
                              >
                                <Text className="text-xs font-semibold" style={{ color: colors.muted }}>
                                  {commentName || "User"}
                                </Text>
                                <Text className="mt-1 text-sm leading-6" style={{ color: colors.text }}>
                                  {comment.text}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      ) : null}

                      <View className="mt-4 flex-row items-center gap-5">
                        <Pressable
                          onPress={() => handleToggleHelpful(review._id)}
                          className="flex-row items-center"
                        >
                          <ThumbsUp
                            size={16}
                            color={review.isHelpfulByCurrentUser ? colors.brand : colors.muted}
                          />
                          <Text
                            className="ml-2 text-sm"
                            style={{
                              color: review.isHelpfulByCurrentUser ? colors.brand : colors.muted,
                            }}
                          >
                            Like {review.helpfulCount ? `(${review.helpfulCount})` : ""}
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() =>
                            setReplyingReviewId((prev) =>
                              prev === review._id ? null : review._id
                            )
                          }
                          className="flex-row items-center"
                        >
                          <MessageCircle size={16} color={colors.muted} />
                          <Text className="ml-2 text-sm" style={{ color: colors.muted }}>
                            Reply
                          </Text>
                        </Pressable>
                      </View>

                      {replyingReviewId === review._id ? (
                        <View className="mt-4">
                          <TextInput
                            value={replyText}
                            onChangeText={setReplyText}
                            placeholder="Write your reply..."
                            placeholderTextColor={colors.muted}
                            multiline
                            className="rounded-2xl border px-4 py-3"
                            style={{
                              borderColor: colors.border,
                              color: colors.text,
                              backgroundColor:
                                resolvedTheme === "dark" ? colors.background : "#FFFFFF",
                              minHeight: 90,
                              textAlignVertical: "top",
                            }}
                          />

                          <View className="mt-3 flex-row justify-end gap-3">
                            <Pressable
                              onPress={() => {
                                setReplyingReviewId(null);
                                setReplyText("");
                              }}
                              className="rounded-xl border px-4 py-3"
                              style={{ borderColor: colors.border }}
                            >
                              <Text style={{ color: colors.text }}>Cancel</Text>
                            </Pressable>

                            <AppButton
                              label={submittingReply ? "Sending..." : "Post reply"}
                              onPress={() => handleSubmitReply(review._id)}
                              loading={submittingReply}
                              className="rounded-xl px-4 py-3"
                            />
                          </View>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <View
          className="rounded-[28px] border p-6"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <View className="items-center">
            <View
              className="h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: resolvedTheme === "dark" ? colors.background : "#FFFFFF",
              }}
            >
              <MessageCircleMore size={34} color={colors.text} />
            </View>

            <Text
              className="mt-6 text-center text-base leading-8"
              style={{ color: colors.text }}
            >
              Your feedback is very important for the seller review. Please,
              leave honest reviews to help other buyers and sellers.
            </Text>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}