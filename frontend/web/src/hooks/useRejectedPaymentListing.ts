"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/libs/api";
import type { Listing, RejectionType } from "@/types/listing";

type ErrorResponse = {
  message?: string;
};

export type RejectedPaymentListing = Listing & {
  rejectionType?: RejectionType;
  rejectionReason?: string;
  rejectedAt?: string | null;
};

export default function useRejectedPaymentListing(listingId: string) {
  const [listing, setListing] = useState<RejectedPaymentListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadListing = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get<RejectedPaymentListing>(
        `/listings/${listingId}/rejected-payment`
      );

      setListing(res.data);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      setError(
        err.response?.data?.message || "Failed to load rejected payment listing"
      );
      setListing(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!listingId) return;
    loadListing();
  }, [listingId]);

  return {
    listing,
    loading,
    error,
    reload: loadListing,
  };
}