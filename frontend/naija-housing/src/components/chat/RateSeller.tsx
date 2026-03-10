"use client";
import { useRouter } from "next/navigation";

export default function RateSellerPrompt({ listingId }: { listingId: string }) {
  const router = useRouter();

  return (
    <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg my-3">
      <p className="text-sm text-yellow-800 font-medium mb-2">
        How was your conversation with this seller, Would you like to leave a review?
      </p>
      <button
        onClick={() => router.push(`/listings/${listingId}/reviews`)}
        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
      >
        Rate Seller
      </button>
    </div>
  );
}
