'use client';

import PendingListings from "@/components/PendingListings";
import { useRouter } from "next/navigation";


export default function PendingPage() {
  const router = useRouter();
  return(
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <button
        className="border px-3 py-2 rounded bg-[#8A715D]"
        onClick={() => router.push("/profile")}
      >Back to Home</button>
      
            
      <PendingListings />
    </div>
  );
}