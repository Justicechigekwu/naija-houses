"use client";

import { useEffect, useState } from "react";
import ListingForm from "@/components/ListingForm";
import api from "@/libs/api";
import { useParams } from "next/navigation";

export default function EditListingPage() {
  const { id } = useParams();
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
      const res = await api.put(`/listings/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Listing updated successfully!");
      console.log(res.data);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
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