"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/libs/api";
import deleteListing from "@/controllers/Delete";
import type { Listing } from "@/types/listing";
import { useUI } from "@/hooks/useUi";

export default function ExpiredListings({
  items,
  onRefresh,
}: {
  items: Listing[];
  onRefresh: () => void;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { showToast } = useUI();

  const handleDelete = async (listingId: string) => {
    const ok = confirm("Delete this expired listing permanently?");
    if (!ok) return;

    try {
      setLoadingId(listingId);
      await deleteListing(listingId);
      onRefresh();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete listing");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRenew = async (listingId: string) => {
    try {
      setLoadingId(listingId);

      const res = await api.post(`/listings/${listingId}/renew`);

      const code = res.data?.payment?.paymentCode || "";
      router.push(
        `/listings/${listingId}/payment-details?code=${encodeURIComponent(code)}`
      );
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to start renewal");
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-5">
        <p className="text-gray-700 font-medium">No expired listings right now.</p>
        <p className="text-sm text-gray-500 mt-1">
          Your expired posts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((l) => {
        const firstImage = l.images?.[0];
        const imageUrl =
          typeof firstImage === "string" ? firstImage : firstImage?.url || "";

        return (
          <div
            key={l._id}
            className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4"
          >
            <div className="w-full md:w-44 h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
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
                  <p className="text-sm text-gray-600">
                    {[l.location, l.city, l.state].filter(Boolean).join(", ") ||
                      "No location yet"}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 whitespace-nowrap">
                  Expired
                </span>
              </div>

              <p className="text-base font-medium text-green-700">
                {l.price || "No price yet"}
              </p>

              <p className="text-xs text-gray-500">
                Expired on:{" "}
                {l.expiredAt
                  ? new Date(l.expiredAt).toLocaleString()
                  : l.expiresAt
                  ? new Date(l.expiresAt).toLocaleString()
                  : "Unknown"}
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleRenew(l._id)}
                  disabled={loadingId === l._id}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
                >
                  {loadingId === l._id ? "Processing..." : "Renew"}
                </button>

                <button
                  onClick={() => handleDelete(l._id)}
                  disabled={loadingId === l._id}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium disabled:opacity-60"
                >
                  {loadingId === l._id ? "Processing..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}