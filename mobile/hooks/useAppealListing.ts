import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import type { AppealListing } from "@/types/marketplace";
import { getAppealListing, submitAppeal as submitAppealRequest } from "@/features/appeals/api";
import { updateListing } from "@/features/listings/form-api";

type ErrorResponse = {
  message?: string;
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
      const data = await getAppealListing(listingId);
      setListing(data);
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

      await updateListing(listingId, formData);
      await submitAppealRequest(listingId, appealMessage);
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