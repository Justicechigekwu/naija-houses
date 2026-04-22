'use client';

import PendingListings from "@/components/PendingListings";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export default function PendingPage() {
  const router = useRouter();
  return(
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* <button
        onClick={() => router.push("/profile")}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button> */}
      
            
      <PendingListings />
    </div>
  );
}