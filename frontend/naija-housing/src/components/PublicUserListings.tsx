"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import Link from "next/link";
import { ChevronRight, MapPin, PackageOpen } from "lucide-react";

type ListingImage = {
  url: string;
  public_id?: string;
};

type PublicListing = {
  _id: string;
  title: string;
  price?: number | string;
  state?: string;
  city?: string;
  images?: ListingImage[];
};

type Props = {
  userId: string;
};

export default function PublicUserListings({ userId }: Props) {
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await api.get<PublicListing[]>(
          `/profile/public/${userId}/listings`
        );
        setListings(res.data || []);
      } catch (error) {
        console.error("Failed to fetch user listings", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid flex-col gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/3 rounded bg-gray-200" />
                <div className="h-4 w-1/4 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-[#fafafa] px-6 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <PackageOpen className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No active listings yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          This user does not have any active listings at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid flex-col gap-4 ">
      {listings.map((listing) => (
        <Link
          key={listing._id}
          href={`/listings/${listing._id}`}
          className="group rounded-2xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-4 p-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28">
              <img
                src={listing.images?.[0]?.url || "/placeholder.png"}
                alt={listing.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-gray-900">
                {listing.title}
              </h3>

              <p className="mt-2 font-bold text-green-600">
                ₦{Number(listing.price || 0).toLocaleString()}
              </p>

              {listing.state && listing.city && (
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.state} {listing.city}</span>
                </div>
              )}
            </div>

            <div className="hidden shrink-0 sm:flex">
              <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition group-hover:bg-gray-100">
                <span>View listing</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}