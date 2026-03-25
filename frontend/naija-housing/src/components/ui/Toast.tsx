"use client";

import Image from "next/image";
import { CheckCircle, AlertCircle, Info, TriangleAlert, X } from "lucide-react";
import { ToastType } from "@/context/UiContext";

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="h-3 w-3 text-emerald-400" />,
    error: <AlertCircle className="h-3 w-3 text-red-400" />,
    warning: <TriangleAlert className="h-3 w-3 text-yellow-400" />,
    info: <Info className="h-3 w-3 text-sky-400" />,
  };

  return (
    <div
      className="
        animate-toast-float
        min-w-[280px] max-w-[92vw]
        rounded-full
        border border-white/10
        bg-[#1b1b1b]
        px-5 py-3
        shadow-2xl
      "
    >
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center shrink-0">
          <Image
            src="/symbol.png"
            alt="Velora"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
        </div>

        <div className="flex-1 text-sm font-medium text-white">
          {message}
        </div>

        <div className="shrink-0">{icons[type]}</div>

      </div>
    </div>
  );
}