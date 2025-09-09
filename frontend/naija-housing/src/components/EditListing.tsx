"use client";

import { useEffect, useState } from "react";
import ListingForm from "@/components/ListingForm";
import editListing from "@/controllers/Edit";
import api from "@/libs/api";
import { useParams, useRouter } from "next/navigation";

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await api.get(`/listings/${id}`);
        setInitialData(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchListing();
  }, [id]);

  const handleUpdateListing = async (formData: FormData) => {
    try {
      await editListing(id as string, formData);
      alert("Listing updated successfully!");
      router.push(`/listings/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Listing</h1>
      <ListingForm initialData={initialData} onSubmit={handleUpdateListing} />
    </div>
  );
}