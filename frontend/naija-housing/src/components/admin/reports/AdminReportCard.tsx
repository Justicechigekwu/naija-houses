"use client";

import { AdminReportRow } from "@/hooks/useAdminReports";

export default function AdminReportCard({
  report,
  onReview,
  onDismiss,
  onResolve,
  onDeleteListing,
  onDeleteUser,
  onClear,
  deletingListing = false,
  deletingUser = false,
  clearing = false,
}: {
  report: AdminReportRow;
  onReview: () => void;
  onDismiss: () => void;
  onResolve: () => void;
  onDeleteListing: () => void;
  onDeleteUser: () => void;
  onClear: () => void;
  deletingListing?: boolean;
  deletingUser?: boolean;
  clearing?: boolean;
}) {
  const reportHandled = ["RESOLVED", "DISMISSED"].includes(report.status);

  const listingDeleteDisabled =
    reportHandled || !report.targetListing?._id || deletingListing;

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-1 rounded bg-gray-100 text-sm">
          {report.targetType}
        </span>
        <span className="px-2 py-1 rounded bg-red-100 text-sm">
          {report.reason}
        </span>
        <span className="px-2 py-1 rounded bg-yellow-100 text-sm">
          {report.status}
        </span>
      </div>

      <p className="text-sm text-gray-700">
        Reported by: {report.reportedBy?.firstName} {report.reportedBy?.lastName} (
        {report.reportedBy?.email})
      </p>

      {report.targetType === "USER" && report.targetUser && (
        <p className="text-sm mt-2">
          Reported user: {report.targetUser.firstName} {report.targetUser.lastName} (
          {report.targetUser.email})
        </p>
      )}

      {report.targetType === "LISTING" && (
        <p className="text-sm mt-2">
          Reported listing:{" "}
          {report.targetListing?._id
            ? `${report.targetListing.title} (${report.targetListing.publishStatus})`
            : "This listing is no longer available"}
        </p>
      )}

      {report.message && (
        <p className="mt-3 text-sm text-gray-800 border-t pt-3">
          {report.message}
        </p>
      )}

      {report.adminNote && (
        <p className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Admin note:</span> {report.adminNote}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {!reportHandled && (
          <>
            <button
              onClick={onReview}
              className="px-3 py-2 rounded border hover:bg-gray-50"
            >
              Mark Reviewed
            </button>

            <button
              onClick={onDismiss}
              className="px-3 py-2 rounded border hover:bg-gray-50"
            >
              Dismiss
            </button>

            <button
              onClick={onResolve}
              className="px-3 py-2 rounded border hover:bg-gray-50"
            >
              Resolve
            </button>
          </>
        )}

        {report.targetType === "LISTING" && (
          <button
            onClick={onDeleteListing}
            disabled={listingDeleteDisabled}
            className={`px-3 py-2 rounded text-white ${
              listingDeleteDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:opacity-90"
            }`}
          >
            {deletingListing
              ? "Deleting..."
              : reportHandled
              ? "Handled"
              : "Delete Listing"}
          </button>
        )}

        {report.targetUser?._id && (
          <button
            onClick={onDeleteUser}
            disabled={deletingUser || reportHandled}
            className={`px-3 py-2 rounded text-white ${
              deletingUser || reportHandled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-700 hover:opacity-90"
            }`}
          >
            {deletingUser ? "Deleting..." : "Delete User"}
          </button>
        )}

        <button
          onClick={onClear}
          disabled={clearing}
          className={`px-3 py-2 rounded border ${
            clearing ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
          }`}
        >
          {clearing ? "Clearing..." : "Clear Report"}
        </button>
      </div>
    </div>
  );
}