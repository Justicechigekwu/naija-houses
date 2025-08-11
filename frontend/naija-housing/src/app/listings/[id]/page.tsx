"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/libs/api";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

type ListingType = {
  _id: string;
  title: string;
  location: string;
  salePrice?: number;
  rentPrice?: number;
  owner: string;
};

export default function ListingDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<ListingType | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${params.id}`);
        setListing(res.data);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        alert(err.response?.data?.message || "Failed to fetch listing");
      }
    };
    if (params.id) fetchListing();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/listings/${params.id}`);
      alert("Listing deleted");
      router.push("/listings");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(err.response?.data?.message || "Failed to delete listing");
    }
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <div>
      <h1>{listing.title}</h1>
      <p>{listing.location}</p>
      <p>Price: ${listing.salePrice || listing.rentPrice}</p>

      {user &&  (user._id === listing.owner || user?._id === listing.owner) && (
        <div className="flex gap-4 mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => router.push(`/listings/${listing._id}/edit`)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
