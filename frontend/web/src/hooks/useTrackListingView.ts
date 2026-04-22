"use client";

import { useEffect } from "react";
import api from "@/libs/api";
import { getVisitorId } from "@/libs/visitorId";

interface TrackListingViewArgs {
  listingId: string;
  category?: string;
  subcategory?: string;
}

export default function useTrackListingView({
  listingId,
  category,
  subcategory,
}: TrackListingViewArgs) {
  useEffect(() => {
    if (!listingId) return;

    const track = async () => {
      try {
        await api.post("/analytics/track", {
          eventType: "LISTING_VIEW",
          visitorId: getVisitorId(),
          listingId,
          category,
          subcategory,
        });
      } catch (error) {
        console.error("Failed to track listing view", error);
      }
    };

    track();
  }, [listingId, category, subcategory]);
}