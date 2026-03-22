"use client";

import { useRouter } from "next/navigation";
import FavoritesGrid from "@/components/FavoritesGrid";

export default function FavoritesPage() {
  const router = useRouter();
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">

      <button
        className="border px-3 py-2 rounded bg-[#8A715D]"
        onClick={() => router.push("/profile")}
      >Back to Home</button>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Favorites</h1>
      <FavoritesGrid />
    </div>
  );
}