import { ActivityIndicator, Text, View } from "react-native";
import MasonryListingGrid from "@/components/listings/MasnoryListingGrid";
import useInfiniteRelatedListings from "@/hooks/useInfiniteRelatedListings";
import { useTheme } from "@/hooks/useTheme";

export default function RelatedListingsSection({
  listingId,
}: {
  listingId: string;
}) {
  const {
    listings,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteRelatedListings(listingId);

  const { colors } = useTheme();

  if (loading) {
    return (
      <View className="mt-6 items-center py-6">
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  if (error || !listings.length) {
    return null;
  }

  return (
    <View className="mt-6">
      <Text
        className="mb-4 text-xl font-bold"
        style={{ color: colors.text }}
      >
        Similar items
      </Text>

      <MasonryListingGrid items={listings} />

      {isFetchingNextPage ? (
        <View className="py-4">
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : null}
    </View>
  );
}