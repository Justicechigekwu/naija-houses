import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";

import AppScreen from "@/components/ui/AppScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import FavoriteButton from "@/components/favorites/FavoritesButton"
import { getMyFavorites } from "@/features/favorites/api";
import { useTheme } from "@/hooks/useTheme";
import type { Listing } from "@/types/listing";

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyFavorites();
      setFavorites(res || []);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const removeFromUi = (listingId: string) => {
    setFavorites((prev) => prev.filter((item) => item._id !== listingId));
  };

  if (loading) return <LoadingScreen />;

  return (
    <AppScreen scroll padded>
      <Text
        className="mb-5 text-2xl font-semibold"
        style={{ color: colors.text }}
      >
        Favorites
      </Text>

      {favorites.length === 0 ? (
        <View
          className="rounded-3xl border p-6"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <Text
            className="text-base font-medium"
            style={{ color: colors.text }}
          >
            No favorites yet
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
            Listings you save will appear here.
          </Text>
        </View>
      ) : (
        favorites.map((listing) => {
          const image = listing.images?.[0]?.url;

          return (
            <View
              key={listing._id}
              className="mb-4 rounded-3xl border p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Pressable
                onPress={() => {
                  if (!listing.slug) return;

                  router.push({
                    pathname: "/listings/[slug]",
                    params: { slug: listing.slug },
                  } as any);
                }}
                className="flex-row gap-4"
              >
                <View
                  className="h-24 w-24 overflow-hidden rounded-2xl"
                  style={{ backgroundColor: colors.background }}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>

                <View className="flex-1">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.text }}
                    numberOfLines={2}
                  >
                    {listing.title || "Untitled listing"}
                  </Text>

                  <Text
                    className="mt-2 text-base font-medium"
                    style={{ color: colors.success }}
                  >
                    ₦{Number(listing.price || 0).toLocaleString()}
                  </Text>

                  <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
                    {[listing.city, listing.state].filter(Boolean).join(", ")}
                  </Text>

                  <View className="mt-3 self-start">
                    <Pressable onPress={() => removeFromUi(listing._id)}>
                      <FavoriteButton listingId={listing._id} showText />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })
      )}
    </AppScreen>
  );
}