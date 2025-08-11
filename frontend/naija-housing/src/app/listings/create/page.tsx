"use client";
import ListingForm from "@/components/ListingForm";

export default function CreateListingPage() {
  const handleCreate = async (data: FormData) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/listings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await res.json();
    if (res.ok) {
      alert("Listing created successfully!");
    } else {
      alert(result.message || "Something went wrong");
    }
  };

  return (
    <>
      <h1>Create Listing</h1>
      <ListingForm onSubmit={handleCreate} />
    </>
  );
}
