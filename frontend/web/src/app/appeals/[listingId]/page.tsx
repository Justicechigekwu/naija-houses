"use client";

import { useParams } from "next/navigation";
import AppealListingForm from "@/components/appeals/AppealListingForm";

export default function AppealPage() {
  const params = useParams();
  const listingId = String(params?.listingId || "");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Listing Appeal</h1>
      <AppealListingForm listingId={listingId} />
    </div>
  );
}