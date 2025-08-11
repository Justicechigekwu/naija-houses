'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/libs/api";

interface Listing {
  _id: string;
  title: string;
  price: string;
  location: string;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);

    useEffect( () => {
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
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2x1 font-bold"> Available Listing</h1>
      <Link 
      href="/listings/create"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Listing
      </Link>
    </div>

    {listings.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map( (listing) => (
          <div
          key={listing._id}
          className="border rounded p-4 shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{listing.title}</h2>
            <p className="text-gray-600"> ₦{listing.price}</p>
            <p className="text-gray-500">{listing.location}</p>

            <Link 
            href={`/listings/${listing._id}`}
            className="text-blue-500 mt-2 inline-block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    ) : (
      <p>No listing available yet.</p>
    )}
    </div>
  );
}
