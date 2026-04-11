"use client";

import { useEffect, useState, useRef } from "react";
import useSocketListingUpdates, {
  type ListingUpdatePayload,
} from "@/hooks/useSocketListingUpdates";
import type { Listing } from "@/types/listing";
import { useRouter, useParams } from "next/navigation";
import api from "@/libs/api";
import { ArrowLeft } from "lucide-react";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import RelatedListing from "@/components/RelatedListing";
import deleteListing from "@/controllers/Delete";
import { useAuth } from "@/context/AuthContext";
import ReviewsList from "./reviews/ReviewList";
import FavoriteButton from "@/components/FavoriteButton";
import { useUI } from "@/hooks/useUi";
import { useBrowsingLocation } from "@/context/BrowsingLocationContext";
import PageReadyLoader from "@/components/pages/PageReadyLoader";
import { trackAnalyticsEvent } from "@/libs/analytics";

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
  };
};

type ListingResponse = {
  listing: ListingDetailsState;
};

const quickMessage = [
  "Is this still available?",
  "What's the last price?",
  "Can I make a half payment?",
];

export default function ListingDetails() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast, showConfirm } = useUI();
  const { setLastViewedListingType } = useBrowsingLocation();

  const [listing, setListing] = useState<ListingDetailsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [maxThumbs, setMaxThumbs] = useState(6);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const hasHandledExpiryRef = useRef(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await api.get<ListingResponse>(`/listings/slug/${slug}`);
        setListing(res.data.listing);
      } catch (err) {
        console.error("Error fetching listing:", err);
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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.velora.ng";

  const jsonLd = listing
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: listing.title,
        description: listing.description,
        image: listing.images?.map((img) => img.url) || [],
        url: `${siteUrl}/listings/${listing.slug}`,
        category: [listing.category, listing.subcategory]
          .filter(Boolean)
          .join(" / "),
        offers: {
          "@type": "Offer",
          priceCurrency: "NGN",
          price: listing.price || 0,
          availability:
            listing.publishStatus === "PUBLISHED"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
        seller: listing.owner
          ? {
              "@type": "Person",
              name: `${listing.owner.firstName || ""} ${listing.owner.lastName || ""}`.trim(),
            }
          : undefined,
      }
    : null;

  useEffect(() => {
    if (listing?.listingType) {
      setLastViewedListingType(listing.listingType);
    }
  }, [listing?.listingType, setLastViewedListingType]);

  useEffect(() => {
    if (!listing?._id) return;

    trackAnalyticsEvent({
      eventType: "LISTING_VIEW",
      listingId: listing._id,
      category: listing.category,
      subcategory: listing.subcategory,
    });
  }, [listing?._id, listing?.category, listing?.subcategory]);

  useEffect(() => {
    const handleResize = () => {
      setMaxThumbs(window.innerWidth < 640 ? 3 : 6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sendMessage = async (text: string) => {
    if (!user) {
      setStatus("Please log in first");
      return;
    }

    if (!text.trim() || !listing?.owner?._id) return;

    try {
      setSending(true);
      setStatus(null);

      const chatRes = await api.post("/chats/start", {
        listingId: listing._id,
        ownerId: listing.owner._id,
      });

      const chatId = chatRes.data._id;

      await api.post("/chats/message", {
        chatId,
        text,
      });

      setStatus("Message sent");
      setNewMessage("");
      showToast("Message sent successfully", "success");
    } catch (error) {
      console.error("Failed to send message", error);
      setStatus("Failed to send");
      showToast("Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = () => {
    if (!listing) return;

    showConfirm(
      {
        title: "Delete ad",
        message: "Are you sure you want to delete this advert?",
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          await deleteListing(listing._id);
          showToast("Property deleted successfully", "success");
          router.push("/profile");
        } catch (err: unknown) {
          if (err instanceof Error) {
            showToast(err.message || "Something went wrong", "error");
          } else {
            showToast("Something went wrong", "error");
          }
        }
      }
    );
  };

  useSocketListingUpdates({
    onListingUpdated: (payload: ListingUpdatePayload) => {
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

  useEffect(() => {
    if (listing?.publishStatus !== "EXPIRED") return;
    if (hasHandledExpiryRef.current) return;

    hasHandledExpiryRef.current = true;
    showToast("This listing has expired", "error");
    router.push("/");
  }, [listing?.publishStatus, router, showToast]);

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

  const currentUserId = user?.id || user?._id;
  const isOwner = currentUserId === listing?.owner?._id;
  const images = listing?.images ?? [];

  const goToPreviousImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLImageElement>) => {
    if (touchStartX.current === null || touchStartY.current === null || !images.length) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absY > absX && diffY < -80) {
      setIsModalOpen(false);
    } else if (absX > absY && absX > 50) {
      if (diffX > 0) {
        goToNextImage();
      } else {
        goToPreviousImage();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <PageReadyLoader ready={!loading}>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}

      {listing ? (
        <div className="p-4 md:p-6 max-w-5xl mx-auto bg-[#F5F5F5]  space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-20 text-white text-3xl"
              >
                ✕
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousImage();
                }}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 text-white text-4xl"
              >
                ‹
              </button>

              <img
                src={images[currentImageIndex]?.url}
                alt={`Image ${currentImageIndex + 1}`}
                className="relative z-10 max-w-full max-h-screen"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 text-white text-4xl"
              >
                ›
              </button>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            {images[0] && (
              <div className="flex justify-center mb-4">
                <img
                  src={images[0].url}
                  alt={listing.title || "Listing image"}
                  className="w-full md:w-[80%] max-h-[400px] object-cover rounded cursor-pointer shadow-md"
                  onClick={() => {
                    setCurrentImageIndex(0);
                    setIsModalOpen(true);
                  }}
                />
              </div>
            )}

            {images.length > 1 && (
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 w-full gap-3 md:w-[80%]">
                  {images.slice(1, maxThumbs).map((img, index) => (
                    <img
                      key={img.public_id ?? img.url}
                      src={img.url}
                      alt={`Thumb ${index + 1}`}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 aspect-ratio"
                      onClick={() => {
                        setCurrentImageIndex(index + 1);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}

                  {images.length > maxThumbs && (
                    <div
                      className="h-24 bg-gray-700 text-white flex items-center justify-center rounded cursor-pointer aspect-ratio"
                      onClick={() => {
                        setCurrentImageIndex(maxThumbs);
                        setIsModalOpen(true);
                      }}
                    >
                      +{images.length - (maxThumbs - 1)}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-lg p-4 md:p-6">
              <div className="flex justify-between">
                <div className="mb-6 divider">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {listing.title}
                  </h1>
                  <p className="text-green-600 font-bold text-lg">
                    ₦{Number(listing.price ?? 0).toLocaleString()}
                  </p>
                </div>

                <div>
                  {!isOwner && (
                    <FavoriteButton
                      listingId={listing._id}
                      showText
                      className="shrink-10"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pb-6 border-b border-gray-200 border-t">
                <div className="space-y-3">
                  <p className="text-base">
                    <span className="block text-[10px] text-gray-500 uppercase">
                      state
                    </span>{" "}
                    {listing.state}
                  </p>
                </div>

                <p className="text-base">
                  <span className="block text-[10px] text-gray-500 uppercase">
                    city
                  </span>{" "}
                  {listing.city}
                </p>
              </div>

              <div className="mt-6 border-6 pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                  {dynamicFields.map((field) => (
                    <div key={field.key} className="text-base">
                      <span className="block text-[10px] text-gray-500 uppercase">
                        {field.label}
                      </span>
                      <span>
                        {formAttributeValue(listing.attributes?.[field.key])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t">
                <p className="text-base border-b">
                  <span className="block text-[10px] text-gray-500 uppercase">
                    Description
                  </span>
                  {listing.description}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row w-full gap-6 items-start">
                <div className="w-full lg:w-1/2">
                  {isOwner && (
                    <div className="flex flex-col base:flex-row gap-3 mt-4">
                      <button
                        onClick={() => router.push(`/listings/edit/${listing._id}`)}
                        className="bg-yellow-500 base:w-auto text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="bg-red-600 base:w-auto text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {!isOwner && (
                    <div className="w-full">
                      <div className="bg-white shadow rounded-lg p-4 md:p-6">
                        <p className="font-semibold mb-4 text-lg">
                          Message Owner
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {quickMessage.map((msg) => (
                            <button
                              key={msg}
                              onClick={() => sendMessage(msg)}
                              disabled={sending}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 text-sm"
                            >
                              {msg}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border rounded px-3 py-2"
                          />
                          <button
                            onClick={() => sendMessage(newMessage)}
                            disabled={sending}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            {sending ? "Sending..." : "Send"}
                          </button>
                        </div>

                        {status && (
                          <p className="mt-2 text-sm text-gray-600">
                            {status}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="pt-6 w-full lg:w-1/2"
                  onClick={() => {
                    if (listing.owner?.slug) {
                      router.push(
                        `/profile/${listing.owner.slug}?listingId=${listing._id}&listingSlug=${listing.slug}`
                      );
                    }
                  }}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                    <img
                      src={listing.owner?.avatar || "/default-avatar.png"}
                      alt={`${listing.owner?.firstName || ""} ${listing.owner?.lastName || ""}`.trim()}
                      className="w-8 h-8 rounded-full object-cover border"
                    />

                    <span className="text-sm font-medium text-gray-800">
                      {listing.owner?.firstName} {listing.owner?.lastName}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold mb-4">Reviews</h2>

                  {listing.owner?._id ? (
                    <ReviewsList ownerId={listing.owner._id} previewCount={3} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <RelatedListing listingId={listing._id} />
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">Listing not found.</div>
      )}
    </PageReadyLoader>
  );
}