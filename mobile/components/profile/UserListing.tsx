import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { getUserListings } from "@/features/profile/listings-api";
import { deleteListingById } from "@/features/listings/api";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import type { Listing } from "@/types/listing";

type Props = {
  userId: string;
};

export default function UserListings({ userId }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast, showConfirm } = useUI();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await getUserListings(userId);
        setListings(res || []);
      } catch (error: any) {
        showToast(
          error?.response?.data?.message || "Failed to fetch your listings",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchListings();
    }
  }, [userId, showToast]);

  const handleDelete = async (listingId: string) => {
    try {
      setDeletingId(listingId);
      await deleteListingById(listingId);

      setListings((prev) => prev.filter((item) => item._id !== listingId));
      showToast("Listing deleted successfully", "success");
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to delete listing",
        "error"
      );
      throw error;
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <View
      className="mt-4 rounded-[20px] border py-5"
    >
      <View className="px-4">
        <Text
          className="text-[18px] font-semibold"
          style={{ color: colors.text }}
        >
          Your Listings
        </Text>
      </View>

      <View className="mt-4 px-2">
        {loading ? (
          <Text style={{ color: colors.muted }}>Loading listings...</Text>
        ) : listings.length === 0 ? (
          <View
            className="rounded-[22px] border p-2"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <Text style={{ color: colors.text }}>
              You have no active listings yet.
            </Text>
          </View>
        ) : (
          listings.map((listing) => (
            <View
              key={listing._id}
              className="mb-4 rounded-[22px] border p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            >
              <Pressable
                onPress={() => {
                  if (!listing.slug) {
                    showToast("Listing slug is missing", "error");
                    return;
                  }

                  router.push({
                    pathname: "/listings/[slug]",
                    params: { slug: listing.slug },
                  } as any);
                }}
                className="flex-row items-center gap-4"
              >
                <View
                  className="h-20 w-20 overflow-hidden rounded-2xl"
                  style={{ backgroundColor: colors.surface }}
                >
                  {listing.images?.[0]?.url ? (
                    <Image
                      source={{ uri: listing.images[0].url }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>

                <View className="flex-1">
                  <Text
                    className="text-[15px] font-medium"
                    style={{ color: colors.text }}
                    numberOfLines={2}
                  >
                    {listing.title}
                  </Text>

                  <Text
                    className="mt-1 text-sm"
                    style={{ color: colors.muted }}
                  >
                    {[listing.city, listing.state].filter(Boolean).join(", ")}
                  </Text>

                  <Text
                    className="mt-1 text-sm font-semibold"
                    style={{ color: colors.success }}
                  >
                    ₦{Number(listing.price || 0).toLocaleString()}
                  </Text>
                </View>
              </Pressable>

              <View className="mt-3 flex-row items-center">
                <Pressable
                  onPress={() =>
                    router.push(`/listings/edit/${listing._id}` as any)
                  }
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: "#EAB308" }}
                  >
                    Edit
                  </Text>
                </Pressable>

                <Text
                  className="mx-2 text-sm"
                  style={{ color: colors.muted }}
                >
                  |
                </Text>

                <Pressable
                  disabled={deletingId === listing._id}
                  onPress={() =>
                    showConfirm(
                      {
                        title: "Delete ad",
                        message: "Are you sure you want to delete this advert?",
                        confirmText: "Delete",
                        cancelText: "Cancel",
                        confirmVariant: "danger",
                      },
                      () => {
                        handleDelete(listing._id);
                      }
                    )
                  }
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color:
                        deletingId === listing._id ? "#FCA5A5" : "#DC2626",
                    }}
                  >
                    {deletingId === listing._id ? "Deleting..." : "Delete"}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}