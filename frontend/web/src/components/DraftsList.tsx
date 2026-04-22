"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/libs/api";
import type { Listing } from "@/types/listing";

type ChoosePlanResponse = {
  payment?: {
    paymentCode?: string;
  };
};

export default function DraftList({
  drafts,
  onDeleted,
}: {
  drafts: Listing[];
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handlePublish = async (draft: Listing) => {
    try {
      setPublishingId(draft._id);

      const res = await api.post<ChoosePlanResponse>(
        `/listings/${draft._id}/choose-plan`,
        {
          plan: "PAID_30_DAYS",
        }
      );

      const code = res.data?.payment?.paymentCode || "";
      router.push(
        `/listing-actions/${draft._id}/payment-details?code=${encodeURIComponent(code)}`
      );
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      alert(error?.response?.data?.message || "Failed to continue to payment");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Clear this draft? This will delete it permanently.");
    if (!ok) return;

    setDeletingId(id);
    try {
      await api.delete(`/listings/drafts/${id}`);
      onDeleted();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      alert(error?.response?.data?.message || "Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h3 className="text-2xl text-center font-semibold">Unpublished adverts</h3>

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
                onClick={() => handlePublish(d)}
                disabled={publishingId === d._id}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
              >
                {publishingId === d._id ? "Processing..." : "Publish"}
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