"use client";

import { useState } from "react";
import useSubmitReport from "@/hooks/useSubmitReport";

const REPORT_REASONS = [
  "SCAM",
  "FAKE_ITEM",
  "FAKE_PRICE",
  "ABUSIVE_BEHAVIOR",
  "SPAM",
  "DUPLICATE",
  "PROHIBITED_ITEM",
  "MISLEADING_INFO",
  "OTHER",
];

export default function ReportChatTargetModal({
  open,
  targetType,
  targetId,
  targetLabel,
  onClose,
}: {
  open: boolean;
  targetType: "USER" | "LISTING";
  targetId?: string;
  targetLabel?: string;
  onClose: () => void;
}) {
  const { submitReport, isSubmitting } = useSubmitReport();
  const [reason, setReason] = useState("SCAM");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (!targetId) return;

    try {
      setError("");
      setSuccess("");

      await submitReport({
        targetType,
        targetId,
        reason,
        message,
      });

      setSuccess("Report submitted successfully.");

      setTimeout(() => {
        setReason("SCAM");
        setMessage("");
        setSuccess("");
        onClose();
      }, 800);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to submit report");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5">
        <h2 className="text-lg font-semibold mb-2">
          Report {targetType === "USER" ? "Seller" : "Listing"}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          {targetLabel ? `You are reporting: ${targetLabel}` : "Submit your report below."}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 outline-none"
            >
              {REPORT_REASONS.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Extra details
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Explain what happened..."
              className="w-full border rounded-xl px-3 py-2 outline-none resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !targetId}
              className={`px-4 py-2 rounded-xl text-white ${
                isSubmitting ? "bg-gray-400" : "bg-red-600 hover:opacity-90"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}