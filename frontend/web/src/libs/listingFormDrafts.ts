//  for unsubmitted listings forms
import type { ListingFormShape } from "@/types/listing";

export type ListingFormDraftPayload = {
  formData: ListingFormShape;
  attributes: Record<string, string>;
  savedAt: string;
};

const DRAFT_VERSION = "v1";

export function getListingFormDraftKey(userId?: string | null) {
  return `velora_listing_form_draft:${DRAFT_VERSION}:${userId || "guest"}`;
}

export function saveListingFormDraft(
  payload: ListingFormDraftPayload,
  userId?: string | null
) {
  if (typeof window === "undefined") return;

  const key = getListingFormDraftKey(userId);
  localStorage.setItem(key, JSON.stringify(payload));
}

export function loadListingFormDraft(userId?: string | null) {
  if (typeof window === "undefined") return null;

  const key = getListingFormDraftKey(userId);
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ListingFormDraftPayload;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function clearListingFormDraft(userId?: string | null) {
  if (typeof window === "undefined") return;

  const key = getListingFormDraftKey(userId);
  localStorage.removeItem(key);
}