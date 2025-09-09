"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/libs/api";

type Listing = {
  _id: string;
  title: string;
  price?: string;
  description?: string;
  location?: string;
  images?: string[];
};

type Props = {
  userId: string;
};

export default function UserListings({ userId }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get(`/profile/${userId}`);
        setListings(res.data);
      } catch (error) {
        console.error("Failed to fetch users listings", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchListings();
    }
  }, [userId]);

  if (loading) return <p>Loading effect soon...</p>;
  if (listings.length === 0)
    return <p className="text-black-300">You have not created any Listings yet!</p>;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold">My Listings</h2>
      <ul className="space-y-3">
        {listings.map((listing) => (
          <li
            key={listing._id}
            onClick={() => router.push(`/listings/${listing._id}`)}
            className="p-4 flex items-center gap-4 border rounded shadow-sm bg-gray-50 cursor-pointer hover:shadow-md transition"
          >
            <img
              src={
                listing.images?.[0]
                  ? `http://localhost:5000${listing.images[0]}`
                  : "/placeholder.jpg"
              }
              alt={listing.title}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-bold">{listing.title}</h3>
              {listing.description && (
                <p className="text-sm text-gray-500">{listing.description}</p>
              )}
              <p className="text-green-600 text-sm">
                ₦
                {listing.price && !isNaN(Number(listing.price))
                  ? Number(listing.price).toLocaleString()
                  : listing.price || "N/A"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
