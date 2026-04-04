"use client";

import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import api from "@/libs/api";
import deleteListing from "@/controllers/Delete";
import { useUI } from "@/hooks/useUi";

type ListingImage = {
  url: string;
  public_id: string;
};

type Listing = {
  _id: string;
  title: string;
  price?: number;
  description?: string;
  state: string;
  city: string;
  images?: ListingImage[];
};

type Props = {
  userId: string;
};

export default function UserListings({ userId }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { showToast, showConfirm } = useUI();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get<Listing[]>(`/profile/${userId}`);
        setListings(res.data || []);
      } catch (error) {
        console.error("Failed to fetch users listings", error);
        showToast("Failed to fetch your listings", "error");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchListings();
    }
  }, [userId, showToast]);

  const handleDelete = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();

    showConfirm(
      {
        title: "Delete Listing",
        message: "Are you sure you want to delete this listing?",
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          setDeletingId(listingId);
          await deleteListing(listingId);

          setListings((prev) => prev.filter((item) => item._id !== listingId));
          showToast("Listing deleted successfully", "success");
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            showToast(
              error.response?.data?.message || "Failed to delete listing",
              "error"
            );
          } else if (error instanceof Error) {
            showToast(error.message || "Failed to delete listing", "error");
          } else {
            showToast("Failed to delete listing", "error");
          }
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  const handleEdit = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    router.push(`/listings/edit/${listingId}`);
  };

  if (loading) {
    return (
      <div className="mt-8">
        <div className="py-5">
          <div className="h-8 w-48 bg-gray-300 rounded mx-auto animate-pulse"></div>
        </div>

        <ul className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <li
              key={i}
              className="p-4 flex items-center justify-between gap-4 border rounded shadow-sm bg-gray-50"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-20 h-20 bg-gray-300 rounded animate-pulse"></div>

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="h-9 w-16 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-9 w-16 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (listings.length === 0) {
    return <p className="text-black-300">You have no active listings yet!</p>;
  }

  return (
    <div className="mt-8">
      <div>
        <ul className="space-y-3">
          {listings.map((listing) => (
            <li
              key={listing._id}
              onClick={() => router.push(`/listings/${listing._id}`)}
              className="p-4 flex items-center justify-between gap-4 border rounded shadow-sm bg-gray-50 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={listing.images?.[0]?.url || "/placeholder.jpg"}
                  alt={listing.title}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="min-w-0">
                  <h3 className="font-bold truncate">{listing.title}</h3>
                  <p className=" truncate">{listing.city}, {listing.state}</p>
                  <p className="text-green-600 text-sm">
                    ₦{Number(listing.price ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={(e) => handleEdit(e, listing._id)}
                  className="px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => handleDelete(e, listing._id)}
                  disabled={deletingId === listing._id}
                  className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deletingId === listing._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}