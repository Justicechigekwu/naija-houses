"use client";

import { useRouter } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import api from "@/libs/api";

export default function CreateListingPage() {
  const router = useRouter();

  const handleCreateListing = async (formData: FormData) => {
    try {
      const res = await api.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const listingId = res.data?.listingId || res.data?.listing?._id;

      if (!listingId) {
        throw new Error("Listing ID not returned");
      }

      router.push(`/listings/${listingId}/payment`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create listing");
    }
  };

  return (
    <div>
      <h1 className="text-center py-5 font-medium text-xl">Create Listing</h1>

      <ListingForm
        onSubmit={handleCreateListing}
        isEditMode={false}
      />
    </div>
  );
}
