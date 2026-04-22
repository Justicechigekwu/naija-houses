import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  MessageSquareText,
  Star,
  BadgeCheck,
} from "lucide-react-native";

import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import { api } from "@/libs/api";
import StarRating from "@/components/reviews/StarRating";

type ExistingReview = {
  _id: string;
  rating: number;
  comment: string;
};

type EligibilityResponse = {
  canReview: boolean;
  alreadyReviewed: boolean;
  buyerMessageCount: number;
  sellerMessageCount: number;
  minimumRequired: number;
  existingReview?: ExistingReview | null;
};

type SellerAverageResponse = {
  averageRating?: number;
  totalReviews?: number;
};

type ListingReviewPageResponse = {
  listing?: {
    _id: string;
    title?: string;
    owner?: {
      _id?: string;
      firstName?: string;
      lastName?: string;
    };
  };
};

export default function ReviewListingScreen() {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();
  const { showToast } = useUI();

  const params = useLocalSearchParams<{
    listingId?: string | string[];
    from?: string | string[];
    chatId?: string | string[];
  }>();

  const listingId = Array.isArray(params.listingId)
    ? params.listingId[0]
    : params.listingId || "";

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(null);
  const [canReview, setCanReview] = useState(false);

  const [listingTitle, setListingTitle] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      try {
        setPageLoading(true);

        const [eligibilityRes, listingRes] = await Promise.all([
          api.get<EligibilityResponse>(`/reviews/eligibility/${listingId}`),
          api.get<ListingReviewPageResponse | any>(`/listings/${listingId}`).catch(
            async () => {
              const chatRes = await api.get("/chats");
              return { data: null };
            }
          ),
        ]);

        if (!active) return;

        const eligibility = eligibilityRes.data;

        setCanReview(eligibility.canReview || eligibility.alreadyReviewed);

        if (eligibility.existingReview) {
          setExistingReview(eligibility.existingReview);
          setRating(eligibility.existingReview.rating);
          setComment(eligibility.existingReview.comment);
        }

        const fetchedListingTitle =
          listingRes?.data?.listing?.title ||
          listingRes?.data?.title ||
          "Listing review page";

        setListingTitle(fetchedListingTitle);

        const ownerId =
          listingRes?.data?.listing?.owner?._id ||
          listingRes?.data?.owner?._id;

        if (ownerId) {
          try {
            const avgRes = await api.get<SellerAverageResponse>(
              `/reviews/owner/${ownerId}/average`
            );

            if (!active) return;

            setAverageRating(avgRes.data?.averageRating || 0);
            setTotalReviews(avgRes.data?.totalReviews || 0);
          } catch {
            if (!active) return;
            setAverageRating(0);
            setTotalReviews(0);
          }
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
      } catch (error: any) {
        if (!active) return;

        showToast(
          error?.response?.data?.message || "Failed to load review page",
          "error"
        );
        setCanReview(false);
      } finally {
        if (active) setPageLoading(false);
      }
    };

    if (listingId) {
      loadPage();
    } else {
      setPageLoading(false);
    }

    return () => {
      active = false;
    };
  }, [listingId, showToast]);

  const summaryText = useMemo(() => {
    if (totalReviews === 1) return "1 review";
    return `${totalReviews} reviews`;
  }, [totalReviews]);

  const handleSubmit = async () => {
    if (!rating) {
      showToast("Please select stars", "error");
      return;
    }

    try {
      setLoading(true);

      if (existingReview) {
        const updated = await api.put(`/reviews/${existingReview._id}`, {
          rating,
          comment,
        });

        setExistingReview({
          _id: updated.data._id,
          rating: updated.data.rating,
          comment: updated.data.comment,
        });

        showToast("Review updated", "success");
      } else {
        const created = await api.post(`/reviews`, {
          listingId,
          rating,
          comment,
        });

        setExistingReview({
          _id: created.data._id,
          rating: created.data.rating,
          comment: created.data.comment,
        });

        showToast("Review submitted", "success");
      }

      router.back();
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to submit review",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      </SafeAreaView>
    );
  }

  if (!canReview && !existingReview) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 px-4 py-4">
          <Pressable
            onPress={() => router.back()}
            className="mb-4 self-start rounded-xl border px-4 py-3"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <ArrowLeft size={18} color={colors.text} />
          </Pressable>

          <View
            className="rounded-3xl border p-6"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text className="text-lg font-semibold" style={{ color: colors.text }}>
              Review unavailable
            </Text>
            <Text
              className="mt-2 text-sm leading-6"
              style={{ color: colors.muted }}
            >
              This review becomes available only after both buyer and seller
              have sent at least 2 messages each.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          className="mb-4 self-start rounded-xl border px-4 py-3"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <ArrowLeft size={18} color={colors.text} />
        </Pressable>

        <View
          className="rounded-[28px] border p-4"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View className="flex-row items-start justify-between gap-4 rounded-[24px] border px-4 py-5"
            style={{
              borderColor: colors.border,
              backgroundColor:
                resolvedTheme === "dark" ? colors.surface : colors.background,
            }}
          >

            <View
              className="flex-row items-center rounded-2xl border px-4 py-3"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >

              <View className="text-justify">
                <Text
                  className="text-sm  font-semibold"
                  style={{ color: colors.text }}
                >
                  How was your conversation with this seller?
                </Text>
                <Text className="text-xs justify" style={{ color: colors.muted }}>
                  Share your experience to help other buyers make better decisions.
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-6 flex-col gap-4">
            <View
              className="rounded-[24px] border p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Text
                className="text-[26px] font-semibold"
                style={{ color: colors.text }}
              >
                Rate this Seller
              </Text>

              <Text
                className="mt-2 text-sm leading-6"
                style={{ color: colors.muted }}
              >
                Share an honest experience about your conversation or transaction.
              </Text>

              <View
                className="mt-5 rounded-2xl px-4 py-5"
                style={{
                  backgroundColor:
                    resolvedTheme === "dark" ? colors.background : "#F9F7F5",
                }}
              >
                <StarRating value={rating} onChange={setRating} size={26} />
              </View>

              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Leave a comment..."
                placeholderTextColor={colors.muted}
                multiline
                textAlignVertical="top"
                className="mt-4 min-h-[120px] rounded-2xl border px-4 py-4"
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.surface,
                }}
              />

              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className="mt-4 self-start rounded-full px-5 py-3"
                style={{
                  backgroundColor: loading ? colors.border : colors.brand,
                }}
              >
                <Text className="font-semibold text-white">
                  {loading
                    ? "Saving..."
                    : existingReview
                    ? "Update Review"
                    : "Submit Review"}
                </Text>
              </Pressable>
            </View>

            <View
              className="rounded-[24px] border p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <View
                className="items-center justify-center rounded-2xl"
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor:
                    resolvedTheme === "dark" ? colors.background : "#F9F7F5",
                }}
              >
                <MessageSquareText size={20} color={colors.brand} />
              </View>

              <Text
                className="mt-5 text-[22px] font-semibold"
                style={{ color: colors.text }}
              >
                Why your review matters
              </Text>

              <Text
                className="mt-3 text-sm leading-7"
                style={{ color: colors.muted }}
              >
                Reviews help buyers know who they can trust, and they also help
                good sellers build stronger credibility on Velora.
              </Text>

              <View
                className="mt-5 rounded-2xl px-4 py-4"
                style={{
                  backgroundColor:
                    resolvedTheme === "dark" ? colors.background : "#F9F7F5",
                }}
              >
                <Text
                  className="text-sm leading-6"
                  style={{ color: colors.text }}
                >
                  Keep your feedback clear, honest, and based on your real experience.
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text
              className="text-[24px] font-semibold"
              style={{ color: colors.text }}
            >
              Seller rating summary
            </Text>

            <Text
              className="mt-2 text-sm leading-6"
              style={{ color: colors.muted }}
            >
              See the seller&apos;s overall review score and public feedback.
            </Text>

            <View
              className="mt-4 self-start flex-row items-center rounded-full border px-4 py-3"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <StarRating value={Math.round(averageRating)} size={16} />
              <Text
                className="ml-3 text-sm font-medium"
                style={{ color: colors.text }}
              >
                {averageRating.toFixed(1)}
              </Text>
              <Text className="ml-2 text-sm" style={{ color: colors.muted }}>
                {summaryText}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}