import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight, Star } from "lucide-react-native";
import { useRouter } from "expo-router";
import { getOwnerAverageRating } from "@/features/reviews/api";
import { useTheme } from "@/hooks/useTheme";

export default function ReviewsSummaryCard({
  ownerId,
  ownerSlug,
}: {
  ownerId: string;
  ownerSlug?: string;
}) {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const res = await getOwnerAverageRating(ownerId);
        if (!active) return;

        setAverageRating(res.averageRating || 0);
        setTotalReviews(res.totalReviews || 0);
      } catch {
        if (!active) return;
        setAverageRating(0);
        setTotalReviews(0);
      }
    };

    if (ownerId) run();

    return () => {
      active = false;
    };
  }, [ownerId]);

  return (
    <Pressable
      onPress={() => {
        if (ownerSlug) {
          router.push(`/profile/${ownerSlug}/reviews` as any);
        }
      }}
      className="mt-4 rounded-2xl border p-4"
      style={{
        borderColor: colors.border,
        backgroundColor: resolvedTheme === "dark" ? colors.surface : "#fafafa",
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold" style={{ color: colors.text }}>
            Ratings & Reviews
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
            See what buyers and sellers are saying
          </Text>
        </View>

        <ChevronRight size={18} color={colors.muted} />
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <Star size={18} color="#FACC15" fill="#FACC15" />
        <Text className="text-sm font-medium" style={{ color: colors.text }}>
          {averageRating.toFixed(1)}
        </Text>
        <Text className="text-sm" style={{ color: colors.muted }}>
          ({totalReviews})
        </Text>
      </View>
    </Pressable>
  );
}