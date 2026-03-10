// "use client";

// import { useEffect, useState } from "react";
// import api from "@/libs/api";
// import type { Listing } from "@/types/listing";

// export default function PendingListings() {
//   const [items, setItems] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPending = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/listings/me/pending");
//       setItems(res.data || []);
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Failed to load pending listings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPending();
//   }, []);

//   if (loading) return <div className="max-w-3xl mx-auto p-4">Loading...</div>;

//   return (
//     <div className="max-w-3xl mx-auto p-4 space-y-4">
//       <h1 className="text-2xl font-semibold">Pending Approval</h1>

//       {items.length === 0 ? (
//         <div className="bg-white border rounded p-4">
//           No pending listings right now.
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {items.map((l) => (
//             <div key={l._id} className="bg-white border rounded p-4">
//               <div className="text-lg font-medium">
//                 {l.title?.trim() ? l.title : "Untitled listing"}
//               </div>
//               <div className="text-sm text-gray-600">
//                 Status: {l.publishStatus} • {l.category || "PROPERTY"}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import type { Listing } from "@/types/listing";

const toAbs = (img?: string) => {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;

  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";

  const normalized = img.startsWith("/") ? img : `/${img}`;
  return `${base}${normalized}`;
};

export default function PendingListings() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/listings/me/pending");
      setItems(res.data || []);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to load pending listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  if (loading) {
    return <div className="max-w-5xl mx-auto p-4">Loading pending listings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Pending Page</h1>

      {items.length === 0 ? (
        <div className="bg-white border rounded-lg p-5">
          <p className="text-gray-700 font-medium">No pending listings right now.</p>
          <p className="text-sm text-gray-500 mt-1">
            Your pending Listings will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((l) => {
            const image = l.images?.[0];

            return (
              <div
                key={l._id}
                className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4"
              >
                <div className="w-full md:w-44 h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {image ? (
                    <img
                      src={toAbs(image)}
                      alt={l.title || "Listing image"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {l.title?.trim() ? l.title : "Untitled listing"}
                      </h2>
                      {/* <p className="text-sm text-gray-600">
                        {l.category || "PROPERTY"}
                        {l.subcategory ? ` • ${l.subcategory}` : ""}
                      </p> */}
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 whitespace-nowrap">
                      Awaiting Approval
                    </span>
                  </div>

                  <p className="text-base font-medium text-green-700">
                    {l.price || "No price yet"}
                  </p>

                  <p className="text-sm text-gray-600">
                    {[l.location, l.city, l.state].filter(Boolean).join(", ") || "No location yet"}
                  </p>

                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(l.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}