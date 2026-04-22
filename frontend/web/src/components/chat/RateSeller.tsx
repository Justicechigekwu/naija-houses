"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/libs/api";

type EligibilityResponse = {
  canReview: boolean;
  alreadyReviewed: boolean;
  buyerMessageCount: number;
  sellerMessageCount: number;
  minimumRequired: number;
  existingReview?: {
    _id: string;
    rating: number;
    comment: string;
  } | null;
};

export default function RateSellerPrompt({
  listingId,
  chatId,
  refreshKey = 0,
}: {
  listingId: string;
  chatId: string;
  refreshKey?: number;
}) {
  const router = useRouter();
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    let active = true;

    const loadEligibility = async () => {
      try {
        const res = await api.get<EligibilityResponse>(
          `/reviews/eligibility/${listingId}`
        );

        if (!active) return;

        const data = res.data;

        if (data.alreadyReviewed) {
          setCanShow(false);
          return;
        }

        setCanShow(!!data.canReview);
      } catch (error) {
        if (!active) return;
        setCanShow(false);
      }
    };

    if (listingId) {
      loadEligibility();
    }

    return () => {
      active = false;
    };
  }, [listingId, refreshKey]);

  if (!canShow) return null;

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-[#eadfd6] bg-gradient-to-r from-[#f8f4f1] to-[#fcfbfa] shadow-sm">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">
            How was your conversation with this seller?
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Share your experience to help other buyers make better decisions.
          </p>
        </div>

        <button
          onClick={() =>
            router.push(`/listing-actions/${listingId}/reviews?from=chat&chatId=${chatId}`)
          }
          className="inline-flex items-center justify-center rounded-xl bg-[#8A715D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#755e4d]"
        >
          Rate Seller
        </button>
      </div>
    </div>
  );
}