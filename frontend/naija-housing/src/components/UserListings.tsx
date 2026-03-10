// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/libs/api";

// type Listing = {
//   _id: string;
//   title: string;
//   price?: string;
//   location?: string;
//   images?: string[];
// };

// type Props = {
//   userId: string;
// };

// export default function UserListings({ userId }: Props) {
//   const [listings, setListings] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const res = await api.get(`/profile/${userId}`);
//         setListings(res.data);
//       } catch (error) {
//         console.error("Failed to fetch users listings", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchListings();
//     }
//   }, [userId]);

//   if (loading) return <p>Loading effects coming soon...</p>;
//   if (listings.length === 0)
//     return <p className="text-black-300">You have not created any Listings yet!</p>;

//   return (
//     <div className="mt-8">
//       <div className="">
//           <div className=" py-5 ">
//           {/* <div className="px-6 py-5 "> */}
//             <h2 className="text-3xl font-semibold">Active listings</h2>
//           </div>
//         <ul className="space-y-3">
//           {listings.map((listing) => (
//             <li
//               key={listing._id}
//               onClick={() => router.push(`/listings/${listing._id}`)}
//               className="p-4 flex items-center gap-4 border rounded shadow-sm bg-gray-50 cursor-pointer hover:shadow-md transition"
//             >
//               <img
//                 src={
//                   listing.images?.[0]
//                     ? `http://localhost:5000${listing.images[0]}`
//                     : "/placeholder.jpg"
//                 }
//                 alt={listing.title}
//                 className="w-20 h-20 object-cover rounded"
//               />
//               <div>
//                 <h3 className="font-bold">{listing.title}</h3>
//                 {/* {listing.description && (
//                   <p className="text-sm text-gray-500">{listing.description}</p>
//                 )} */}
//                 <p className="text-green-600 text-sm">
//                   ₦
//                   {listing.price && !isNaN(Number(listing.price))
//                     ? Number(listing.price).toLocaleString()
//                     : listing.price || "N/A"}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/libs/api";
import deleteListing from "@/controllers/Delete";

type Listing = {
  _id: string;
  title: string;
  price?: string;
  location?: string;
  images?: string[];
};

type Props = {
  userId: string;
};

export default function UserListings({ userId }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get(`/profile/${userId}`);
        setListings(res.data);
      } catch (error) {
        console.error("Failed to fetch users listings", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchListings();
    }
  }, [userId]);

  const handleDelete = async (
    e: React.MouseEvent,
    listingId: string
  ) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(listingId);
      await deleteListing(listingId);

      setListings((prev) => prev.filter((item) => item._id !== listingId));
    } catch (error: any) {
      alert(error.message || "Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    router.push(`/listings/edit/${listingId}`);
  };

  if (loading) return <p>Loading effect soon...</p>;

  if (listings.length === 0) {
    return (
      <p className="text-black-300">
        You have not created any Listings yet!
      </p>
    );
  }

  return (
    <div className="mt-8">
      <div>
        <div className="py-5">
          <h2 className="text-3xl font-semibold">Active listings</h2>
        </div>

        <ul className="space-y-3">
          {listings.map((listing) => (
            <li
              key={listing._id}
              onClick={() => router.push(`/listings/${listing._id}`)}
              className="p-4 flex items-center justify-between gap-4 border rounded shadow-sm bg-gray-50 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={
                    listing.images?.[0]
                      ? `http://localhost:5000${listing.images[0]}`
                      : "/placeholder.jpg"
                  }
                  alt={listing.title}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="min-w-0">
                  <h3 className="font-bold truncate">{listing.title}</h3>
                  <p className="text-green-600 text-sm">
                    ₦
                    {listing.price && !isNaN(Number(listing.price))
                      ? Number(listing.price).toLocaleString()
                      : listing.price || "N/A"}
                  </p>
                  {listing.location && (
                    <p className="text-sm text-gray-500">{listing.location}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={(e) => handleEdit(e, listing._id)}
                  className="px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => handleDelete(e, listing._id)}
                  disabled={deletingId === listing._id}
                  className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deletingId === listing._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}