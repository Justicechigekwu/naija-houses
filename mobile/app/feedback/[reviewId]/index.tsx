import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, FileText, ThumbsUp, MessageCircle, Send } from "lucide-react-native";

import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/hooks/useTheme";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/reviews/StarRating";
import {
  addReviewComment,
  getOwnerAverageRating,
  getOwnerReviews,
  replyToReview,
  toggleHelpfulVote,
} from "@/features/reviews/api";
import type { ReviewItem } from "@/types/review";

export default function FeedbackReviewDetailsScreen() {
  const router = useRouter();
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);

  const [review, setReview] = useState<ReviewItem | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [helpfulLoading, setHelpfulLoading] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showComments, setShowComments] = useState(true);

  const currentUserId = user?.id;
  const sellerId = user?.id || "";
  const isSeller = !!currentUserId && !!review?.seller?._id && String(currentUserId) === String(review.seller._id);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        if (!user?.id || !reviewId) {
          if (active) setLoading(false);
          return;
        }

        const [reviewsRes, avgRes] = await Promise.all([
          getOwnerReviews(user.id),
          getOwnerAverageRating(user.id),
        ]);

        if (!active) return;

        const matchedReview =
          (reviewsRes || []).find((item) => item._id === reviewId) || null;

        setReview(matchedReview);
        setNotFound(!matchedReview);
        setAverageRating(avgRes.averageRating || 0);
        setTotalReviews(avgRes.totalReviews || 0);

        if (matchedReview && String(matchedReview.seller?._id) === String(user.id)) {
          setReplyText(matchedReview.sellerReply?.text || "");
        }
      } catch {
        if (!active) return;
        setReview(null);
        setNotFound(true);
        setAverageRating(0);
        setTotalReviews(0);
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [reviewId, user?.id]);

  const reviewDate = useMemo(() => {
    if (!review?.createdAt) return "";
    return new Date(review.createdAt).toLocaleDateString();
  }, [review?.createdAt]);

  const handleHelpful = async () => {
    if (!review?._id) return;

    try {
      setHelpfulLoading(true);
      const res = await toggleHelpfulVote(review._id);
      setReview(res.review);
    } finally {
      setHelpfulLoading(false);
    }
  };

  const handleReply = async () => {
    if (!review?._id || !replyText.trim()) return;

    try {
      setReplyLoading(true);

      const updated = isSeller
        ? await replyToReview(review._id, replyText.trim())
        : await addReviewComment(review._id, replyText.trim());

      setReview(updated);
      setReplyText(isSeller ? updated?.sellerReply?.text || "" : "");
      setShowReplyBox(false);
      setShowComments(true);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          className="mb-4 self-start rounded-xl border px-4 py-3"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <ArrowLeft size={18} color={colors.text} />
        </Pressable>

        <View
          className="overflow-hidden rounded-3xl border"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <View
            className="px-6 py-8"
            style={{ backgroundColor: colors.text }}
          >
            <Text className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              Feedback details
            </Text>
            <Text className="mt-2 text-2xl font-bold text-white">
              Review Details
            </Text>
          </View>

          <View className="p-6">
            <View
              className="mb-8 rounded-3xl border p-5"
              style={{ borderColor: colors.border, backgroundColor: colors.background }}
            >
              <Text className="text-sm" style={{ color: colors.muted }}>
                Overall rating
              </Text>

              <View className="mt-3 flex-row items-center justify-between">
                <View>
                  <Text className="text-3xl font-bold" style={{ color: colors.text }}>
                    {averageRating.toFixed(1)}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    {totalReviews} review{totalReviews === 1 ? "" : "s"}
                  </Text>
                </View>

                <StarRating value={averageRating} size={20} />
              </View>
            </View>

            {loading ? (
              <Text style={{ color: colors.muted }}>Loading review...</Text>
            ) : notFound || !review ? (
              <View
                className="rounded-3xl border px-6 py-12"
                style={{ borderColor: colors.border, backgroundColor: colors.background }}
              >
                <View
                  className="mx-auto items-center justify-center rounded-full"
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: colors.surface,
                  }}
                >
                  <FileText size={28} color={colors.muted} />
                </View>

                <Text
                  className="mt-4 text-center text-base"
                  style={{ color: colors.text }}
                >
                  Review not found.
                </Text>
              </View>
            ) : (
              <View
                className="rounded-3xl border p-5"
                style={{ borderColor: colors.border, backgroundColor: colors.surface }}
              >
                <View className="flex-row gap-4">
                  <Avatar
                    uri={review.reviewer?.avatar || null}
                    name={`${review.reviewer?.firstName || ""} ${review.reviewer?.lastName || ""}`.trim() || "U"}
                    size={44}
                  />

                  <View className="min-w-0 flex-1">
                    <View className="flex-row flex-wrap items-center gap-2">
                      <Text className="font-semibold" style={{ color: colors.text }}>
                        {`${review.reviewer?.firstName || ""} ${review.reviewer?.lastName || ""}`.trim() || "Anonymous user"}
                      </Text>

                      {reviewDate ? (
                        <View
                          className="rounded-full px-2.5 py-1"
                          style={{ backgroundColor: colors.background }}
                        >
                          <Text className="text-xs" style={{ color: colors.muted }}>
                            {reviewDate}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View className="mt-2">
                      <StarRating value={review.rating} size={16} />
                    </View>

                    {!!review.comment ? (
                      <Text
                        className="mt-3 text-sm leading-7"
                        style={{ color: colors.muted }}
                      >
                        {review.comment}
                      </Text>
                    ) : null}

                    {review.sellerReply ? (
                      <View
                        className="mt-4 rounded-2xl border p-4"
                        style={{
                          borderColor: "rgba(138,113,93,0.2)",
                          backgroundColor: colors.background,
                        }}
                      >
                        <View className="flex-row items-center gap-2">
                          <Avatar
                            uri={review.sellerReply.user?.avatar || null}
                            name={`${review.sellerReply.user?.firstName || ""} ${review.sellerReply.user?.lastName || ""}`.trim() || "S"}
                            size={32}
                          />

                          <View>
                            <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                              {`${review.sellerReply.user?.firstName || ""} ${review.sellerReply.user?.lastName || ""}`.trim() || "Seller"}
                            </Text>
                            <Text className="text-xs" style={{ color: colors.muted }}>
                              Seller reply
                            </Text>
                          </View>
                        </View>

                        <Text
                          className="mt-3 text-sm leading-7"
                          style={{ color: colors.muted }}
                        >
                          {review.sellerReply.text}
                        </Text>
                      </View>
                    ) : null}

                    <View className="mt-4 flex-row flex-wrap items-center gap-3">
                      <Pressable
                        onPress={handleHelpful}
                        disabled={helpfulLoading}
                        className="flex-row items-center rounded-full px-4 py-2"
                        style={{
                          backgroundColor: review.isHelpfulByCurrentUser
                            ? "rgba(59,130,246,0.12)"
                            : colors.background,
                        }}
                      >
                        <ThumbsUp
                          size={16}
                          color={review.isHelpfulByCurrentUser ? "#1D4ED8" : colors.text}
                        />
                        <Text
                          className="ml-2 text-sm font-medium"
                          style={{
                            color: review.isHelpfulByCurrentUser ? "#1D4ED8" : colors.text,
                          }}
                        >
                          {helpfulLoading ? "..." : review.helpfulCount || 0}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => setShowReplyBox((prev) => !prev)}
                        className="flex-row items-center rounded-full px-4 py-2"
                        style={{ backgroundColor: colors.background }}
                      >
                        <MessageCircle size={16} color={colors.text} />
                        <Text className="ml-2 text-sm font-medium" style={{ color: colors.text }}>
                          {isSeller
                            ? review.sellerReply
                              ? "Edit reply"
                              : "Reply"
                            : "Reply"}
                        </Text>
                      </Pressable>

                      <Pressable onPress={() => setShowComments((prev) => !prev)}>
                        <Text className="text-sm font-medium" style={{ color: colors.muted }}>
                          {showComments ? "Hide" : "Show"} replies ({review.comments?.length || 0})
                        </Text>
                      </Pressable>
                    </View>

                    {showReplyBox ? (
                      <View
                        className="mt-4 rounded-2xl p-4"
                        style={{ backgroundColor: colors.background }}
                      >
                        <TextInput
                          value={replyText}
                          onChangeText={setReplyText}
                          placeholder="Write a reply..."
                          placeholderTextColor={colors.muted}
                          multiline
                          textAlignVertical="top"
                          className="min-h-[100px] rounded-2xl border px-4 py-3"
                          style={{
                            borderColor: colors.border,
                            color: colors.text,
                            backgroundColor: colors.surface,
                          }}
                        />

                        <Pressable
                          onPress={handleReply}
                          disabled={replyLoading}
                          className="mt-3 flex-row items-center justify-center rounded-xl px-4 py-3"
                          style={{ backgroundColor: colors.brand }}
                        >
                          <Send size={16} color="#FFFFFF" />
                          <Text className="ml-2 text-sm font-medium text-white">
                            {replyLoading ? "Saving..." : "Post reply"}
                          </Text>
                        </Pressable>
                      </View>
                    ) : null}

                    {showComments && (review.comments?.length || 0) > 0 ? (
                      <View
                        className="mt-5 border-t pt-5"
                        style={{ borderColor: colors.border }}
                      >
                        {review.comments?.map((item) => {
                          const commenterName = `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim();

                          return (
                            <View key={item._id} className="mb-3 flex-row items-start gap-3">
                              <Avatar
                                uri={item.user?.avatar || null}
                                name={commenterName || "U"}
                                size={32}
                              />

                              <View
                                className="flex-1 rounded-2xl px-4 py-3"
                                style={{ backgroundColor: colors.background }}
                              >
                                <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                                  {commenterName || "User"}
                                </Text>
                                <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
                                  {item.text}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}