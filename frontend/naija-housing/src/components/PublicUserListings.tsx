"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import Link from "next/link";

type Props = {
  userId: string;
};

export default function PublicUserListings({ userId }: Props) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchListings = async () => {
      try {
        const res = await api.get(`/profile/public/${userId}/listings`);
        setListings(res.data || []);
      } catch (error) {
        console.error("Failed to fetch user listings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  if (loading) return <p>Loading listings...</p>;

  if (listings.length === 0) {
    return <p className="text-gray-500 text-center">No active listings yet.</p>;
  }

  return (
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
              ₦{Number(listing.price).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              {listing.location}, {listing.state}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}0