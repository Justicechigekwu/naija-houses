"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import ExpiredListings from "@/components/ExpiredListings";
import type { Listing } from "@/types/listing";
import { useRouter } from "next/navigation";

export default function ExpiredPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchExpired = async () => {
    try {
      setLoading(true);
      const res = await api.get("/listings/me/expired");
      setItems(res.data || []);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to load expired listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpired();
  }, []);

  if (loading) {
    return <div className="max-w-5xl mx-auto p-4">Loading expired listings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">

      <button
        className="border px-3 py-2 rounded bg-[#8A715D]"
        onClick={() => router.push("/profile")}
      >Back to Home</button>

      <h1 className="text-2xl font-semibold">Expired Listings</h1>
      <ExpiredListings items={items} onRefresh={fetchExpired} />
    </div>
  );
}