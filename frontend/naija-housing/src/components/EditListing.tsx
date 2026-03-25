"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/libs/api";
import ListingForm from "@/components/ListingForm";
import { useUI } from "@/hooks/useUi";
import PageReadyLoader from "@/components/pages/PageReadyLoader";

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useUI();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data?.listing || res.data);
      } catch (error) {
        console.error("Failed to fetch listing", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  const handleUpdate = async (formData: FormData) => {
    try {
      await api.put(`/listings/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("Listing updated successfully", "success");
      router.push(`/listings/${id}`);
    } catch (error: any) {
      console.error("Failed to update listing", error);
      showToast(error?.response?.data?.message || "Failed to update listing", "error");
    }
  };

  return (
    <PageReadyLoader ready={!loading}>
      {!listing ? (
        <p className="p-6">Listing not found</p>
      ) : (
        <div className="p-4 md:p-6">
          <ListingForm
            initialData={listing}
            onSubmit={handleUpdate}
            isEditMode={true}
          />
        </div>
      )}
    </PageReadyLoader>
  );
}