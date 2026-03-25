"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import Link from "next/link";
import PageReadyLoader from "./pages/PageReadyLoader";

type ListingImage = {
  url: string;
  public_id?: string;
};

type PublicListing = {
  _id: string;
  title: string;
  price?: number | string;
  location?: string;
  state?: string;
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
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  return (
    <PageReadyLoader ready={!loading}>
      {listings.length === 0 ? (
        <p className="text-gray-500 text-center">No active listings yet.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4 p-4">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              href={`/listings/${listing._id}`}
              className="p-4 flex items-center gap-4 border rounded shadow-sm bg-gray-50 cursor-pointer hover:shadow-md transition"
            >
              <img
                src={listing.images?.[0]?.url || "/placeholder.png"}
                alt={listing.title}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="min-w-0">
                <h3 className="font-bold truncate">{listing.title}</h3>
                <p className="text-green-600 font-bold">
                  ₦{Number(listing.price || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {[listing.location, listing.state].filter(Boolean).join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageReadyLoader>
  );
}