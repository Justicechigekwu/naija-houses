// 'use client';

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import api from "@/libs/api";
// import editListing from "@/controllers/edit";
// import EditForm from "@/components/EditForm";

// export default function EditListingPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [listing, setListing] = useState<any>(null);

//   useEffect(() => {
//     if (id) {
//       api.get(`/listings/${id}`)
//         .then((res) => setListing(res.data))
//         .catch((err) => console.error("Error:", err));
//     }
//   }, [id]);

//   const handleSubmit = async (formData: FormData) => {
//     try {
//       await editListing(id as string, formData);
//       alert("Listing updated successfully!");
//       router.push(`/listings/${id}`);
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   if (!listing) return <p>Loading...</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
//       <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
//       <EditForm initialData={listing} onSubmit={handleSubmit} />
//     </div>
//   );
// }





"use client";

import EditListing from "@/components/EditListing";

export default function EditListingPage() {
  return <EditListing />;
}

