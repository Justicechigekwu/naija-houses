import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { MapPin, PackageOpen, ChevronRight } from "lucide-react-native";
import { getPublicUserListings } from "@/features/public-profile/api";
import type { Listing } from "@/types/listing";
import { useTheme } from "@/hooks/useTheme";

export default function PublicUserListingsSection({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await getPublicUserListings(userId);
        setListings(res || []);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  if (loading) {
    return (
      <View className="py-8">
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <View
        className="rounded-3xl border border-dashed px-6 py-12"
        style={{
          borderColor: colors.border,
          backgroundColor: resolvedTheme === "dark" ? colors.surface : "#fafafa",
        }}
      >
        <View className="items-center">
          <View
            className="h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.background }}
          >
            <PackageOpen size={28} color={colors.muted} />
          </View>
          <Text className="mt-4 text-lg font-semibold" style={{ color: colors.text }}>
            No active listings yet
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.muted }}>
            This user does not have any active listings at the moment.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {listings.map((listing) => (
        <Pressable
          key={listing._id}
          onPress={() => {
            if (listing.slug) {
              router.push(`/listings/${listing.slug}` as any);
            }
          }}
          className="rounded-2xl border p-4"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View className="flex-row items-center gap-4">
            <View
              className="h-24 w-24 overflow-hidden rounded-xl"
              style={{ backgroundColor: colors.background }}
            >
              <Image
                source={{
                  uri:
                    listing.images?.[0]?.url ||
                    "https://via.placeholder.com/300x300?text=Velora",
                }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>

            <View className="min-w-0 flex-1">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.text }}
                numberOfLines={1}
              >
                {listing.title}
              </Text>

              <Text className="mt-2 font-bold text-green-600">
                ₦{Number(listing.price || 0).toLocaleString()}
              </Text>

              {(listing.state || listing.city) ? (
                <View className="mt-2 flex-row items-center gap-1">
                  <MapPin size={14} color={colors.muted} />
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    {[listing.state, listing.city].filter(Boolean).join(", ")}
                  </Text>
                </View>
              ) : null}
            </View>

            <ChevronRight size={18} color={colors.muted} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}