import { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import AppScreen from "@/components/ui/AppScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import { getPendingListings } from "@/features/listings/publish-api";
import useSocketListingUpdates from "@/hooks/useSocketListingUpdates";
import type { Listing } from "@/types/listing";
import { hexToRgba } from "@/libs/theme-utils";

export default function PendingScreen() {
  const { colors } = useTheme();
  const { showToast } = useUI();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPendingListings();
      setItems(res || []);
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Failed to load pending listings", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  useSocketListingUpdates({
    onListingUpdated: (payload) => {
      if (!payload?.listingId) return;

      const stillPending =
        payload.publishStatus === "PENDING_CONFIRMATION" ||
        payload.publishStatus === "APPEAL_PENDING";

      setItems((prev) => {
        const exists = prev.some((item) => item._id === payload.listingId);

        if (stillPending) {
          if (!exists) return prev;

          return prev.map((item) =>
            item._id === payload.listingId
              ? {
                  ...item,
                  publishStatus: payload.publishStatus,
                  updatedAt: payload.updatedAt || item.updatedAt,
                  publishedAt: payload.publishedAt ?? item.publishedAt,
                  expiresAt: payload.expiresAt ?? item.expiresAt,
                }
              : item
          );
        }

        return prev.filter((item) => item._id !== payload.listingId);
      });
    },
  });

  if (loading) return <LoadingScreen />;

  return (
    <AppScreen scroll padded>
      <Text className="mb-5 text-2xl font-semibold" style={{ color: colors.text }}>
        Pending Page
      </Text>

      {items.length === 0 ? (
        <View
          className="rounded-3xl border p-5"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <Text className="font-medium" style={{ color: colors.text }}>
            No pending listings right now.
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
            Your pending listings will appear here.
          </Text>
        </View>
      ) : (
        items.map((item) => {
          const image = item.images?.[0]?.url;
          const isAppeal = item.publishStatus === "APPEAL_PENDING";

          return (
            <View
              key={item._id}
              className="mb-4 rounded-3xl border p-4"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <View className="flex-row gap-4">
                <View
                  className="h-24 w-24 overflow-hidden rounded-2xl"
                  style={{ backgroundColor: colors.background }}
                >
                  {image ? (
                    <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                  ) : null}
                </View>

                <View className="flex-1">
                  <View className="flex-row items-start justify-between gap-3">
                    <Text className="flex-1 text-base font-semibold" style={{ color: colors.text }}>
                      {item.title?.trim() || "Untitled listing"}
                    </Text>

                    <View
                      className="rounded-full px-3 py-1"
                      style={{
                        backgroundColor: isAppeal
                          ? hexToRgba(colors.brand, 0.12)
                          : hexToRgba(colors.success, 0.12),
                      }}
                    >
                      <Text
                        className="text-xs font-medium"
                        style={{ color: isAppeal ? colors.brand : colors.success }}
                      >
                        {isAppeal ? "Appeal Under Review" : "Awaiting Approval"}
                      </Text>
                    </View>
                  </View>

                  <Text className="mt-2 text-base font-medium" style={{ color: colors.success }}>
                    ₦{Number(item.price || 0).toLocaleString()}
                  </Text>

                  <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
                    {[item.city, item.state].filter(Boolean).join(", ") || "No location yet"}
                  </Text>

                  {isAppeal ? (
                    <Text className="mt-2 text-sm font-medium" style={{ color: colors.brand }}>
                      Your appeal has been submitted and is waiting for admin review.
                    </Text>
                  ) : null}

                  <Text className="mt-2 text-xs" style={{ color: colors.muted }}>
                    Last updated:{" "}
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "No update date"}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </AppScreen>
  );
}