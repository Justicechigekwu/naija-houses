import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Star, MessageSquareText } from "lucide-react-native";

import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/hooks/useTheme";
import { getOwnerAverageRating, getOwnerReviews } from "@/features/reviews/api";
import type { ReviewItem } from "@/types/review";
import StarRating from "@/components/reviews/StarRating";
import Avatar from "@/components/ui/Avatar";

export default function FeedbackScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        if (!user?.id) {
          if (active) setLoading(false);
          return;
        }

        const [reviewsRes, avgRes] = await Promise.all([
          getOwnerReviews(user.id),
          getOwnerAverageRating(user.id),
        ]);

        if (!active) return;

        setReviews(reviewsRes || []);
        setAverageRating(avgRes.averageRating || 0);
        setTotalReviews(avgRes.totalReviews || 0);
      } catch {
        if (!active) return;
        setReviews([]);
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
  }, [user?.id]);

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
          >
            <Text className="text-sm" style={{ color: colors.text }}>
              Your public reputation
            </Text>
            <Text className="mt-2 text-2xl font-bold" style={{ color: colors.text }}>
              My Feedbacks
            </Text>
            <Text className="mt-2 text-sm leading-6" style={{ color: colors.text,  }}>
              See how buyers rate your conversations and transactions.
            </Text>
          </View>

          <View className="p-6">
            <View
              className="mb-8 rounded-3xl border p-5"
              style={{ borderColor: colors.border, backgroundColor: colors.background }}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    Overall rating
                  </Text>

                  <View className="mt-3 flex-row items-center gap-3">
                    <View
                      className="items-center justify-center rounded-2xl"
                      style={{
                        width: 46,
                        height: 46,
                        backgroundColor: colors.brand,
                      }}
                    >
                      <Star size={24} color="#FFFFFF" fill="#FFFFFF" />
                    </View>

                    <View>
                      <Text className="text-3xl font-bold" style={{ color: colors.text }}>
                        {averageRating.toFixed(1)}
                      </Text>
                      <Text className="text-sm" style={{ color: colors.muted }}>
                        {totalReviews} review{totalReviews === 1 ? "" : "s"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  className="rounded-2xl px-4 py-4"
                  style={{ backgroundColor: colors.surface }}
                >
                  <StarRating value={averageRating} size={20} />
                </View>
              </View>
            </View>

            {loading ? (
              <Text style={{ color: colors.muted }}>Loading feedback...</Text>
            ) : reviews.length === 0 ? (
              <View
                className="rounded-3xl border px-6 py-12"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  borderStyle: "dashed",
                }}
              >
                <View
                  className="mx-auto items-center justify-center rounded-full"
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: colors.surface,
                  }}
                >
                  <MessageSquareText size={28} color={colors.muted} />
                </View>

                <Text
                  className="mt-4 text-center text-lg font-semibold"
                  style={{ color: colors.text }}
                >
                  No feedback yet
                </Text>

                <Text
                  className="mt-2 text-center text-sm"
                  style={{ color: colors.muted }}
                >
                  You do not have any feedback yet.
                </Text>
              </View>
            ) : (
              <View>
                {reviews.map((review) => {
                  const reviewerName = `${review.reviewer?.firstName || ""} ${review.reviewer?.lastName || ""}`.trim();

                  return (
                    <Pressable
                      key={review._id}
                      onPress={() =>
                        router.push({
                          pathname: "/feedback/[reviewId]",
                          params: { reviewId: review._id },
                        } as any)
                      }
                      className="mb-4 rounded-3xl border p-5"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <View className="flex-row gap-4">
                        <Avatar
                          uri={review.reviewer?.avatar || null}
                          name={reviewerName || "U"}
                          size={44}
                        />

                        <View className="min-w-0 flex-1">
                          <Text className="font-semibold" style={{ color: colors.text }}>
                            {reviewerName || "Anonymous user"}
                          </Text>

                          <View className="mt-2">
                            <StarRating value={review.rating} size={16} />
                          </View>

                          {!!review.comment ? (
                            <Text
                              className="mt-3 text-sm leading-6"
                              style={{ color: colors.muted }}
                              numberOfLines={3}
                            >
                              {review.comment}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}