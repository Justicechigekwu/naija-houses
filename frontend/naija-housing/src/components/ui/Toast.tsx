"use client";

import { CheckCircle, AlertCircle, Info, TriangleAlert, X } from "lucide-react";
import { ToastType } from "@/context/UIContext";

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const styles = {
    success: {
      container: "bg-green-600 text-white",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      container: "bg-red-600 text-white",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    warning: {
      container: "bg-yellow-500 text-black",
      icon: <TriangleAlert className="w-5 h-5" />,
    },
    info: {
      container: "bg-blue-600 text-white",
      icon: <Info className="w-5 h-5" />,
    },
  };

  return (
    <div
      className={`
        min-w-[280px] max-w-sm rounded-xl shadow-lg px-4 py-3
        flex items-start gap-3 animate-toast-in
        ${styles[type].container}
      `}
    >
      <div className="shrink-0 mt-0.5">{styles[type].icon}</div>

      <div className="flex-1 text-sm font-medium leading-5">{message}</div>

      <button
        onClick={onClose}
        className="shrink-0 opacity-80 hover:opacity-100 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}