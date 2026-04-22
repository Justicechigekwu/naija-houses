import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import AppScreen from "@/components/ui/AppScreen";
import MasonryListingGrid from "@/components/listings/MasnoryListingGrid";
import HomeLocationFilterModal from "@/components/home/HomeLocationFilterModel";
import useInfiniteLocationSearch from "@/hooks/useInfiniteLocationSearch";
import { useBrowsingLocation } from "@/context/BrowsingLocationContext";
import { useTheme } from "@/hooks/useTheme";

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    search?: string;
    category?: string;
    subcategory?: string;
  }>();

  const search = String(params.search || "");
  const category = String(params.category || "");
  const subcategory = String(params.subcategory || "");

  const {
    browsingLocation,
    setManualLocation,
    resetToDeviceLocation,
  } = useBrowsingLocation();

  const {
    results,
    similarListings,
    meta,
    loading,
    error,
    userLocation,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteLocationSearch(search, category, subcategory);

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const exactEndText = useMemo(() => {
    if (!meta?.exactLocationOnly) return "";

    if (meta.selectedCity && meta.selectedState) {
      return `That is all for ${meta.selectedCity}, ${meta.selectedState}.`;
    }

    if (meta.selectedState) {
      return `That is all for ${meta.selectedState}.`;
    }

    return "";
  }, [meta]);

  return (
    <AppScreen padded={false}>
      <HomeLocationFilterModal
        visible={locationModalOpen}
        selectedState={browsingLocation.isManual ? browsingLocation.state : ""}
        selectedCity={browsingLocation.isManual ? browsingLocation.city : ""}
        onClose={() => setLocationModalOpen(false)}
        onApply={({ state, city }) => {
          setManualLocation({ state, city });
        }}
        onClear={() => {
          resetToDeviceLocation();
        }}
      />

      <FlatList
        data={[{ key: "content" }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.6}
        renderItem={() => (
          <View style={{ paddingBottom: 28 }}>
            <View className=" pb-4 pt-3">

              <View className="mb-4 flex-row items-center justify-between">
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text className="text-[13px]" style={{ color: colors.muted }}>
                    {meta?.exactLocationOnly
                      ? `Showing only listings for ${[meta.selectedCity, meta.selectedState]
                          .filter(Boolean)
                          .join(", ")}`
                      : userLocation.city || userLocation.state
                      ? `Showing nearby results first in ${[userLocation.city, userLocation.state]
                          .filter(Boolean)
                          .join(", ")}`
                      : "Showing best matching results"}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setLocationModalOpen(true)}
                  className="rounded-xl border px-4 py-3"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text style={{ color: colors.text }}>Location</Text>
                </Pressable>
              </View>

              {userLocation.isManual ? (
                <Pressable
                  onPress={() => resetToDeviceLocation()}
                  className="mb-4 self-start rounded-xl border px-4 py-3"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text style={{ color: colors.text }}>My location</Text>
                </Pressable>
              ) : null}

              {loading ? (
                <View className="items-center py-10">
                  <ActivityIndicator size="large" color={colors.brand} />
                </View>
              ) : error ? (
                <View
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text style={{ color: colors.danger }}>{error}</Text>
                </View>
              ) : results.length === 0 ? (
                <View
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text style={{ color: colors.muted }}>
                    No listing found for this category or location.
                  </Text>
                </View>
              ) : (
                <>
                  <Text
                    className="mb-4 text-[20px] font-bold"
                    style={{ color: colors.text }}
                  >
                    Matching listings
                  </Text>

                  <MasonryListingGrid items={results} />

                  {exactEndText ? (
                    <View
                      className="mt-8 rounded-2xl p-5"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <Text
                        className="text-[16px] font-semibold"
                        style={{ color: colors.text }}
                      >
                        {exactEndText}
                      </Text>

                      <Text
                        className="mt-2 text-[13px]"
                        style={{ color: colors.muted }}
                      >
                        Would you like to see similar listings from other cities
                        {meta?.selectedState ? ` in ${meta.selectedState}` : ""}?
                      </Text>

                      <Pressable
                        onPress={() => setLocationModalOpen(true)}
                        className="mt-4 self-start rounded-xl border px-4 py-3"
                        style={{
                          borderColor: colors.brand,
                          backgroundColor: colors.surface,
                        }}
                      >
                        <Text style={{ color: colors.brand }}>
                          Change location
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}

                  {similarListings.length > 0 ? (
                    <View className="mt-8">
                      <Text
                        className="mb-4 text-[20px] font-bold"
                        style={{ color: colors.text }}
                      >
                        Similar listings from other cities
                        {meta?.selectedState ? ` in ${meta.selectedState}` : ""}
                      </Text>

                      <MasonryListingGrid items={similarListings} />
                    </View>
                  ) : null}

                  {isFetchingNextPage ? (
                    <View className="items-center py-6">
                      <ActivityIndicator size="small" color={colors.brand} />
                    </View>
                  ) : null}
                </>
              )}
            </View>
          </View>
        )}
      />
    </AppScreen>
  );
}