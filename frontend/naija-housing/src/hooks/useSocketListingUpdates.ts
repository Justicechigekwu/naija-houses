"use client";

import { useEffect } from "react";
import { connectSocket } from "@/libs/socket";

type ListingUpdatePayload = {
  _id: string;
  publishStatus?: string;
  appealStatus?: string;
  updatedAt?: string;
  [key: string]: unknown;
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