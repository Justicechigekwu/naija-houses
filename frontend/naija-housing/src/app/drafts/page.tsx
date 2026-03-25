"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import DraftList from "@/components/DraftsList";
import type { Listing } from "@/types/listing";
import { useRouter } from "next/navigation";
import { useUI } from "@/hooks/useUi";
import PageReadyLoader from "@/components/pages/PageReadyLoader";

export default function DraftPage() {
  const [drafts, setDrafts] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useUI();

  const fetchDrafts = async () => {
    try {
      const res = await api.get("/listings/me/drafts");
      setDrafts(res.data || []);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to load drafts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  return (
    <PageReadyLoader ready={!loading}>
      <div className="p-4">
        <button
          className="border px-3 py-2 rounded bg-[#8A715D]"
          onClick={() => router.push("/profile")}
        >
          back to home
        </button>

        <DraftList drafts={drafts} onDeleted={fetchDrafts} />
      </div>
    </PageReadyLoader>
  );
}