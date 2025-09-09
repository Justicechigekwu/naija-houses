'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/libs/api";
import { MapPin } from "lucide-react";

interface Listing {
  _id: string;
  title: string;
  price?: string;
  state?: string;
  location: string;
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
    <div className="p-6 bg-[#F5F5F5]">
      {listings.length === 0 && (
        <div className="flex justify-between items-center mb-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
                  className="w-full h-48 object-fit rounded"
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
            </div>
          ))}
        </div>
      ) : (
        <p>No listing available yet, be the first to post a property</p>
      )}
    </div>
  );
}
