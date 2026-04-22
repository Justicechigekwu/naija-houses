// import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import { Image } from "expo-image";
// import { Pressable, Text, View } from "react-native";
// import AppScreen from "@/components/ui/AppScreen";
// import LoadingScreen from "@/components/ui/LoadingScreen";
// import { useTheme } from "@/hooks/useTheme";
// import { useUI } from "@/hooks/useUI";
// import { deleteListingById } from "@/features/listings/listings-api";
// import { getExpiredListings, renewExpiredListing } from "@/features/listings/publish-api";
// import type { Listing } from "@/types/listing";

// export default function ExpiredScreen() {
//   const router = useRouter();
//   const { colors } = useTheme();
//   const { showToast, showConfirm } = useUI();
//   const [items, setItems] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingId, setLoadingId] = useState<string | null>(null);

//   const fetchExpired = async () => {
//     try {
//       setLoading(true);
//       const res = await getExpiredListings();
//       setItems(res || []);
//     } catch (error: any) {
//       showToast(error?.response?.data?.message || "Failed to load expired listings", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpired();
//   }, []);

//   const handleRenew = async (listingId: string) => {
//     try {
//       setLoadingId(listingId);
//       const res = await renewExpiredListing(listingId);
//       const paymentCode = res?.payment?.paymentCode;
//       showToast("Renewal started successfully", "success");

//       router.push(
//         `/listing-actions/${listingId}/payment-details${paymentCode ? `?code=${encodeURIComponent(paymentCode)}` : ""}` as any
//       );
//     } catch (error: any) {
//       showToast(error?.response?.data?.message || "Failed to start renewal", "error");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDelete = (listingId: string) => {
//     showConfirm(
//       {
//         title: "Delete expired listing",
//         message: "Delete this expired listing permanently?",
//         confirmText: "Delete",
//         cancelText: "Cancel",
//         confirmVariant: "danger",
//       },
//       async () => {
//         try {
//           setLoadingId(listingId);
//           await deleteListingById(listingId);
//           showToast("Listing deleted successfully", "success");
//           fetchExpired();
//         } catch (error: any) {
//           showToast(error?.response?.data?.message || "Failed to delete listing", "error");
//         } finally {
//           setLoadingId(null);
//         }
//       }
//     );
//   };

//   if (loading) return <LoadingScreen />;

//   return (
//     <AppScreen scroll padded>
//       <Text className="mb-5 text-2xl font-semibold" style={{ color: colors.text }}>
//         Expired Listings
//       </Text>

//       {items.length === 0 ? (
//         <View
//           className="rounded-3xl border p-6"
//           style={{ borderColor: colors.border, backgroundColor: colors.surface }}
//         >
//           <Text className="text-base font-medium" style={{ color: colors.text }}>
//             No expired listings right now.
//           </Text>
//           <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
//             Your expired listings will appear here.
//           </Text>
//         </View>
//       ) : (
//         items.map((listing) => {
//           const imageUrl = listing.images?.[0]?.url || "";
//           const expiredText = listing.expiredAt || listing.expiresAt;
//           const isLoading = loadingId === listing._id;

//           return (
//             <View
//               key={listing._id}
//               className="mb-4 rounded-3xl border p-4"
//               style={{ borderColor: colors.border, backgroundColor: colors.surface }}
//             >
//               <View className="flex-row gap-4">
//                 <View
//                   className="h-24 w-24 overflow-hidden rounded-2xl"
//                   style={{ backgroundColor: colors.background }}
//                 >
//                   {imageUrl ? (
//                     <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
//                   ) : null}
//                 </View>

//                 <View className="flex-1">
//                   <View className="flex-row items-start justify-between gap-3">
//                     <Text className="flex-1 text-base font-semibold" style={{ color: colors.text }}>
//                       {listing.title?.trim() || "Untitled listing"}
//                     </Text>

//                     <View
//                       className="rounded-full px-3 py-1"
//                       style={{ backgroundColor: colors.danger }}
//                     >
//                       <Text className="text-xs font-medium text-white">Expired</Text>
//                     </View>
//                   </View>

//                   <Text className="mt-2 text-base font-semibold" style={{ color: colors.success }}>
//                     {typeof listing.price === "number"
//                       ? `₦${listing.price.toLocaleString()}`
//                       : "No price yet"}
//                   </Text>

//                   <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
//                     {[listing.city, listing.state].filter(Boolean).join(", ") || "No location yet"}
//                   </Text>

//                   <Text className="mt-2 text-xs" style={{ color: colors.muted }}>
//                     Expired on: {expiredText ? new Date(expiredText).toLocaleString() : "Unknown"}
//                   </Text>

//                   <View className="mt-4 flex-row gap-3">
//                     <Pressable
//                       onPress={() => handleRenew(listing._id)}
//                       className="flex-1 items-center rounded-2xl px-4 py-3"
//                       style={{ backgroundColor: colors.brand }}
//                     >
//                       <Text className="text-sm font-semibold text-white">
//                         {isLoading ? "Working..." : "Renew"}
//                       </Text>
//                     </Pressable>

//                     <Pressable
//                       onPress={() => handleDelete(listing._id)}
//                       className="flex-1 items-center rounded-2xl px-4 py-3"
//                       style={{ backgroundColor: colors.danger }}
//                     >
//                       <Text className="text-sm font-semibold text-white">
//                         {isLoading ? "Deleting..." : "Delete"}
//                       </Text>
//                     </Pressable>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           );
//         })
//       )}
//     </AppScreen>
//   );
// }







import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import AppScreen from "@/components/ui/AppScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import { deleteListingById } from "@/features/listings/listings-api";
import {
  getExpiredListings,
  renewExpiredListing,
} from "@/features/listings/publish-api";
import useSocketListingUpdates from "@/hooks/useSocketListingUpdates";
import type { Listing } from "@/types/listing";

export default function ExpiredScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast, showConfirm } = useUI();

  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchExpired = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getExpiredListings();
      setItems(res || []);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to load expired listings",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchExpired();
  }, [fetchExpired]);

  useSocketListingUpdates({
    onListingUpdated: (payload) => {
      if (!payload?.listingId) return;

      const stillExpired = payload.publishStatus === "EXPIRED";

      setItems((prev) => {
        const exists = prev.some((item) => item._id === payload.listingId);

        if (!stillExpired) {
          return prev.filter((item) => item._id !== payload.listingId);
        }

        if (!exists) {
          return prev;
        }

        return prev.map((item) =>
          item._id === payload.listingId
            ? {
                ...item,
                title: payload.title ?? item.title,
                slug: payload.slug ?? item.slug,
                publishStatus: payload.publishStatus ?? item.publishStatus,
                updatedAt: payload.updatedAt || item.updatedAt,
                publishedAt: payload.publishedAt ?? item.publishedAt,
                expiresAt: payload.expiresAt ?? item.expiresAt,
                expiredAt: payload.expiredAt ?? item.expiredAt,
                city: payload.city ?? item.city,
                state: payload.state ?? item.state,
                price:
                  typeof payload.price === "number" ? payload.price : item.price,
                images: payload.images ?? item.images,
                listingType: payload.listingType ?? item.listingType,
                postedBy: payload.postedBy ?? item.postedBy,
                category: payload.category ?? item.category,
                subcategory: payload.subcategory ?? item.subcategory,
                attributes: payload.attributes ?? item.attributes,
              }
            : item
        );
      });
    },
  });

  const handleRenew = async (listingId: string) => {
    try {
      setLoadingId(listingId);
      const res = await renewExpiredListing(listingId);
      const paymentCode = res?.payment?.paymentCode;

      showToast("Renewal started successfully", "success");

      router.push(
        `/listing-actions/${listingId}/payment-details${
          paymentCode ? `?code=${encodeURIComponent(paymentCode)}` : ""
        }` as any
      );
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Failed to start renewal", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = (listingId: string) => {
    showConfirm(
      {
        title: "Delete expired listing",
        message: "Delete this expired listing permanently?",
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          setLoadingId(listingId);
          await deleteListingById(listingId);
          showToast("Listing deleted successfully", "success");
          setItems((prev) => prev.filter((item) => item._id !== listingId));
        } catch (error: any) {
          showToast(error?.response?.data?.message || "Failed to delete listing", "error");
        } finally {
          setLoadingId(null);
        }
      }
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <AppScreen scroll padded>
      <Text className="mb-5 text-2xl font-semibold" style={{ color: colors.text }}>
        Expired Listings
      </Text>

      {items.length === 0 ? (
        <View
          className="rounded-3xl border p-6"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <Text className="text-base font-medium" style={{ color: colors.text }}>
            No expired listings right now.
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
            Your expired listings will appear here.
          </Text>
        </View>
      ) : (
        items.map((listing) => {
          const imageUrl = listing.images?.[0]?.url || "";
          const expiredText = listing.expiredAt || listing.expiresAt;
          const isLoading = loadingId === listing._id;

          return (
            <View
              key={listing._id}
              className="mb-4 rounded-3xl border p-4"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <View className="flex-row gap-4">
                <View
                  className="h-24 w-24 overflow-hidden rounded-2xl"
                  style={{ backgroundColor: colors.background }}
                >
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>

                <View className="flex-1">
                  <View className="flex-row items-start justify-between gap-3">
                    <Text className="flex-1 text-base font-semibold" style={{ color: colors.text }}>
                      {listing.title?.trim() || "Untitled listing"}
                    </Text>

                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.danger }}
                    >
                      <Text className="text-xs font-medium text-white">Expired</Text>
                    </View>
                  </View>

                  <Text className="mt-2 text-base font-semibold" style={{ color: colors.success }}>
                    {typeof listing.price === "number"
                      ? `₦${listing.price.toLocaleString()}`
                      : "No price yet"}
                  </Text>

                  <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
                    {[listing.city, listing.state].filter(Boolean).join(", ") ||
                      "No location yet"}
                  </Text>

                  <Text className="mt-2 text-xs" style={{ color: colors.muted }}>
                    Expired on:{" "}
                    {expiredText ? new Date(expiredText).toLocaleString() : "Unknown"}
                  </Text>

                  <View className="mt-4 flex-row gap-3">
                    <Pressable
                      onPress={() => handleRenew(listing._id)}
                      className="flex-1 items-center rounded-2xl px-4 py-3"
                      style={{ backgroundColor: colors.brand }}
                    >
                      <Text className="text-sm font-semibold text-white">
                        {isLoading ? "Working..." : "Renew"}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleDelete(listing._id)}
                      className="flex-1 items-center rounded-2xl px-4 py-3"
                      style={{ backgroundColor: colors.danger }}
                    >
                      <Text className="text-sm font-semibold text-white">
                        {isLoading ? "Deleting..." : "Delete"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          );
        })
      )}
    </AppScreen>
  );
}