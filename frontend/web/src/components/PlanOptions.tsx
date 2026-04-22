"use client";

import type { ReactNode } from "react";

export default function PlanOptions ({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#F5F5F5] via-[#F5F5F5] to-[#E5E5E5]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen  max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {(title || subtitle) && (
            <div className="mb-6 text-center">
              {title && <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>}
              {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
            </div>
          )}

          <div className="rounded-2xl border border-gray-200  p-6 shadow-sm bg-gradient-to-b from-[#F5F5F5] via-[#F5F5F5] to-[#E5E5E5] backdrop-blur">
            {children}
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Secured checkout • Manual bank transfer confirmation
          </p>
        </div>
      </div>
    </div>
  );
}