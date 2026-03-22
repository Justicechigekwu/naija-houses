"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/libs/api";
import FavoriteButton from "@/components/FavoriteButton";

interface FavoriteListing {
  _id: string;
  title: string;
  price: number;
  location: string;
  city?: string;
  state: string;
  images: { url: string; public_id: string }[];
  category?: string;
  subcategory?: string;
}

export default function FavoritesGrid() {
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/favorites");
        setFavorites(res.data || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromUi = (listingId: string) => {
    setFavorites((prev) => prev.filter((item) => item._id !== listingId));
  };

  if (loading) {
    return <p className="p-4">Loading favorites...</p>;
  }

  if (!favorites.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">No favorites yet</h2>
        <p className="text-gray-600">
          Listings you save will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {favorites.map((listing) => (
        <div
          key={listing._id}
          className="bg-white rounded-xl shadow overflow-hidden border"
        >
          <Link href={`/listings/${listing._id}`}>
            <img
              src={listing.images?.[0]?.url || "/placeholder.jpg"}
              alt={listing.title}
              className="w-full h-52 object-cover"
            />
          </Link>

          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/listings/${listing._id}`} className="flex-1">
                <h3 className="font-semibold text-base line-clamp-2">
                  {listing.title}
                </h3>
              </Link>

              <div
                onClick={() => {
                  handleRemoveFromUi(listing._id);
                }}
              >
                <FavoriteButton listingId={listing._id} />
              </div>
            </div>

            <p className="text-green-600 font-bold">
             ₦{Number(listing.price).toLocaleString()}
            </p>

            <p className="text-sm text-gray-600">
              {[listing.location, listing.city, listing.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}