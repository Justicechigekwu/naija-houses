"use client";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmVariant?: "danger" | "primary";
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirmVariant = "primary",
  onClose,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmButtonStyle =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-6 shadow-2xl animate-modal-in">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-100">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel || onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-100 transition hover:bg-gray-200 hover:text-gray-900"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${confirmButtonStyle}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}