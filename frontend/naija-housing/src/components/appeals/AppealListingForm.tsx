"use client";

import Link from "next/link";
import { useState } from "react";
import ListingForm from "@/components/ListingForm";
import useAppealListing from "@/hooks/useAppealListing";
import { useRouter } from "next/navigation";
import { useUI } from "@/hooks/useUi";
import PageReadyLoader from "../pages/PageReadyLoader";

const policyLinks: Record<string, string> = {
  PROHIBITED_ITEMS: "/prohibited-items",
  COMMUNITY_GUIDELINES: "/community-guidelines",
  TERMS: "/terms",
  SAFETY: "/safety-tips",
  FRAUD: "/safety-tips",
  OTHER: "/appeal-policy",
};

const policyLabels: Record<string, string> = {
  PROHIBITED_ITEMS: "Prohibited Items Policy",
  COMMUNITY_GUIDELINES: "Community Guidelines",
  TERMS: "Terms & Conditions",
  SAFETY: "Safety Tips",
  FRAUD: "Safety Tips",
  OTHER: "Appeal Policy",
};

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

  const ready = !loading;

  if (!loading && !listing) {
    return <div>Listing not found.</div>;
  }

  const policyKey = listing?.violationPolicy || "OTHER";
  const policyHref = listing?.policyRoute || policyLinks[policyKey] || "/appeal-policy";
  const policyLabel = listing?.policyLabel || policyLabels[policyKey] || "Appeal Policy";

  const handleSubmit = async (formData: FormData) => {
    if (!appealMessage.trim()) {
      showToast("Please explain your appeal before submitting.", "error");
      return;
    }

    try {
      await submitAppeal(formData, appealMessage);
      showToast("Appeal submitted successfully", "success");
      router.push("/notification");
    } catch {
      showToast("Failed to submit appeal.", "error");
    }
  };

  return (
    <PageReadyLoader ready={ready}>
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h2 className="font-semibold mb-2">Appeal listing removal</h2>
          <p className="text-sm text-gray-700">
            Review your listing, make corrections if needed, and explain why it
            should be restored.
          </p>
        </div>

        {listing?.adminRemovalReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-medium text-red-700">
              Removal reason
            </p>
            <p className="mt-1 text-sm text-gray-700">
              {listing.adminRemovalReason}
            </p>

            <div className="mt-3">
              <Link
                href={policyHref}
                className="text-sm text-blue-600 underline"
              >
                Read related policy: {policyLabel}
              </Link>
            </div>
          </div>
        )}

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

        {listing && (
          <ListingForm
            initialData={listing}
            isEditMode={true}
            onSubmit={handleSubmit}
          />
        )}

        {submitting && (
          <p className="text-sm text-gray-500">Submitting appeal...</p>
        )}
      </div>
    </PageReadyLoader>
  );
}