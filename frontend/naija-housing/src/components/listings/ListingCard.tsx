"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
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
      href={`/listings/${listing._id}`}
      className="w-full rounded shadow hover:shadow-lg transition bg-white cursor-pointer p-4 block"
    >
      <div className="w-full flex justify-center items-center mb-3 bg-gray-100 rounded">
        <img
          src={listing.images?.[0]?.url || "/placeholder.jpg"}
          alt={listing.title || "Listing image"}
          loading="lazy"
          className="w-full h-48 object-cover rounded"
        />
      </div>

      <h2 className="text-xl font-semibold line-clamp-2">{listing.title}</h2>

      <p className="text-green-600">
        ₦{Number(listing.price || 0).toLocaleString()}
      </p>

      <div className="mt-1 text-sm text-gray-500">
        <MapPin className="w-4 h-4 text-green-300 inline mr-1" />
        <span>{listing.city}</span>
        {(listing.city || listing.state) ? <span>, </span> : null}
        <span>{listing.state}</span>
      </div>

      {listing.distanceMeters ? (
        <p className="mt-1 text-xs text-[#8A715D] font-medium">
          {formatDistance(listing.distanceMeters)}
        </p>
      ) : null}

      <p className="text-xs mt-2">
        Posted by {listing.postedBy || "Owner"}
      </p>
    </Link>
  );
}