import api from "@/libs/api";

export type AnalyticsEventType =
  | "APP_VISIT"
  | "CATEGORY_VIEW"
  | "SUBCATEGORY_VIEW"
  | "LISTING_VIEW"
  | "SEARCH_VIEW";

const VISITOR_ID_KEY = "velora_visitor_id_v1";

export const getVisitorId = () => {
  if (typeof window === "undefined") return "";

  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const nextId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(VISITOR_ID_KEY, nextId);
  return nextId;
};

export const trackAnalyticsEvent = async ({
  eventType,
  listingId = null,
  category = null,
  subcategory = null,
  meta = {},
}: {
  eventType: AnalyticsEventType;
  listingId?: string | null;
  category?: string | null;
  subcategory?: string | null;
  meta?: Record<string, unknown>;
}) => {
  try {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    await api.post("/analytics/track", {
      eventType,
      visitorId,
      listingId,
      category,
      subcategory,
      meta,
    });
  } catch (error) {
    console.error("Analytics track failed", error);
  }
};