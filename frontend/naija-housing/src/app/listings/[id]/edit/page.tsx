"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ListingForm from "@/components/ListingForm";

export default function EditListingPage() {
  const params = useParams();
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`http://localhost:5000/api/listings/${params.id}`);
      const data = await res.json();
      setListing(data);
    };
    fetchListing();
  }, [params.id]);

  const handleUpdate = async (data: FormData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/listings/${params.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await res.json();
    if (res.ok) {
      alert("Listing updated successfully!");
    } else {
      alert(result.message || "Something went wrong");
    }
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <>
      <h1>Edit Listing</h1>
      <ListingForm initialData={listing} onSubmit={handleUpdate} />
    </>
  );
}


