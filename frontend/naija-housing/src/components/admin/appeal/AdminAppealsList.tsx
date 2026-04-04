"use client";

import { useState } from "react";
import Link from "next/link";
import useAdminAppeals from "@/hooks/useAdminAppeals";

const policyLinks: Record<string, string> = {
  PROHIBITED_ITEMS: "/prohibited-items",
  COMMUNITY_GUIDELINES: "/community-guidelines",
  TERMS: "/terms",
  SAFETY: "/safety-tips",
  FRAUD: "/safety-tips",
  OTHER: "/appeal-policy",
};

const policyLabels: Record<string, string> = {
  PROHIBITED_ITEMS: "Prohibited Items Policy",
  COMMUNITY_GUIDELINES: "Community Guidelines",
  TERMS: "Terms & Conditions",
  SAFETY: "Safety Tips",
  FRAUD: "Safety Tips",
  OTHER: "Appeal Policy",
};

export default function AdminAppealsList() {
  const { appeals, loading, error, processingId, approveAppeal, rejectAppeal } =
    useAdminAppeals();

  const [noteById, setNoteById] = useState<Record<string, string>>({});

  if (loading) {
    return <div className="bg-white border rounded-xl p-4">Loading appeals...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 border rounded-xl p-4">{error}</div>;
  }

  if (!appeals.length) {
    return <div className="bg-white border rounded-xl p-4">No pending appeals found.</div>;
  }

  return (
    <div className="space-y-4">
      {appeals.map((appeal) => {
        const isProcessing = processingId === appeal._id;
        const policyKey = appeal.violationPolicy || "OTHER";
        const policyHref = policyLinks[policyKey] || "/appeal-policy";
        const policyLabel = policyLabels[policyKey] || "Appeal Policy";

        return (
          <div key={appeal._id} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 rounded bg-yellow-100 text-sm">
                {appeal.appealStatus}
              </span>
              <span className="px-2 py-1 rounded bg-gray-100 text-sm">
                {appeal.publishStatus}
              </span>
            </div>

            <h2 className="text-lg font-semibold">{appeal.title}</h2>

            <p className="text-sm text-gray-600 mt-1">
              Owner: {appeal.owner?.firstName} {appeal.owner?.lastName} ({appeal.owner?.email})
            </p>

            {appeal.adminRemovalReason && (
              <div className="mt-3 p-3 rounded bg-red-50 border border-red-200">
                <p className="text-sm font-medium">Admin removal reason</p>
                <p className="text-sm text-gray-700 mt-1">{appeal.adminRemovalReason}</p>
              </div>
            )}

            {appeal.violationPolicy && (
              <div className="mt-3 p-3 rounded bg-yellow-50 border border-yellow-200">
                <p className="text-sm font-medium">Violated policy</p>
                <Link
                  href={policyHref}
                  className="text-sm text-blue-600 underline mt-1 inline-block"
                  target="_blank"
                >
                  {policyLabel}
                </Link>
              </div>
            )}

            {appeal.appealMessage && (
              <div className="mt-3 p-3 rounded bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium">User appeal message</p>
                <p className="text-sm text-gray-700 mt-1">{appeal.appealMessage}</p>
              </div>
            )}

            {appeal.description && (
              <p className="text-sm text-gray-700 mt-3">{appeal.description}</p>
            )}

            <textarea
              value={noteById[appeal._id] || ""}
              onChange={(e) =>
                setNoteById((prev) => ({
                  ...prev,
                  [appeal._id]: e.target.value,
                }))
              }
              rows={3}
              className="w-full border rounded-xl px-3 py-2 mt-4"
              placeholder="Optional rejection note..."
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => approveAppeal(appeal._id)}
                disabled={isProcessing}
                className={`px-4 py-2 rounded text-white ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:opacity-90"
                }`}
              >
                {isProcessing ? "Processing..." : "Approve Appeal"}
              </button>

              <button
                onClick={() => rejectAppeal(appeal._id, noteById[appeal._id] || "")}
                disabled={isProcessing}
                className={`px-4 py-2 rounded text-white ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:opacity-90"
                }`}
              >
                {isProcessing ? "Processing..." : "Reject Appeal"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}