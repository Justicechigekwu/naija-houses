import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react-native";

import { useAuthStore } from "@/store/auth-store";
import { useUI } from "@/hooks/useUI";
import {
  deleteListingById,
  getListingBySlug,
} from "@/features/listings/api";
import FavoriteButton from "@/components/favorites/FavoritesButton";
import { startChat, sendChatMessage } from "@/features/chats/api";
import useSocketListingUpdates from "@/hooks/useSocketListingUpdates";
import OwnerListingActions from "@/components/listing-details/OwnerListingAction";
import BuyerListingActions from "@/components/listing-details/BuyerListingAction";
import ReviewsSummaryCard from "@/components/listing-details/ReviewsSummaryCard";
import SellerProfileCard from "@/components/listing-details/SellerProfileCard";
import RelatedListingsSection from "@/components/listing-details/RelatedListingsSection";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import type { Listing } from "@/types/listing";
import { useBrowsingLocation } from "@/context/BrowsingLocationContext";
import { getOwnerAverageRating } from "@/features/reviews/api";
import { useTheme } from "@/hooks/useTheme";

type DynamicField = {
  key: string;
  label: string;
  type: string;
  options?: string[];
};

type SubcategoryConfig = {
  fields: DynamicField[];
};

type ListingDetailsState = Listing & {
  listingType?: "Sale" | "Rent" | "Shortlet";
  owner?: {
    _id: string;
    slug?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    location?: string;
  };
};

export default function ListingDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { showToast } = useUI();
  const { setLastViewedListingType } = useBrowsingLocation();
  const { colors } = useTheme();

  const [listing, setListing] = useState<ListingDetailsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [ownerRating, setOwnerRating] = useState(0);
  const [ownerReviewsCount, setOwnerReviewsCount] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const images = listing?.images ?? [];

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await getListingBySlug(String(slug));
        setListing(res.listing as ListingDetailsState);
      } catch {
        showToast("Failed to load listing", "error");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchListing();
    } else {
      setLoading(false);
    }
  }, [slug, showToast]);

  useEffect(() => {
    const run = async () => {
      if (!listing?.owner?._id) return;

      try {
        const res = await getOwnerAverageRating(listing.owner._id);
        setOwnerRating(res.averageRating || 0);
        setOwnerReviewsCount(res.totalReviews || 0);
      } catch {
        setOwnerRating(0);
        setOwnerReviewsCount(0);
      }
    };

    run();
  }, [listing?.owner?._id]);

  useEffect(() => {
    if (!listing?.listingType) return;
    setLastViewedListingType(listing.listingType);
  }, [listing?.listingType, setLastViewedListingType]);

  useSocketListingUpdates({
    onListingUpdated: (payload) => {
      setListing((prev) => {
        if (!prev) return prev;

        const isSameListing =
          payload.listingId === prev._id ||
          (payload.slug && payload.slug === prev.slug);

        if (!isSameListing) return prev;

        return {
          ...prev,
          slug: payload.slug ?? prev.slug,
          title: payload.title ?? prev.title,
          publishStatus: payload.publishStatus ?? prev.publishStatus,
          publishedAt: payload.publishedAt ?? prev.publishedAt,
          expiresAt: payload.expiresAt ?? prev.expiresAt,
          expiredAt: payload.expiredAt ?? prev.expiredAt,
          city: payload.city ?? prev.city,
          state: payload.state ?? prev.state,
          price: payload.price ?? prev.price,
          category: payload.category ?? prev.category,
          subcategory: payload.subcategory ?? prev.subcategory,
          postedBy: payload.postedBy ?? prev.postedBy,
          attributes: payload.attributes ?? prev.attributes,
          images: payload.images ?? prev.images,
          listingType: payload.listingType ?? prev.listingType,
        };
      });
    },
  });

  const handleDelete = useCallback(async () => {
    if (!listing?._id) return;

    try {
      setDeleting(true);
      await deleteListingById(listing._id);
      showToast("Listing deleted successfully", "success");
      router.replace("/profile" as any);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to delete listing",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  }, [listing?._id, router, showToast]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!user) {
        showToast("Please log in first", "error");
        router.push({
          pathname: "/login",
          params: {
            redirect: listing?.slug ? `/listings/${listing.slug}` : "/",
          },
        } as any);
        return;
      }

      if (!listing?._id || !listing?.owner?._id || !text.trim()) return;

      try {
        setSending(true);

        const chat = await startChat({
          listingId: listing._id,
          ownerId: listing.owner._id,
        });

        await sendChatMessage({
          chatId: chat._id,
          text,
        });

        showToast("Message sent successfully", "success");
      } catch (error: any) {
        showToast(
          error?.response?.data?.message || "Failed to send message",
          "error"
        );
      } finally {
        setSending(false);
      }
    },
    [listing?._id, listing?.owner?._id, listing?.slug, router, showToast, user]
  );

  const categoryConfig = listing?.category
    ? CATEGORY_TREE[listing.category as keyof typeof CATEGORY_TREE]
    : undefined;

  const subcategoryConfig = categoryConfig?.subcategories?.[
    listing?.subcategory as keyof typeof categoryConfig.subcategories
  ] as SubcategoryConfig | undefined;

  const dynamicFields: DynamicField[] = subcategoryConfig?.fields ?? [];

  const formAttributeValue = (
    value: string | number | boolean | string[] | undefined | null
  ) => {
    if (value === undefined || value === null || value === "") return "_";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "yes" : "no";
    return String(value);
  };

  const currentUserId = user?.id;
  const isOwner = currentUserId === listing?.owner?._id;

  const goToPreviousImage = useCallback(() => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNextImage = useCallback(() => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx, dy } = gestureState;
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);

          if (absY > absX && dy > 80) {
            setIsImageModalOpen(false);
            return;
          }

          if (absX > absY && absX > 50) {
            if (dx < 0) {
              goToNextImage();
            } else {
              goToPreviousImage();
            }
          }
        },
      }),
    [goToNextImage, goToPreviousImage]
  );

  const detailPairs = useMemo(() => {
    const base = [
      { label: "State", value: listing?.state || "_" },
      { label: "City", value: listing?.city || "_" },
    ];

    const dynamic = dynamicFields.map((field) => ({
      label: field.label,
      value: formAttributeValue(listing?.attributes?.[field.key]),
    }));

    return [...base, ...dynamic];
  }, [dynamicFields, listing]);

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
            Listing not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <>
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            className="overflow-hidden rounded-[24px] shadow-sm"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            {!!images.length ? (
              <View className="p-4">
                <Pressable
                  onPress={() => {
                    setCurrentImageIndex(0);
                    setIsImageModalOpen(true);
                  }}
                  className="overflow-hidden rounded-[18px]"
                >
                  <Image
                    source={{ uri: images[0]?.url }}
                    style={{ width: "100%", height: 290 }}
                    contentFit="cover"
                  />
                </Pressable>

                {images.length > 1 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-3"
                  >
                    <View className="flex-row gap-3">
                      {images.slice(1).map((img, index) => (
                        <Pressable
                          key={img.public_id ?? img.url}
                          onPress={() => {
                            setCurrentImageIndex(index + 1);
                            setIsImageModalOpen(true);
                          }}
                          className="overflow-hidden rounded-[14px]"
                        >
                          <Image
                            source={{ uri: img.url }}
                            style={{ width: 96, height: 84 }}
                            contentFit="cover"
                          />
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                ) : null}
              </View>
            ) : null}

            <View className="px-4 pb-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: "500",
                      lineHeight: 32,
                      color: colors.text,
                    }}
                  >
                    {listing.title}
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 22,
                      fontWeight: "500",
                      color: colors.success,
                    }}
                  >
                    ₦{Number(listing.price ?? 0).toLocaleString()}
                  </Text>
                </View>

                {!isOwner ? (
                  <View className="pt-1">
                    <FavoriteButton listingId={listing._id} showText />
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  marginTop: 24,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: colors.border,
                  paddingVertical: 20,
                }}
              >
                <View className="flex-row flex-wrap">
                  {detailPairs.map((item, index) => (
                    <View key={`${item.label}-${index}`} className="mb-5 w-1/2 pr-3">
                      <Text
                        style={{
                          fontSize: 10,
                          textTransform: "uppercase",
                          color: colors.muted,
                        }}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={{
                          marginTop: 4,
                          fontSize: 16,
                          color: colors.text,
                        }}
                      >
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="pt-5">
                <Text
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    color: colors.muted,
                  }}
                >
                  Description
                </Text>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.text,
                  }}
                >
                  {listing.description || "_"}
                </Text>
              </View>

              {isOwner ? (
                <OwnerListingActions
                  listingId={listing._id}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
              ) : (
                <BuyerListingActions
                  onSendMessage={handleSendMessage}
                  sending={sending}
                />
              )}

              {!isOwner && listing.owner ? (
                <>
                  <SellerProfileCard
                    owner={listing.owner}
                    averageRating={ownerRating}
                    totalReviews={ownerReviewsCount}
                    listingSlug={listing.slug}
                  />

                  {listing.owner._id ? (
                    <ReviewsSummaryCard
                      ownerId={listing.owner._id}
                      ownerSlug={listing.owner.slug}
                    />
                  ) : null}
                </>
              ) : null}
            </View>
          </View>

          <RelatedListingsSection listingId={listing._id} />
        </ScrollView>

        <Modal
          visible={isImageModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsImageModalOpen(false)}
        >
          <View className="flex-1 bg-black/90">
            <Pressable
              onPress={() => setIsImageModalOpen(false)}
              className="absolute right-4 top-12 z-30 rounded-full bg-black/35 p-2"
            >
              <X size={24} color="#FFFFFF" />
            </Pressable>

            {images.length > 1 ? (
              <>
                <Pressable
                  onPress={goToPreviousImage}
                  className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/35 p-3"
                >
                  <ChevronLeft size={28} color="#FFFFFF" />
                </Pressable>

                <Pressable
                  onPress={goToNextImage}
                  className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/35 p-3"
                >
                  <ChevronRight size={28} color="#FFFFFF" />
                </Pressable>
              </>
            ) : null}

            <View
              className="flex-1 items-center justify-center px-4"
              {...panResponder.panHandlers}
            >
              <Pressable
                onPress={() => {}}
                className="w-full items-center justify-center"
              >
                <Image
                  source={{ uri: images[currentImageIndex]?.url }}
                  style={{ width: "100%", height: "82%" }}
                  contentFit="contain"
                />
              </Pressable>
            </View>
          </View>
        </Modal>
      </>
    </SafeAreaView>
  );
}