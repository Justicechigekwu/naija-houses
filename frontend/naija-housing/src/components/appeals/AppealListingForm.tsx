"use client";

import { useState } from "react";
import ListingForm from "@/components/ListingForm";
import useAppealListing from "@/hooks/useAppealListing";
import { useRouter } from "next/navigation";
import { useUI } from "@/hooks/useUi";

export default function AppealListingForm({
  listingId,
}: {
  listingId: string;
}) {
  const router = useRouter();
  const { listing, loading, submitting, error, submitAppeal } =
    useAppealListing(listingId);

  const [appealMessage, setAppealMessage] = useState("");
  const { showToast } = useUI();

  if (loading) {
    return <div>Loading removed listing...</div>;
  }

  if (!listing) {
    return <div>Listing not found.</div>;
  }

  const handleSubmit = async (formData: FormData) => {
    if (!appealMessage.trim()) {
      showToast("Please explain your appeal before submitting.", "error");
      return;
    }

    try {
      await submitAppeal(formData, appealMessage);
      showToast("Appeal submitted successfully", "error");
      router.push("/notification");
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h2 className="font-semibold mb-2">Appeal listing removal</h2>
        <p className="text-sm text-gray-700">
          Review your listing, make corrections if needed, and explain why it should be restored.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Appeal message
        </label>
        <textarea
          value={appealMessage}
          onChange={(e) => setAppealMessage(e.target.value)}
          rows={5}
          className="w-full border rounded-xl px-3 py-2"
          placeholder="Explain what you changed and why the listing should be restored..."
        />
      </div>

      <ListingForm
        initialData={listing}
        isEditMode={true}
        onSubmit={handleSubmit}
      />

      {submitting && <p className="text-sm text-gray-500">Submitting appeal...</p>}
    </div>
  );
}