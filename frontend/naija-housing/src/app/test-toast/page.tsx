"use client";

import { useUI } from "@/hooks/useUi";

export default function TestToastPage() {
  const { showToast, showConfirm } = useUI();

  return (
    <div className="p-10 flex flex-col gap-4">
      <button
        onClick={() => showToast("Deleted successfully", "success")}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Show Success Toast
      </button>

      <button
        onClick={() => showToast("Something went wrong", "error")}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Show Error Toast
      </button>

      <button
        onClick={() =>
          showConfirm(
            {
              title: "Delete listing",
              message: "Are you sure you want to delete this listing?",
              confirmText: "Delete",
              cancelText: "Cancel",
              confirmVariant: "danger",
            },
            () => {
              showToast("Deleted successfully", "success");
            }
          )
        }
        className="bg-black text-white px-4 py-2 rounded"
      >
        Show Confirm Modal
      </button>
    </div>
  );
}