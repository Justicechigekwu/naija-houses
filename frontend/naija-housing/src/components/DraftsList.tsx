"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/libs/api";
import type { Listing } from "@/types/listing";

export default function DraftList({
  drafts,
  onDeleted,
}: {
  drafts: Listing[];
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleContinue = (draft: Listing) => {
    if (draft.publishPlan === "PAID_30_DAYS") {
      router.push(`/listings/${draft._id}/payment-details`);
      return;
    }

    router.push(`/create-listing/${draft._id}`);
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Clear this draft? This will delete it permanently.");
    if (!ok) return;

    setDeletingId(id);
    try {
      await api.delete(`/listings/drafts/${id}`);
      onDeleted();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Continue where you left off</h2>

      <div className="space-y-3">
        {drafts.map((d) => (
          <div
            key={d._id}
            className="bg-white border rounded-md p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-lg font-medium">
                {d.title?.trim() ? d.title : "Untitled draft"}
              </div>
              <div className="text-sm text-gray-600">
                {d.category || "PROPERTY"} • Last updated{" "}
                {d.updatedAt ? new Date(d.updatedAt).toLocaleString() : ""}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleContinue(d)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {d.publishPlan === "PAID_30_DAYS" ? "Publish" : "Continue"}
              </button>

              <button
                onClick={() => handleDelete(d._id)}
                disabled={deletingId === d._id}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId === d._id ? "Deleting..." : "Clear"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}