"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/libs/api";
import type { Listing } from "@/types/listing";
import PageReadyLoader from "@/components/pages/PageReadyLoader";
import { useUI } from "@/hooks/useUi";
import useSocketListingUpdates, {
  type ListingUpdatePayload,
} from "@/hooks/useSocketListingUpdates";

export default function PendingListings() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useUI();

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Listing[]>("/listings/me/pending");
      setItems(res.data || []);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        showToast(
          err.response?.data?.message || "Failed to load pending listings",
          "error"
        );
      } else {
        showToast("Failed to load pending listings", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  useSocketListingUpdates({
    onListingUpdated: (payload: ListingUpdatePayload) => {
      if (!payload?.listingId) return;

      const stillPending =
        payload.publishStatus === "PENDING_CONFIRMATION" ||
        payload.publishStatus === "APPEAL_PENDING";

      setItems((prev) => {
        const exists = prev.some((item) => item._id === payload.listingId);

        if (stillPending) {
          if (!exists) {
            return prev;
          }

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

  const getStatusLabel = (listing: Listing) => {
    if (listing.publishStatus === "APPEAL_PENDING") {
      return "Appeal Under Review";
    }

    if (listing.publishStatus === "PENDING_CONFIRMATION") {
      return "Awaiting Approval";
    }

    return "Pending";
  };

  const getStatusClasses = (listing: Listing) => {
    if (listing.publishStatus === "APPEAL_PENDING") {
      return "bg-blue-100 text-blue-800";
    }

    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <PageReadyLoader ready={!loading}>
      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Pending Page</h1>

        {items.length === 0 ? (
          <div className="bg-white border rounded-lg p-5">
            <p className="text-gray-700 font-medium">No pending listings right now.</p>
            <p className="text-sm text-gray-500 mt-1">
              Your pending listings will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((l) => {
              const image = l.images?.[0]?.url;

              return (
                <div
                  key={l._id}
                  className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4"
                >
                  <div className="w-full md:w-44 h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={l.title || "Listing image"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {l.title?.trim() ? l.title : "Untitled listing"}
                        </h2>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${getStatusClasses(
                          l
                        )}`}
                      >
                        {getStatusLabel(l)}
                      </span>
                    </div>

                    <p className="text-base font-medium text-green-700">
                      ₦{Number(l.price || 0).toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-600">
                      {[l.city, l.state].filter(Boolean).join(", ") ||
                        "No location yet"}
                    </p>

                    {l.publishStatus === "APPEAL_PENDING" && (
                      <p className="text-sm text-blue-600 font-medium">
                        Your appeal has been submitted and is waiting for admin review.
                      </p>
                    )}

                    <p className="text-xs text-gray-500">
                      Last updated:{" "}
                      {l.updatedAt
                        ? new Date(l.updatedAt).toLocaleString()
                        : "No update date"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageReadyLoader>
  );
}