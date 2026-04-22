"use client";

import { useRouter } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import api from "@/libs/api";
import { useUI } from "@/hooks/useUi";
import { AxiosError } from "axios";

export default function CreateListingPage() {
  const router = useRouter();
  const { showToast } = useUI();

  const handleCreateListing = async (formData: FormData) => {
    try {
      const res = await api.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const listingId = res.data?.listingId || res.data?.listing?._id;

      if (!listingId) {
        throw new Error("Listing ID not returned");
      }

      router.push(`/listing-actions/${listingId}/payment`);
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Failed to create listing";

      showToast(message, "error");
    }
  };

  return (
    <div>
      <h1 className="text-center py-5 font-medium text-xl">Create Listing</h1>

      <ListingForm onSubmit={handleCreateListing} isEditMode={false} />
    </div>
  );
}