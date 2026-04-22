"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/libs/api";
import ListingForm from "@/components/ListingForm";
import { useUI } from "@/hooks/useUi";
import PageReadyLoader from "@/components/pages/PageReadyLoader";
import type { Listing } from "@/types/listing";

type ListingResponse = {
  listing?: Listing;
};

export default function EditListing() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { showToast } = useUI();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get<ListingResponse | Listing>(`/listings/${id}`);

        if ("listing" in res.data) {
          setListing(res.data.listing ?? null);
        } else {
          setListing(res.data as Listing);
        }
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
      const res = await api.put<Listing>(`/listings/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      showToast("Listing updated successfully", "success");
      router.push(`/listings/${res.data.slug}`);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Failed to update listing", error);
      showToast(
        error?.response?.data?.message || "Failed to update listing",
        "error"
      );
    }
  };

  return (
    <PageReadyLoader ready={!loading}>
      {!listing ? (
        <p className="p-6">Listing not found</p>
      ) : (
        <div className="p-4 md:p-6">
          <ListingForm
            initialData={listing as Listing}
            onSubmit={handleUpdate}
            isEditMode={true}
          />
        </div>
      )}
    </PageReadyLoader>
  );
}