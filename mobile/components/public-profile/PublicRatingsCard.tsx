import { Pressable, Text, View } from "react-native";
import { ChevronRight, Star } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function PublicRatingsCard({
  slug,
  averageRating = 0,
  totalReviews = 0,
}: {
  slug?: string;
  averageRating?: number;
  totalReviews?: number;
}) {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();

  return (
    <Pressable
      onPress={() => {
        if (slug) {
          router.push(`/profile/${slug}/reviews` as any);
        }
      }}
      className="rounded-2xl border p-4"
      style={{
        borderColor: colors.border,
        backgroundColor: resolvedTheme === "dark" ? colors.surface : "#FAFAFA",
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
          {(averageRating || 0).toFixed(1)}
        </Text>
        <Text className="text-sm" style={{ color: colors.muted }}>
          ({totalReviews || 0})
        </Text>
      </View>
    </Pressable>
  );
}