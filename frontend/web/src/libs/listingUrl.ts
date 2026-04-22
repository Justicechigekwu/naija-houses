type ListingLike = {
  _id?: string;
  slug?: string;
};

export function getListingHref(listing: ListingLike) {
  return `/listings/${listing.slug || ""}`;
}