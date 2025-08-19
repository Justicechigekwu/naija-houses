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

      alert("Listing created successfully!");
      router.push('/')

      console.log(res.data);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="">
      <h1 className="text-center py-5 font-medium text-xl">Create Listing</h1>
      <ListingForm onSubmit={handleCreateListing} />
    </div>
  );
}

