
"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { getListingHref } from "@/libs/listingUrl";
import type { Listing } from "@/types/listing";

function formatDistance(distanceMeters?: number) {
  if (!distanceMeters || distanceMeters <= 0 || distanceMeters > 900000000) {
    return "";
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m away`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km away`;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={getListingHref(listing)}
      className="mb-3 block w-full break-inside-avoid self-start overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
    >
      <div className="w-full aspect-[4/3]">
        <img
          src={listing.images?.[0]?.url || "/placeholder.jpg"}
          alt={listing.title || "Listing image"}
          loading="lazy"
          className="block h-full w-full object-cover"
        />
      </div>

      <div className="px-3 pt-2 pb-3">
        <h2 className="text-lg font-semibold leading-tight line-clamp-2">
          {listing.title}
        </h2>

        <p className="mt-1 font-medium text-green-600">
          ₦{Number(listing.price || 0).toLocaleString()}
        </p>

        <div className="mt-1 flex flex-wrap items-center text-xs leading-tight text-gray-800">
          <MapPin className="mr-1 h-3 w-3 text-gray-800" />

          <span>
            {listing.city}
            {listing.city || listing.state ? ", " : ""}
            {listing.state}
          </span>

          {listing.distanceMeters ? (
            <>
              <span className="mx-1">•</span>
              <span className="font-medium text-[#8A715D]">
                {formatDistance(listing.distanceMeters)}
              </span>
            </>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap items-center text-xs leading-tight text-gray-600">
          {listing.attributes?.condition && (
            <span>{String(listing.attributes.condition)}</span>
          )}

          {listing.attributes?.condition && (
            <span className="mx-1">•</span>
          )}

          <span>Posted by {listing.postedBy || "Owner"}</span>

          {listing.listingType ? (
            <>
              <span className="mx-1">•</span>
              <span>{listing.listingType}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}