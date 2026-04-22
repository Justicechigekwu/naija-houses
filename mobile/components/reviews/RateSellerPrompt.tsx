import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { getReviewEligibility } from "@/features/reviews/api";
import { useTheme } from "@/hooks/useTheme";

export default function RateSellerPrompt({
  listingId,
  chatId,
  refreshKey = 0,
}: {
  listingId: string;
  chatId: string;
  refreshKey?: number;
}) {
  const router = useRouter();
  const { colors } = useTheme();
  const [canShow, setCanShow] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const loadEligibility = async () => {
      try {
        const data = await getReviewEligibility(listingId);

        if (!mountedRef.current) return;

        if (data.alreadyReviewed) {
          setCanShow(false);
          return;
        }

        setCanShow(!!data.canReview);
      } catch {
        if (!mountedRef.current) return;
        setCanShow(false);
      }
    };

    if (listingId) {
      loadEligibility();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [listingId, refreshKey]);

  if (!canShow) return null;

  return (
    <View
      className="mb-3 overflow-hidden rounded-2xl border"
      style={{
        borderColor: "rgba(138,113,93,0.2)",
        backgroundColor: colors.surface,
      }}
    >
      <View className="p-4">
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.text }}
        >
          How was your conversation with this seller?
        </Text>

        <Text
          className="mt-1 text-sm leading-6"
          style={{ color: colors.muted }}
        >
          Share your experience to help other buyers make better decisions.
        </Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/reviews/[listingId]",
              params: {
                listingId,
                from: "chat",
                chatId,
              },
            } as any)
          }
          className="mt-4 items-center justify-center rounded-xl px-4 py-3"
          style={{ backgroundColor: colors.brand }}
        >
          <Text className="text-sm font-semibold text-white">Rate Seller</Text>
        </Pressable>
      </View>
    </View>
  );
}