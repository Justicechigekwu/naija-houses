import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import ListingForm from "@/components/listings/ListingForm";
import { updateListing } from "@/features/listings/form-api";
import { api } from "@/libs/api";
import { useUI } from "@/hooks/useUI";
import type { Listing } from "@/types/listing";
import { useTheme } from "@/hooks/useTheme";

type ListingResponse = {
  listing?: Listing;
};

export default function EditListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useUI();
  const { colors } = useTheme();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get<ListingResponse | Listing>(`/listings/${id}`);

        if ("listing" in res.data) {
          setListing(res.data.listing ?? null);
        } else {
          setListing(res.data as Listing);
        }
      } catch {
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  const handleUpdate = async (formData: FormData) => {
    try {
      const res = await updateListing(String(id), formData);

      showToast("Listing updated successfully", "success");

      if (res?.slug) {
        router.replace(`/listings/${res.slug}` as any);
      }
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to update listing",
        "error"
      );
      throw error;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center" style={{ color: colors.text }}>
            Listing not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.surface }}
      >
        <ListingForm
          initialData={listing}
          onSubmit={handleUpdate}
          isEditMode
        />
      </ScrollView>
    </SafeAreaView>
  );
}