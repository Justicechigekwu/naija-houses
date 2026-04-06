"use client";

import useAdminSupportMessages from "@/hooks/useAdminSupportMessages";
import { useUI } from "@/hooks/useUi";

export default function AdminSupportList() {
  const { messages, loading, error, updateStatus } = useAdminSupportMessages();
  const { showToast } = useUI();

  if (loading) {
    return <div className="bg-white border rounded-xl p-4">Loading support messages...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 border rounded-xl p-4">{error}</div>;
  }

  if (!messages.length) {
    return <div className="bg-white border rounded-xl p-4">No support messages found.</div>;
  }

  return (
    <div className="space-y-4">
      {messages.map((item) => {
        const replyHref = `mailto:${item.email}?subject=${encodeURIComponent(
          `Re: ${item.reason}`
        )}`;

        return (
          <div key={item._id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                {item.status}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">{item.reason}</h2>

            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p><strong>Name:</strong> {item.fullName}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Phone:</strong> {item.phone || "-"}</p>
              <p><strong>Address:</strong> {item.address || "-"}</p>
            </div>

            <div className="mt-4 rounded-xl border bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-800">{item.message}</p>
            </div>

            {item.adminReplyNote ? (
              <div className="mt-4 rounded-xl border bg-yellow-50 p-4">
                <p className="text-sm font-medium text-gray-900">Admin note</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {item.adminReplyNote}
                </p>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={replyHref}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Reply by email
              </a>

              <button
                onClick={async () => {
                  try {
                    await updateStatus(item._id, "IN_PROGRESS");
                    showToast("Marked as in progress", "success");
                  } catch {
                    showToast("Failed to update status", "error");
                  }
                }}
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Mark In Progress
              </button>

              <button
                onClick={async () => {
                  try {
                    await updateStatus(item._id, "RESOLVED");
                    showToast("Marked as resolved", "success");
                  } catch {
                    showToast("Failed to update status", "error");
                  }
                }}
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}