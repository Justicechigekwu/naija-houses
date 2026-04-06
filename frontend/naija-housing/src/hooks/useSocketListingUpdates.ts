// "use client";

// import { useEffect } from "react";
// import { connectSocket } from "@/libs/socket";

// type ListingUpdatePayload = {
//   _id: string;
//   publishStatus?: string;
//   appealStatus?: string;
//   updatedAt?: string;
//   [key: string]: unknown;
// };

// type UseSocketListingUpdatesProps = {
//   onListingUpdated?: (listing: ListingUpdatePayload) => void;
// };

// export default function useSocketListingUpdates({
//   onListingUpdated,
// }: UseSocketListingUpdatesProps) {
//   useEffect(() => {
//     const socket = connectSocket();

//     const handleListingUpdated = (listing: ListingUpdatePayload) => {
//       onListingUpdated?.(listing);
//     };

//     socket.on("listing:updated", handleListingUpdated);

//     return () => {
//       socket.off("listing:updated", handleListingUpdated);
//     };
//   }, [onListingUpdated]);
// }





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
  appealStatus?: "PENDING" | "APPROVED" | "REJECTED" | "NONE";
  updatedAt?: string;
  publishedAt?: string | null;
  expiresAt?: string | null;
  expiredAt?: string | null;
  city?: string;
  state?: string;
  price?: number;
  images?: { url: string; public_id?: string }[];
  postedBy?: "Owner" | "Agent" | "Dealer" | "Seller";
  category?: string;
  subcategory?: string;
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