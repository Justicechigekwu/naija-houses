'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/libs/api";

interface Listing {
  _id: string;
  title: string;
  price?: number;
  state?: string;
  location?: string;
  images?: string[];
  category?: string;
  subcategory?: string;
  attributes?: Record<string, any>;
}

export default function RelatedListing({ listingId }: { listingId: string }) {
  const [related, setRelated] = useState<Listing[]>([]);

  useEffect(() => {
    if (!listingId) return;

    const fetchRelated = async () => {
      try {
        const res = await api.get(`/listings/${listingId}/related`);
        setRelated(res.data);
      } catch (error) {
        console.error("Failed to load related listings", error);
      }
    };
    fetchRelated();
  }, [listingId]);

  if (!related.length) return null;

  return (
    <div className="mt-10 aspect-ratio">
      <h2 className="text-xl font-bold mb-4">You may also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {related.map((listing) => (
          <Link
            key={listing._id}
            href={`/listings/${listing._id}`}
            className="block border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={
                listing.images?.[0]
                  ? `http://localhost:5000${listing.images[0]}`
                  : "/placeholder.jpg"
              }
              alt={listing.title}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <p className="text-green-600 text-sm font-semibold">
                ₦
                {listing.price && !isNaN (Number(listing.price))
                ? Number(listing.price).toLocaleString()
                 : listing.price || 'N/A'}
            </p>
            <p className="text-gray-500 text-xs inline">{listing.state}</p>,<span> </span> 
            <p className="text-gray-500 text-xs inline">{listing.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


// 'use client';

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import api from "@/libs/api";

// interface Listing {
//   _id: string;
//   title: string;
//   price?: string;
//   state?: string;
//   location?: string;
//   images?: string[];
//   category?: string;
//   subcategory?: string;
//   attributes?: Record<string, any>;
// }

// const BACKEND_URL = "http://localhost:5000";

// export default function RelatedListing({ listingId }: { listingId: string }) {
//   const [related, setRelated] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!listingId) return;

//     const fetchRelated = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get(`/listings/${listingId}/related`);
//         setRelated(res.data || []);
//       } catch (error) {
//         console.error("Failed to load related listings", error);
//         setRelated([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRelated();
//   }, [listingId]);

//   if (loading) return null;
//   if (!related.length) return null;

//   return (
//     <div className="mt-10">
//       <h2 className="text-xl font-bold mb-4">You may also like</h2>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         {related.map((listing) => {
//           const formattedPrice =
//             listing.price && !isNaN(Number(listing.price))
//               ? Number(listing.price).toLocaleString()
//               : listing.price || "N/A";

//           const imageSrc =
//             listing.images?.[0]
//               ? `${BACKEND_URL}${listing.images[0]}`
//               : "/placeholder.jpg";

//           const displayLocation = [listing.state, listing.location]
//             .filter(Boolean)
//             .join(", ");

//           return (
//             <Link
//               key={listing._id}
//               href={`/listings/${listing._id}`}
//               className="block border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
//             >
//               <img
//                 src={imageSrc}
//                 alt={listing.title}
//                 className="w-full h-48 object-cover rounded mb-3"
//               />

//               <h3 className="text-lg font-semibold line-clamp-2">
//                 {listing.title}
//               </h3>

//               <p className="text-green-600 text-sm font-semibold">
//                 ₦{formattedPrice}
//               </p>

//               <p className="text-gray-500 text-xs">
//                 {displayLocation || "Location not available"}
//               </p>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
