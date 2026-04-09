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
      className="w-full self-start rounded-xl shadow hover:shadow-lg transition bg-white cursor-pointer block overflow-hidden"
    >
      <div className="w-full aspect-[4/3]">
        <img
          src={listing.images?.[0]?.url || "/placeholder.jpg"}
          alt={listing.title || "Listing image"}
          loading="lazy"
          className="w-full h-full object-cover block"
        />
      </div>

      <div className="px-3 pt-2 pb-3">
        <h2 className="text-lg font-semibold leading-tight line-clamp-2">
          {listing.title}
        </h2>

        <p className="mt-1 text-green-600 font-medium">
          ₦{Number(listing.price || 0).toLocaleString()}
        </p>

        <div className="mt-1 text-xs text-gray-800 leading-tight flex items-center flex-wrap">
          <MapPin className="w-3 h-3 text-gray-800 mr-1" />
        
          <span>
            {listing.city}
            {(listing.city || listing.state) ? ", " : ""}
            {listing.state}
          </span>
        
          {listing.distanceMeters ? (
            <>
              <span className="mx-1">•</span>
              <span className="text-[#8A715D] font-medium">
                {formatDistance(listing.distanceMeters)}
              </span>
            </>
          ) : null}
        </div>

        <div className="mt-1 text-xs text-gray-600 leading-tight flex items-center flex-wrap">
          {listing.attributes?.condition && (
            <span>{String(listing.attributes.condition)}</span>
          )}
        
          {listing.attributes?.condition && (
            <span className="mx-1">•</span>
          )}
        
          <span>
            Posted by {listing.postedBy || "Owner"}
          </span>
        </div>
      </div>
    </Link>
  );
}
