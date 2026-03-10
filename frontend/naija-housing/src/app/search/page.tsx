"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/libs/api";
import Link from "next/link";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/listings?${searchParams.toString()}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) return <p className="p-6">Searching properties...</p>;

  if (results.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">
        ❌ Property not found
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {results.map((listing) => (
        <Link key={listing._id} href={`/listings/${listing._id}`}>
          <img
            src={
              listing.images?.[0]
              ? `http://localhost:5000${listing.images[0]}`
              : "/placeholder.jpg"
            }
            className="w-full h-40 object-cover"
            alt={listing.title}
          />
          <p className="font-bold">{listing.title}</p>
          <p className="">{listing.location}</p>
          <p className="text-green-600">₦{listing.price}</p>
        </Link>
      ))}
    </div>
  );
}