"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import deleteListing from "@/controllers/Delete";
import type { Listing } from "@/types/listing";
import { useUI } from "@/hooks/useUi";
import api from "@/libs/api";

type ApiErrorResponse = {
  message?: string;
};

type RenewResponse = {
  payment?: {
    paymentCode?: string;
  };
};

type Props = {
  items: Listing[];
  onRefresh: () => void;
};

export default function ExpiredListings({ items, onRefresh }: Props) {
  const router = useRouter();
  const { showToast, showConfirm } = useUI();
  const [loadingId, setLoadingId] = useState<string | null>(null);

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
          await deleteListing(listingId);
          showToast("Listing deleted successfully", "success");
          onRefresh();
        } catch (err: unknown) {
          const error = err as AxiosError<ApiErrorResponse>;
          showToast(
            error.response?.data?.message ||
              error.message ||
              "Failed to delete listing",
            "error"
          );
        } finally {
          setLoadingId(null);
        }
      }
    );
  };

  const handleRenew = async (listingId: string) => {
    try {
      setLoadingId(listingId);

      const res = await api.post<RenewResponse>(`/listings/${listingId}/renew`);
      const paymentCode = res.data?.payment?.paymentCode;

      showToast("Renewal started successfully", "success");

      if (paymentCode) {
        router.push(
          `/listings/${listingId}/payment-details?code=${encodeURIComponent(
            paymentCode
          )}`
        );
      } else {
        router.push(`/listings/${listingId}/payment-details`);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to start renewal",
        "error"
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-base font-medium text-gray-800">
          No expired listings right now.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Your expired listings will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((listing) => {
        const firstImage = listing.images?.[0];
        const imageUrl = firstImage?.url || "";

        const formattedPrice =
          typeof listing.price === "number"
            ? `₦${listing.price.toLocaleString()}`
            : "No price yet";

        const locationText =
          [ listing.city, listing.state]
            .filter(Boolean)
            .join(", ") || "No location yet";

        const expiredText = listing.expiredAt || listing.expiresAt;

        const isLoading = loadingId === listing._id;

        return (
          <div
            key={listing._id}
            className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm md:flex-row"
          >
            <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 md:w-44">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={listing.title || "Listing image"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {listing.title?.trim() || "Untitled listing"}
                  </h2>
                  <p className="text-sm text-gray-600">{locationText}</p>
                </div>

                <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Expired
                </span>
              </div>

              <p className="text-base font-semibold text-green-700">
                {formattedPrice}
              </p>

              <p className="text-xs text-gray-500">
                Expired on:{" "}
                {expiredText ? new Date(expiredText).toLocaleString() : "Unknown"}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleRenew(listing._id)}
                  disabled={isLoading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Processing..." : "Renew"}
                </button>

                <button
                  onClick={() => handleDelete(listing._id)}
                  disabled={isLoading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Processing..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}