// 'use client';

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import api from "@/libs/api";
// import { MapPin } from "lucide-react";
// import SearchBar from "@/components/SearchBar";

// interface Listing {
//   _id: string;
//   title: string;
//   price?: number;
//   state?: string;
//   location: string;
//   postedBy?: "Owner" | "Agent" | "Dealer" | "Seller";
//   images?: { url: string; public_id: string }[];
// }

// export default function Home() {
//   const [listings, setListings] = useState<Listing[]>([]);
//   const router = useRouter();

//   const handleAddListing = () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push(`/register?redirect=/listings/create`);
//     } else {
//       router.push('/listings/create');
//     }
//   };

//   const handleCardClick = (listingId: string) => {
//     router.push(`/listings/${listingId}`);
//   };

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         const res = await api.get('/listings');
//         setListings(res.data);
//       } catch (error) {
//         console.error('Failed to fetch listing', error);
//       }
//     };
//     fetchListing();
//   }, []);

//   return (
//     <div>
//       <div
//         className="
//           relative
//           min-h-[600px]
//           w-full
//           flex items-center justify-center
//           bg-cover bg-center
//           object-contain
//         "
//         style={{ backgroundImage: "url('/image/duplex.jpg')" }}
//       >
//         <div className="absolute inset-0 bg-black/50"></div>

//         <div className="relative z-10 w-full sm:w-[85%] lg:w-[70%] mx-auto py-24 px-32">
//           <div className="text-center mx-auto">
//             <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-6xl text-white font-bold text-justify">
//               Trade smart. Live better.
//             </h1>
//             <p className="mt-6 text-lg md:text-xl text-white max-w-3x1 max-auto text-justify">
//               Our platform is a digitally integrated real estate marketplace that enables users to buy, sell, and rent properties seamlessly from the comfort of their homes. While giving property owners direct exposure to millions of potential buyers and tenants.
//             </p>
//           </div>

//           <div className="mt-10">
//             <SearchBar />
//           </div>
//         </div>
//       </div>

//       <div className="p-6 bg-[#F5F5F5]">
//         {listings.length === 0 && (
//           <div className="flex justify-between items-center mb-6">
//             <button
//               className="bg-[#8A715D] hover:bg-[#7A6352] text-white px-4 py-2 rounded"
//               onClick={handleAddListing}
//             >
//               Add Listing
//             </button>
//           </div>
//         )}

//         {listings.length > 0 ? (
//           <div className="grid grid-cols-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {listings.map((listing) => (
//               <div
//                 key={listing._id}
//                 onClick={() => handleCardClick(listing._id)}
//                 className="w-full rounded shadow hover:shadow-lg transition bg-white cursor-pointer p-4"
//               >
//                 <div className="w-full flex justify-center items-center mb-3 bg-gray-100 rounded">
//                   <img
//                     src={listing.images?.[0]?.url || '/placeholder.jpg'}
//                     alt={listing.title}
//                     className="w-full h-48 object-cover rounded"
//                   />
//                 </div>

//                 <h2 className="text-xl font-semibold">{listing.title}</h2>

//                 <p className="text-green-600">
//                   ₦{Number(listing.price).toLocaleString()}
//                 </p>
//                 {/* <p className="text-green-600">
//                   ₦
//                   {listing.price && !isNaN(Number(listing.price))
//                     ? Number(listing.price).toLocaleString()
//                     : listing.price || 'N/A'}
//                 </p> */}

//                 <MapPin className="w-5 h-5 text-green-300 inline" />
//                 <p className="text-gray-500 text-sm inline">{listing.state}</p>,{" "}
//                 <span> </span>
//                 <p className="text-gray-500 text-sm inline">{listing.location}</p>

//                 <ul className="text-xs">
//                   <p>Posted by {listing.postedBy || "Owner"}</p>
//                 </ul>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No listing available yet, be the first to post a property</p>
//         )}
//       </div>
//     </div>
//   );
// }







// "use client";

// import { useRouter } from "next/navigation";
// import { MapPin } from "lucide-react";
// import SearchBar from "@/components/SearchBar";
// import useLocationFeed from "@/hooks/useLocationFeed";

// interface Listing {
//   _id: string;
//   title: string;
//   price?: number;
//   state?: string;
//   city?: string;
//   location: string;
//   postedBy?: "Owner" | "Agent" | "Dealer" | "Seller";
//   images?: { url: string; public_id: string }[];
//   distanceMeters?: number;
// }

// function formatDistance(distanceMeters?: number) {
//   if (!distanceMeters || distanceMeters <= 0 || distanceMeters > 900000000) {
//     return "";
//   }

//   if (distanceMeters < 1000) {
//     return `${Math.round(distanceMeters)}m away`;
//   }

//   return `${(distanceMeters / 1000).toFixed(1)}km away`;
// }

// export default function Home() {
//   const { listings, loading, error, userLocation } = useLocationFeed();
//   const router = useRouter();

//   const handleAddListing = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push(`/register?redirect=/listings/create`);
//     } else {
//       router.push("/listings/create");
//     }
//   };

//   const handleCardClick = (listingId: string) => {
//     router.push(`/listings/${listingId}`);
//   };

//   return (
//     <div>
//       <div
//         className="relative min-h-[600px] w-full flex items-center justify-center bg-cover bg-center object-contain"
//         style={{ backgroundImage: "url('/image/duplex.jpg')" }}
//       >
//         <div className="absolute inset-0 bg-black/50"></div>

//         <div className="relative z-10 w-full sm:w-[85%] lg:w-[70%] mx-auto py-24 px-6 md:px-12">
//           <div className="text-center mx-auto">
//             <h1 className="text-3xl sm:text-4xl md:text-6xl xl:text-6xl text-white font-bold text-left">
//               Trade smart. Live better.
//             </h1>

//             <p className="mt-6 text-lg md:text-xl text-white max-w-3xl text-left">
//               Our platform is a digitally integrated marketplace that helps users
//               buy, sell, and rent seamlessly.
//             </p>
//           </div>

//           <div className="mt-10">
//             <SearchBar />
//           </div>
//         </div>
//       </div>

//       <div className="p-6 bg-[#F5F5F5]">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h2 className="text-2xl font-bold">Listings near you</h2>
//             {!userLocation.loading && (
//               <p className="text-sm text-gray-600">
//                 {userLocation.city || userLocation.state
//                   ? `Showing closer results first around ${[userLocation.city, userLocation.state].filter(Boolean).join(", ")}`
//                   : "Showing best available results"}
//               </p>
//             )}
//           </div>

//           <button
//             className="bg-[#8A715D] hover:bg-[#7A6352] text-white px-4 py-2 rounded"
//             onClick={handleAddListing}
//           >
//             Add Listing
//           </button>
//         </div>

//         {loading ? (
//           <p>Loading listings...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : listings.length > 0 ? (
//           <div className="grid grid-cols-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {listings.map((listing) => (
//               <div
//                 key={listing._id}
//                 onClick={() => handleCardClick(listing._id)}
//                 className="w-full rounded shadow hover:shadow-lg transition bg-white cursor-pointer p-4"
//               >
//                 <div className="w-full flex justify-center items-center mb-3 bg-gray-100 rounded">
//                   <img
//                     src={listing.images?.[0]?.url || "/placeholder.jpg"}
//                     alt={listing.title}
//                     className="w-full h-48 object-cover rounded"
//                   />
//                 </div>

//                 <h2 className="text-xl font-semibold line-clamp-2">{listing.title}</h2>

//                 <p className="text-green-600 font-semibold">
//                   ₦{Number(listing.price || 0).toLocaleString()}
//                 </p>

//                 <div className="mt-1 text-gray-500 text-sm">
//                   <MapPin className="w-4 h-4 inline mr-1" />
//                   <span>{listing.city || listing.location}, {listing.state}</span>
//                 </div>

//                 {listing.distanceMeters ? (
//                   <p className="mt-1 text-xs text-[#8A715D] font-medium">
//                     {formatDistance(listing.distanceMeters)}
//                   </p>
//                 ) : null}

//                 <p className="text-xs mt-2">Posted by {listing.postedBy || "Owner"}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No listing available yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }




"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import api from "@/libs/api";
import useUserLocation from "@/hooks/useUserLocation";

interface Listing {
  _id: string;
  title: string;
  price?: number;
  state?: string;
  city?: string;
  location: string;
  postedBy?: "Owner" | "Agent" | "Dealer" | "Seller";
  images?: { url: string; public_id: string }[];
  distanceMeters?: number;
}

function formatDistance(distanceMeters?: number) {
  if (!distanceMeters || distanceMeters <= 0 || distanceMeters > 900000000) {
    return "";
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m away`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km away`;
}

export default function Home() {
  const router = useRouter();
  const userLocation = useUserLocation();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAddListing = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/register?redirect=/listings/create`);
    } else {
      router.push("/listings/create");
    }
  };

  const handleCardClick = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");

        let response;

        if (
          userLocation.latitude !== null &&
          userLocation.longitude !== null
        ) {
          try {
            response = await api.get("/listings/feed/location", {
              params: {
                page: 1,
                limit: 20,
                lat: userLocation.latitude,
                lng: userLocation.longitude,
                city: userLocation.city || "",
                state: userLocation.state || "",
              },
            });

            const locationListings = response.data?.listings || [];

            if (locationListings.length > 0) {
              setListings(locationListings);
              return;
            }
          } catch (locationError) {
            console.error("Location feed failed, falling back:", locationError);
          }
        }

        const fallbackRes = await api.get("/listings");
        setListings(fallbackRes.data || []);
      } catch (err: any) {
        console.error("Failed to fetch listings", err);
        setError(err?.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    if (!userLocation.loading) {
      fetchListings();
    }
  }, [
    userLocation.loading,
    userLocation.latitude,
    userLocation.longitude,
    userLocation.city,
    userLocation.state,
  ]);

  const sectionTitle =
    userLocation.city || userLocation.state
      ? "Trending in your location"
      : "Recommended for you";

  return (
    <div>
      <div
        className="
          relative
          min-h-[600px]
          w-full
          flex items-center justify-center
          bg-cover bg-center
          object-contain
        "
        style={{ backgroundImage: "url('/image/duplex.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        {/* <div className="relative z-10 w-full sm:w-[85%] lg:w-[70%] mx-auto py-24 px-32">
          <div className="text-center mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-6xl text-white font-bold text-justify">
              Trade smart. Live better.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white max-w-3x1 max-auto text-justify">
              Our platform is a digitally integrated real estate marketplace that enables users to buy, sell, and rent properties seamlessly from the comfort of their homes. While giving property owners direct exposure to millions of potential buyers and tenants.
            </p>
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>
        </div> */}

        <div className="relative z-10 w-full sm:w-[85%] lg:w-[70%] mx-auto py-24 px-6 md:px-12">
          <div className="text-center mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl xl:text-6xl text-white font-bold text-left">
              Trade smart. Live better.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-white max-w-3xl text-left">
              Our platform is a digitally integrated marketplace that helps users
              buy, sell, and rent seamlessly.
            </p>
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="p-6 bg-[#F5F5F5]">
        {listings.length === 0 && !loading && (
          <div className="flex justify-between items-center mb-6">
            <button
              className="bg-[#8A715D] hover:bg-[#7A6352] text-white px-4 py-2 rounded"
              onClick={handleAddListing}
            >
              Add Listing
            </button>
          </div>
        )}

        {!loading && listings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{sectionTitle}</h2>
          </div>
        )}

        {loading ? (
          <p>Loading listings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => handleCardClick(listing._id)}
                className="w-full rounded shadow hover:shadow-lg transition bg-white cursor-pointer p-4"
              >
                <div className="w-full flex justify-center items-center mb-3 bg-gray-100 rounded">
                  <img
                    src={listing.images?.[0]?.url || "/placeholder.jpg"}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>

                <h2 className="text-xl font-semibold">{listing.title}</h2>

                <p className="text-green-600">
                  ₦{Number(listing.price || 0).toLocaleString()}
                </p>

                <MapPin className="w-5 h-5 text-green-300 inline" />
                <p className="text-gray-500 text-sm inline">{listing.state}</p>,{" "}
                <span> </span>
                <p className="text-gray-500 text-sm inline">
                  {listing.city || listing.location}
                </p>

                {listing.distanceMeters ? (
                  <p className="mt-1 text-xs text-[#8A715D] font-medium">
                    {formatDistance(listing.distanceMeters)}
                  </p>
                ) : null}

                <ul className="text-xs">
                  <p>Posted by {listing.postedBy || "Owner"}</p>
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No listing available yet, be the first to post a property</p>
        )}
      </div>
    </div>
  );
}