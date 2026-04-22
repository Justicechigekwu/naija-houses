const LISTING_TYPE_CATEGORIES = new Set(["PROPERTY", "LAND"]);
const POSTED_BY_CATEGORIES = new Set(["PROPERTY", "LAND", "VEHICLES"]);

export function categoryUsesListingType(category?: string) {
  return LISTING_TYPE_CATEGORIES.has(String(category || "").toUpperCase());
}

export function categoryUsesPostedBy(category?: string) {
  return POSTED_BY_CATEGORIES.has(String(category || "").toUpperCase());
}

export function getListingTypeOptions(category?: string): string[] {
  const normalized = String(category || "").toUpperCase();

  if (normalized === "PROPERTY") {
    return ["Sale", "Rent", "Shortlet"];
  }

  if (normalized === "LAND") {
    return ["Sale"];
  }

  return [];
}