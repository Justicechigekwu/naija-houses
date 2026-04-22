import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { MapPin, Star } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  owner?: {
    _id?: string;
    slug?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    location?: string;
    phone?: string;
    bio?: string;
  };
  averageRating?: number;
  totalReviews?: number;
  listingSlug?: string;
};

export default function SellerProfileCard({
  owner,
  averageRating = 0,
  totalReviews = 0,
  listingSlug,
}: Props) {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();

  const fullName = `${owner?.firstName || ""} ${owner?.lastName || ""}`.trim();

  return (
    <Pressable
      onPress={() => {
        if (owner?.slug) {
          router.push({
            pathname: "/profile/[slug]",
            params: {
              slug: owner.slug,
              ...(listingSlug ? { listingSlug } : {}),
            },
          } as any);
        }
      }}
      className="mt-6 overflow-hidden rounded-[24px]"
      style={{
        backgroundColor: resolvedTheme === "dark" ? colors.surface : "#1F2937",
        borderWidth: resolvedTheme === "dark" ? 1 : 0,
        borderColor: colors.border,
      }}
    >
      <View className="items-center px-5 pb-6 pt-6">
        <Image
          source={{
            uri: owner?.avatar || "https://via.placeholder.com/200x200?text=User",
          }}
          style={{ width: 88, height: 88, borderRadius: 44 }}
          contentFit="cover"
        />

        <Text
          className="mt-4 text-lg font-semibold"
          style={{ color: resolvedTheme === "dark" ? colors.text : "#FFFFFF" }}
        >
          {fullName || "Unknown User"}
        </Text>

        {owner?.location ? (
          <View
            className="mt-2 flex-row items-center rounded-full px-3 py-1.5"
            style={{
              backgroundColor:
                resolvedTheme === "dark" ? colors.background : "rgba(255,255,255,0.10)",
            }}
          >
            <MapPin
              size={14}
              color={resolvedTheme === "dark" ? colors.text : "#FFFFFF"}
            />
            <Text
              className="ml-1 text-sm"
              style={{ color: resolvedTheme === "dark" ? colors.text : "#FFFFFF" }}
            >
              {owner.location}
            </Text>
          </View>
        ) : null}

        <View
          className="mt-4 flex-row items-center rounded-2xl px-4 py-3"
          style={{
            backgroundColor:
              resolvedTheme === "dark" ? colors.background : "rgba(255,255,255,0.10)",
          }}
        >
          <Star size={18} color="#FACC15" fill="#FACC15" />
          <View className="ml-2">
            <Text
              className="text-sm font-medium"
              style={{ color: resolvedTheme === "dark" ? colors.text : "#FFFFFF" }}
            >
              {averageRating.toFixed(1)} rating
            </Text>
            <Text
              className="text-xs"
              style={{
                color: resolvedTheme === "dark" ? colors.muted : "rgba(255,255,255,0.75)",
              }}
            >
              {totalReviews} review{totalReviews === 1 ? "" : "s"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}