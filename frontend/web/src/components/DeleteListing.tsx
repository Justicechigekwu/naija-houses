'use client'

import { useRouter } from "next/navigation";
import api from '@/libs/api';
import { AxiosError } from 'axios';
import { useUI } from "@/hooks/useUi";

export default function DeleteListing({ listingId }: { listingId: string }) {
  const router = useRouter();
  const { showToast, showConfirm } = useUI();

  const handleDelete = () => {
    showConfirm(
      {
        title: "Delete Listing",
        message: "Are you sure you want to delete this listing? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          await api.delete(`/listings/${listingId}`);
          showToast("Listing deleted successfully", "success");
          router.push('/listings');
        } catch (err: unknown) {
          if (err instanceof AxiosError) {
            showToast(
              err?.response?.data?.message || "Failed to delete listing",
              "error"
            );
          } else {
            showToast("Failed to delete listing", "error");
          }
        }
      }
    );
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Delete Listing
    </button>
  );
}