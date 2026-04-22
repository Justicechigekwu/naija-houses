import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MapPin } from "lucide-react-native";

import AppScreen from "@/components/ui/AppScreen";
import MasonryListingGrid from "@/components/listings/MasnoryListingGrid";
import HomeSearchCard from "@/components/home/HomeSearchCard";
import HomeLocationFilterModal from "@/components/home/HomeLocationFilterModel";
import MobileNavbarSearch from "@/components/Search/MobileNavbarSearch";
import useHomeLocationFeed from "@/hooks/useHomeLocationFeed";
import { useBrowsingLocation } from "@/context/BrowsingLocationContext";
import { useTheme } from "@/hooks/useTheme";

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const { browsingLocation, setManualLocation, resetToDeviceLocation } =
    useBrowsingLocation();
  const { listings, similarListings, meta, loading, error } = useHomeLocationFeed();
  const { colors } = useTheme();

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const heroHeight = Math.max(520, height * 0.8);

  const sectionTitle = useMemo(() => {
    if (browsingLocation.isManual) {
      if (browsingLocation.city && browsingLocation.state) {
        return `Listings in ${browsingLocation.city}, ${browsingLocation.state}`;
      }

      if (browsingLocation.state) {
        return `Listings in ${browsingLocation.state}`;
      }
    }

    return browsingLocation.city || browsingLocation.state
      ? "Trending 🔥"
      : "For you 🔥";
  }, [
    browsingLocation.isManual,
    browsingLocation.city,
    browsingLocation.state,
  ]);

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
          setLocationModalOpen(false);
        }}
        onClear={() => {
          resetToDeviceLocation();
          setLocationModalOpen(false);
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ backgroundColor: colors.background }}>
          <MobileNavbarSearch />

          <ImageBackground
            source={require("@/assets/images/mobile-background.jpg")}
            resizeMode="cover"
            style={[
              styles.heroBackground,
              {
                height: heroHeight,
                width,
              },
            ]}
            imageStyle={styles.heroImage}
          >
            <View style={styles.overlay} />

            <View style={styles.heroContent}>
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroTitle}>Trade smart. Live better.</Text>

                <Text style={styles.heroSubtitle}>
                  Buy, sell and rent properties, vehicles, electronics, phones
                  and more across Nigeria on Velora.
                </Text>
              </View>

              <View style={styles.searchWrap}>
                <HomeSearchCard />
              </View>
            </View>
          </ImageBackground>

          <View
            className="pb-4 pt-5"
            style={{ backgroundColor: colors.background }}
          >
            <View className="mb-4 flex-row items-center justify-between px-4">
              <Text
                className="text-[18px] font-bold"
                style={{ color: colors.text, flex: 1, paddingRight: 12 }}
              >
                {sectionTitle}
              </Text>

              <Pressable
                onPress={() => setLocationModalOpen(true)}
                className="flex-row items-center rounded-xl border px-4 py-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <MapPin size={16} color={colors.text} />
                <Text
                  className="ml-2 text-[10px] font-medium"
                  style={{ color: colors.text }}
                >
                  {browsingLocation.isManual
                    ? browsingLocation.city
                      ? `${browsingLocation.city}, ${browsingLocation.state}`
                      : browsingLocation.state
                    : "Filter by location"}
                </Text>
              </Pressable>
            </View>

            {browsingLocation.isManual ? (
              <View className="mb-4 px-4">
                <Pressable
                  onPress={() => resetToDeviceLocation()}
                  className="self-start rounded-xl border px-4 py-3"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text style={{ color: colors.text }}>My location</Text>
                </Pressable>
              </View>
            ) : null}

            {browsingLocation.loading || loading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color={colors.brand} />
              </View>
            ) : null}

            {!loading && !!error ? (
              <View
                className="mx-4 rounded-2xl p-4"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-center" style={{ color: colors.danger }}>
                  {error}
                </Text>
              </View>
            ) : null}

            {!loading && !error && listings.length === 0 ? (
              <View
                className="mx-4 rounded-2xl p-4"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-center" style={{ color: colors.muted }}>
                  No listings found for this location.
                </Text>
              </View>
            ) : null}

            {!loading && !error && listings.length > 0 ? (
              <>
                <MasonryListingGrid items={listings} />

                {exactEndText ? (
                  <View
                    className="mx-4 mt-8 rounded-2xl p-5"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Text
                      className="text-[16px] font-semibold"
                      style={{ color: colors.text }}
                    >
                      {exactEndText}
                    </Text>
                  </View>
                ) : null}

                {similarListings.length > 0 ? (
                  <View className="mt-8">
                    <Text
                      className="mb-4 px-4 text-[22px] font-bold"
                      style={{ color: colors.text }}
                    >
                      Similar listings from other cities
                      {meta?.selectedState ? ` in ${meta.selectedState}` : ""}
                    </Text>

                    <MasonryListingGrid items={similarListings} />
                  </View>
                ) : null}
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroBackground: {
    justifyContent: "flex-end",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
  },
  heroTextWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
  },
  heroSubtitle: {
    marginTop: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 360,
  },
  searchWrap: {
    marginTop: 28,
  },
});