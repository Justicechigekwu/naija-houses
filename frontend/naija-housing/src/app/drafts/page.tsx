"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/libs/api";
import DraftList from "@/components/DraftsList";
import type { Listing } from "@/types/listing";
import { useRouter } from "next/navigation";
import { useUI } from "@/hooks/useUi";
import PageReadyLoader from "@/components/pages/PageReadyLoader";

type ErrorResponse = {
  message?: string;
};

export default function DraftPage() {
  const [drafts, setDrafts] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useUI();

  const fetchDrafts = async () => {
    try {
      const res = await api.get<Listing[]>("/listings/me/drafts");
      setDrafts(res.data || []);
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      showToast(
        error?.response?.data?.message || "Failed to load drafts",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  return (
    <PageReadyLoader ready={!loading}>
      <div className="min-h-screen bg-gradient-to-b from-[#f8f6f3] via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => router.push("/profile")}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e7ded6] bg-white px-4 py-2.5 text-sm font-medium text-[#5b4a3d] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#faf7f4] hover:shadow"
            >
              <span className="text-base">←</span>
              <span>Back to home</span>
            </button>
          </div>

          {/* Hero / page intro */}
          <div className="mb-6 rounded-3xl border border-[#eee5dd] bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 inline-flex rounded-full bg-[#f3ece6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A715D]">
                  Workspace
                </p>
                <h1 className="text-2xl tracking-tight text-gray-900 sm:text-4xl">
                  Drafts
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                  Publish your pending drafts to sell it instantly
                </p>
              </div>

              <div className="rounded-2xl border border-[#efe6df] bg-[#fcfaf8] px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                  Total drafts
                </p>
                <p className="mt-1 text-2xl font-semibold text-[#8A715D]">
                  {drafts.length}
                </p>
              </div>
            </div>
          </div>

          {/* Draft list container */}
          <div className="rounded-3xl border border-[#eee5dd] bg-white p-4 shadow-sm sm:p-6">
            <DraftList drafts={drafts} onDeleted={fetchDrafts} />
          </div>
        </div>
      </div>
    </PageReadyLoader>
  );
}