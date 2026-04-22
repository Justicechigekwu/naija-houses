import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import AppScreen from "@/components/ui/AppScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import { getRejectedPaymentListing } from "@/features/listings/publish-api";
import type { Listing } from "@/types/listing";
import { hexToRgba } from "@/libs/theme-utils";

export default function RejectedPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useUI();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getRejectedPaymentListing(String(id));
        setListing(res);
      } catch (error: any) {
        showToast(
          error?.response?.data?.message || "Failed to load rejected payment listing",
          "error"
        );
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) run();
  }, [id, showToast]);

  if (loading) return <LoadingScreen />;

  if (!listing) {
    return (
      <AppScreen padded>
        <View
          className="rounded-3xl border p-6"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <Text className="text-xl font-semibold" style={{ color: colors.text }}>
            Rejected Payment
          </Text>
          <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
            Listing not found.
          </Text>

          <Pressable
            onPress={() => router.replace("/notification" as any)}
            className="mt-4 items-center rounded-2xl px-4 py-3"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <Text style={{ color: colors.text }}>Back to notifications</Text>
          </Pressable>
        </View>
      </AppScreen>
    );
  }

  const image = listing.images?.[0]?.url;

  return (
    <AppScreen scroll padded>
      <View
        className="mb-4 rounded-3xl border p-5"
        style={{
          borderColor: hexToRgba(colors.danger, 0.22),
          backgroundColor: hexToRgba(colors.danger, 0.08),
        }}
      >
        <Text className="text-2xl font-semibold" style={{ color: colors.danger }}>
          Payment Rejected
        </Text>
        <Text className="mt-2 text-sm leading-6" style={{ color: colors.text }}>
          Your payment for this listing was rejected. Review the reason below, then continue to
          payment details to retry payment.
        </Text>
      </View>

      {listing.rejectionReason ? (
        <View
          className="mb-4 rounded-3xl border p-5"
          style={{
            borderColor: hexToRgba(colors.brand, 0.22),
            backgroundColor: hexToRgba(colors.brand, 0.08),
          }}
        >
          <Text className="text-base font-semibold" style={{ color: colors.text }}>
            Rejection reason
          </Text>
          <Text className="mt-2 text-sm leading-6" style={{ color: colors.text }}>
            {listing.rejectionReason}
          </Text>
        </View>
      ) : null}

      <View
        className="rounded-3xl border p-5"
        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
      >
        <View className="gap-5">
          <View
            className="h-56 overflow-hidden rounded-2xl"
            style={{ backgroundColor: colors.background }}
          >
            {image ? (
              <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            ) : null}
          </View>

          <Text className="text-xl font-semibold" style={{ color: colors.text }}>
            {listing.title || "Untitled listing"}
          </Text>

          <Text className="text-base font-semibold" style={{ color: colors.success }}>
            ₦{Number(listing.price || 0).toLocaleString()}
          </Text>

          <Text className="text-sm" style={{ color: colors.muted }}>
            {[listing.city, listing.state].filter(Boolean).join(", ") || "No location"}
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.replace({
                pathname: "/listing-actions/[id]/payment-details",
                params: { id: listing._id },
              } as any)}
              className="flex-1 items-center rounded-2xl px-4 py-3"
              style={{ backgroundColor: colors.brand }}
            >
              <Text className="text-sm font-semibold text-white">Go to payment details</Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/notification" as any)}
              className="flex-1 items-center rounded-2xl px-4 py-3"
              style={{ borderWidth: 1, borderColor: colors.border }}
            >
              <Text className="text-sm font-medium" style={{ color: colors.text }}>
                Back
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}