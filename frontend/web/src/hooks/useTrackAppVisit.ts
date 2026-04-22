"use client";

import { useEffect } from "react";
import api from "@/libs/api";
import { getVisitorId } from "@/libs/visitorId";

export default function useTrackAppVisit() {
  useEffect(() => {
    const track = async () => {
      try {
        await api.post("/analytics/track", {
          eventType: "APP_VISIT",
          visitorId: getVisitorId(),
        });
      } catch (error) {
        console.error("Failed to track app visit", error);
      }
    };

    track();
  }, []);
}