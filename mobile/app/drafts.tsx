// import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import { Image } from "expo-image";
// import { Pressable, Text, View } from "react-native";
// import AppScreen from "@/components/ui/AppScreen";
// import LoadingScreen from "@/components/ui/LoadingScreen";
// import { useTheme } from "@/hooks/useTheme";
// import { useUI } from "@/hooks/useUI";
// import { deleteDraft, getDraftListings } from "@/features/listings/publish-api";
// import { choosePublishPlan } from "@/features/listings/publish-api";
// import type { Listing } from "@/types/listing";
// import { hexToRgba } from "@/libs/theme-utils";

// export default function DraftsScreen() {
//   const router = useRouter();
//   const { colors } = useTheme();
//   const { showToast, showConfirm } = useUI();
//   const [drafts, setDrafts] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [publishingId, setPublishingId] = useState<string | null>(null);

//   const fetchDrafts = async () => {
//     try {
//       setLoading(true);
//       const res = await getDraftListings();
//       setDrafts(res || []);
//     } catch (error: any) {
//       showToast(error?.response?.data?.message || "Failed to load drafts", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDrafts();
//   }, []);

//   const handlePublish = async (draft: Listing) => {
//     try {
//       setPublishingId(draft._id);
//       const res = await choosePublishPlan(draft._id, "PAID_30_DAYS");
//       const code = res?.payment?.paymentCode || "";
//       router.push({
//         pathname: "/listing-actions/[id]/payment-details",
//         params: {
//           id: draft._id,
//           ...(code ? { code } : {}),
//         },
//       } as any);
//     } catch (error: any) {
//       showToast(error?.response?.data?.message || "Failed to continue to payment", "error");
//     } finally {
//       setPublishingId(null);
//     }
//   };

//   const handleDelete = (id: string) => {
//     showConfirm(
//       {
//         title: "Clear this draft?",
//         message: "This will delete it permanently.",
//         confirmText: "Clear",
//         cancelText: "Cancel",
//         confirmVariant: "danger",
//       },
//       async () => {
//         try {
//           setDeletingId(id);
//           await deleteDraft(id);
//           showToast("Draft deleted", "success");
//           fetchDrafts();
//         } catch (error: any) {
//           showToast(error?.response?.data?.message || "Failed to delete draft", "error");
//         } finally {
//           setDeletingId(null);
//         }
//       }
//     );
//   };

//   if (loading) return <LoadingScreen />;

//   return (
//     <AppScreen scroll padded>
//       <View
//         className="mb-6 rounded-[28px] border p-6"
//         style={{ borderColor: colors.border, backgroundColor: colors.surface }}
//       >
//         <Text className="text-2xl font-semibold" style={{ color: colors.text }}>
//           Drafts
//         </Text>
//         <Text className="mt-2 text-sm leading-6" style={{ color: colors.muted }}>
//           Publish your pending drafts to sell it instantly.
//         </Text>

//         <View
//           className="mt-4 self-start rounded-2xl px-4 py-3"
//           style={{ backgroundColor: hexToRgba(colors.brand, 0.08) }}
//         >
//           <Text className="text-xs uppercase" style={{ color: colors.muted }}>
//             Total drafts
//           </Text>
//           <Text className="mt-1 text-2xl font-semibold" style={{ color: colors.brand }}>
//             {drafts.length}
//           </Text>
//         </View>
//       </View>

//       {drafts.length === 0 ? (
//         <View
//           className="rounded-3xl border p-6"
//           style={{ borderColor: colors.border, backgroundColor: colors.surface }}
//         >
//           <Text className="text-base font-medium" style={{ color: colors.text }}>
//             No drafts right now.
//           </Text>
//           <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
//             Your unpublished adverts will appear here.
//           </Text>
//         </View>
//       ) : (
//         drafts.map((item) => {
//           const image = item.images?.[0]?.url;

//           return (
//             <View
//               key={item._id}
//               className="mb-4 rounded-3xl border p-4"
//               style={{ borderColor: colors.border, backgroundColor: colors.surface }}
//             >
//               <View className="flex-row gap-4">
//                 <View
//                   className="h-24 w-24 overflow-hidden rounded-2xl"
//                   style={{ backgroundColor: colors.background }}
//                 >
//                   {image ? (
//                     <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
//                   ) : null}
//                 </View>

//                 <View className="flex-1">
//                   <Text className="text-base font-semibold" style={{ color: colors.text }}>
//                     {item.title?.trim() || "Untitled draft"}
//                   </Text>
//                   <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
//                     {item.category || "PROPERTY"} • Last updated{" "}
//                     {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ""}
//                   </Text>

//                   <View className="mt-4 flex-row gap-3">
//                     <Pressable
//                       onPress={() => handlePublish(item)}
//                       className="flex-1 items-center rounded-2xl px-4 py-3"
//                       style={{ backgroundColor: colors.success }}
//                     >
//                       <Text className="text-sm font-semibold text-white">
//                         {publishingId === item._id ? "Processing..." : "Publish"}
//                       </Text>
//                     </Pressable>

//                     <Pressable
//                       onPress={() => handleDelete(item._id)}
//                       className="flex-1 items-center rounded-2xl px-4 py-3"
//                       style={{ backgroundColor: colors.danger }}
//                     >
//                       <Text className="text-sm font-semibold text-white">
//                         {deletingId === item._id ? "Deleting..." : "Clear"}
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
import {
  choosePublishPlan,
  deleteDraft,
  getDraftListings,
} from "@/features/listings/publish-api";
import useSocketListingUpdates from "@/hooks/useSocketListingUpdates";
import type { Listing } from "@/types/listing";
import { hexToRgba } from "@/libs/theme-utils";

export default function DraftsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast, showConfirm } = useUI();

  const [drafts, setDrafts] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchDrafts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDraftListings();
      setDrafts(res || []);
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Failed to load drafts", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  useSocketListingUpdates({
    onListingUpdated: (payload) => {
      if (!payload?.listingId) return;

      const stillDraft = payload.publishStatus === "DRAFT";

      setDrafts((prev) => {
        const exists = prev.some((item) => item._id === payload.listingId);

        if (!stillDraft) {
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

  const handlePublish = async (draft: Listing) => {
    try {
      setPublishingId(draft._id);
      const res = await choosePublishPlan(draft._id, "PAID_30_DAYS");
      const code = res?.payment?.paymentCode || "";
      router.push({
        pathname: "/listing-actions/[id]/payment-details",
        params: {
          id: draft._id,
          ...(code ? { code } : {}),
        },
      } as any);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to continue to payment",
        "error"
      );
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = (id: string) => {
    showConfirm(
      {
        title: "Clear this draft?",
        message: "This will delete it permanently.",
        confirmText: "Clear",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          setDeletingId(id);
          await deleteDraft(id);
          showToast("Draft deleted", "success");
          setDrafts((prev) => prev.filter((item) => item._id !== id));
        } catch (error: any) {
          showToast(error?.response?.data?.message || "Failed to delete draft", "error");
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <AppScreen scroll padded>
      <View
        className="mb-6 rounded-[28px] border p-6"
        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
      >
        <Text className="text-2xl font-semibold" style={{ color: colors.text }}>
          Drafts
        </Text>
        <Text className="mt-2 text-sm leading-6" style={{ color: colors.muted }}>
          Publish your pending drafts to sell it instantly.
        </Text>

        <View
          className="mt-4 self-start rounded-2xl px-4 py-3"
          style={{ backgroundColor: hexToRgba(colors.brand, 0.08) }}
        >
          <Text className="text-xs uppercase" style={{ color: colors.muted }}>
            Total drafts
          </Text>
          <Text className="mt-1 text-2xl font-semibold" style={{ color: colors.brand }}>
            {drafts.length}
          </Text>
        </View>
      </View>

      {drafts.length === 0 ? (
        <View
          className="rounded-3xl border p-6"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <Text className="text-base font-medium" style={{ color: colors.text }}>
            No drafts right now.
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
            Your unpublished adverts will appear here.
          </Text>
        </View>
      ) : (
        drafts.map((item) => {
          const image = item.images?.[0]?.url;

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
                    <Image
                      source={{ uri: image }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>

                <View className="flex-1">
                  <Text className="text-base font-semibold" style={{ color: colors.text }}>
                    {item.title?.trim() || "Untitled draft"}
                  </Text>
                  <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
                    {item.category || "PROPERTY"} • Last updated{" "}
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ""}
                  </Text>

                  <View className="mt-4 flex-row gap-3">
                    <Pressable
                      onPress={() => handlePublish(item)}
                      className="flex-1 items-center rounded-2xl px-4 py-3"
                      style={{ backgroundColor: colors.success }}
                    >
                      <Text className="text-sm font-semibold text-white">
                        {publishingId === item._id ? "Processing..." : "Publish"}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleDelete(item._id)}
                      className="flex-1 items-center rounded-2xl px-4 py-3"
                      style={{ backgroundColor: colors.danger }}
                    >
                      <Text className="text-sm font-semibold text-white">
                        {deletingId === item._id ? "Deleting..." : "Clear"}
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



