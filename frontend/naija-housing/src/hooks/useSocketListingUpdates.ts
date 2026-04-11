"use client";

import { useEffect } from "react";
import { connectSocket } from "@/libs/socket";

export type ListingUpdatePayload = {
  listingId: string;
  slug?: string;
  title?: string;
  publishStatus?:
    | "DRAFT"
    | "AWAITING_PAYMENT"
    | "PENDING_CONFIRMATION"
    | "PUBLISHED"
    | "EXPIRED"
    | "REJECTED"
    | "REMOVED_BY_ADMIN"
    | "APPEAL_PENDING";
  rejectionType?: "PAYMENT" | "PROHIBITED" | string;
  appealStatus?: "PENDING" | "APPROVED" | "REJECTED" | "NONE";
  updatedAt?: string;
  publishedAt?: string | null;
  expiresAt?: string | null;
  expiredAt?: string | null;
  city?: string;
  state?: string;
  price?: number;
  images?: { url: string; public_id?: string }[];
  listingType?: "Sale" | "Rent" | "Shortlet";
  postedBy?: "Owner" | "Agent" | "Dealer" | "Seller";
  category?: string;
  subcategory?: string;
  attributes?: Record<string, string | number | boolean | string[]>;
};

type UseSocketListingUpdatesProps = {
  onListingUpdated?: (listing: ListingUpdatePayload) => void;
};

export default function useSocketListingUpdates({
  onListingUpdated,
}: UseSocketListingUpdatesProps) {
  useEffect(() => {
    const socket = connectSocket();

    const handleListingUpdated = (listing: ListingUpdatePayload) => {
      onListingUpdated?.(listing);
    };

    socket.on("listing:updated", handleListingUpdated);

    return () => {
      socket.off("listing:updated", handleListingUpdated);
    };
  }, [onListingUpdated]);
}
