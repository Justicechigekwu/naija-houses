'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/libs/api";
import { MapPin } from "lucide-react";
import SearchBar from "@/components/SearchBar";

interface Listing {
  _id: string;
  title: string;
  price?: string;
  state?: string;
  location: string;
  postedBy?: "Owner" | "Agent" | "Dealer" | "Seller";
  images?: string[];
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const router = useRouter();

  const handleAddListing = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(`/register?redirect=/listings/create`);
    } else {
      router.push('/listings/create');
    }
  };

  const handleCardClick = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get('/listings');
        setListings(res.data);
      } catch (error) {
        console.error('Failed to fetch listing', error);
      }
    };
    fetchListing();
  }, []);

  return (
    <div>

      {/* <div className="h-[600px] items-center w-[70%] mx-auto justify-center py-24"> */}

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
        
          <div className="relative z-10 w-full sm:w-[85%] lg:w-[70%] mx-auto py-24 px-32">
            <div className="text-center mx-auto" >
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-6xl text-white font-bold text-justify">
                Buy or sell anythimg <br/> you want with ease
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white max-w-3x1 max-auto text-justify">
                Our platform is a digitally integrated real estate marketplace that enables users to buy, sell, and rent properties seamlessly from the comfort of their homes. While giving property owners direct exposure to millions of potential buyers and tenants.
              </p>
            </div>
            
            <div className="mt-10">
              <SearchBar/>
            </div>
          </div>
        </div>
        <div className="p-6 bg-[#F5F5F5]">
         {listings.length === 0 && (
           <div className="flex justify-between items-center mb-6">
             <button
               className="bg-[#8A715D] hover:bg-[#7A6352] text-white px-4 py-2 rounded"
               onClick={handleAddListing}
             >
               Add Listing
             </button>
           </div>
         )}
   
         {listings.length > 0 ? (
           <div className="grid grid-cols-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
             {listings.map((listing) => (
               <div
                 key={listing._id}
                 onClick={() => handleCardClick(listing._id)}
                 className=" w-full rounded shadow hover:shadow-lg transition bg-white cursor-pointer p-4"
               >
                 <div className="w-full  flex justify-center items-center mb-3 bg-gray-100 rounded">
                   <img
                     src={
                       listing.images?.[0]
                         ? `http://localhost:5000${listing.images[0]}`
                         : '/placeholder.jpg'
                     }
                     alt={listing.title}
                     className="w-full h-48 object-cover rounded"
                   />
                 </div>
                 <h2 className="text-xl font-semibold">{listing.title}</h2>
                 <p className="text-green-600 ">
                   ₦
                   {listing.price && !isNaN(Number(listing.price))
                     ? Number(listing.price).toLocaleString()
                     : listing.price || 'N/A'}
                 </p> 
                 <MapPin className="w-5 h-5 text-green-300 inline" />
                 <p className="text-gray-500 text-sm inline">{listing.state}</p>,{" "}
                 <span> </span>
                 <p className="text-gray-500 text-sm inline">{listing.location}</p>
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
