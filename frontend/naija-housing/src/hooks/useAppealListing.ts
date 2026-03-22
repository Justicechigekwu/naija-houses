"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";

export default function useAppealListing(listingId: string) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadListing = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/listings/${listingId}/appeal`);
      setListing(res.data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to load appeal listing");
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
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to submit appeal");
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