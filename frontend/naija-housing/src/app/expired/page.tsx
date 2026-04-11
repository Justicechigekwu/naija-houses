"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/libs/api";
import ExpiredListings from "@/components/ExpiredListings";
import type { Listing } from "@/types/listing";
import { useRouter } from "next/navigation";
import PageReadyLoader from "@/components/pages/PageReadyLoader";
import { useUI } from "@/hooks/useUi";
import { ArrowLeft, Clock } from "lucide-react";

type ApiErrorResponse = {
  message?: string;
};

export default function ExpiredPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useUI();

  const fetchExpired = async () => {
    try {
      setLoading(true);
      const res = await api.get<Listing[]>("/listings/me/expired");
      setItems(res.data || []);
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        error.response?.data?.message || "Failed to load expired listings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpired();
  }, []);

  return (
    <PageReadyLoader ready={!loading}>
      <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] via-white to-[#ededed]">
        <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Clock className="w-5 h-5 text-red-600" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Expired Listings
                </h1>
                <p className="text-sm text-gray-500">
                  Listings that are no longer active. Renew or remove them anytime.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ExpiredListings items={items} onRefresh={fetchExpired} />
          </div>

        </div>
      </div>
    </PageReadyLoader>
  );
}