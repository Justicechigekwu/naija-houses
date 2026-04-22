"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminAnalyticsSection from "@/components/admin/AdminAnalyticsSection";
import useRequireAdminAuth from "@/hooks/useRequireAdminAuth";
import { Activity, BarChart3 } from "lucide-react";

export default function AdminPerformancePage() {
  const { isCheckingAuth, isAuthenticated } = useRequireAdminAuth();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] via-white to-[#f1f1f1]">
        <div className="p-6 text-sm text-gray-600">Checking admin session...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] via-white to-[#f1f1f1]">
      <AdminNavbar />

      <div className="mx-auto mt-8 max-w-6xl px-4 pb-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur md:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#8A715D]/15 bg-[#8A715D]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A715D]">
                <Activity className="h-3.5 w-3.5" />
                Analytics Overview
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                Performance
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
                View visitor trends, top categories, and top subcategories in a
                cleaner, more actionable dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A715D] to-[#6f5a49] text-white shadow-sm">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                  Admin Insights
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Marketplace performance
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AdminAnalyticsSection />
        </div>
      </div>
    </div>
  );
}