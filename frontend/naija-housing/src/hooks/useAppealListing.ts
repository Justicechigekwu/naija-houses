"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/libs/api";
import type { Listing } from "@/types/listing";

type ErrorResponse = {
  message?: string;
};

export type AppealListing = Listing & {
  violationPolicy?: string;
  policyRoute?: string;
  policyLabel?: string;
  adminRemovalReason?: string;
};

export default function useAppealListing(listingId: string) {
  const [listing, setListing] = useState<AppealListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadListing = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get<AppealListing>(`/listings/${listingId}/appeal`);
      setListing(res.data);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      setError(err.response?.data?.message || "Failed to load appeal listing");
    } finally {
      setLoading(false);
    }
  };

  const submitAppeal = async (formData: FormData, appealMessage: string) => {
    try {
      setSubmitting(true);
      setError("");

      await api.put(`/listings/${listingId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await api.post(`/listings/${listingId}/appeal`, {
        appealMessage,
      });
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      setError(err.response?.data?.message || "Failed to submit appeal");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!listingId) return;
    loadListing();
  }, [listingId]);

  return {
    listing,
    loading,
    submitting,
    error,
    reload: loadListing,
    submitAppeal,
  };
}