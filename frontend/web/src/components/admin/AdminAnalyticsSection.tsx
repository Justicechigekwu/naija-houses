"use client";

import useAdminAnalytics from "@/hooks/useAdminAnalytics";
import AdminVisitorsChart from "./AdminVisitorsChart";
import AdminTopActivity from "./AdminTopActivity";
import { BarChart3, LayoutGrid, Sparkles, TrendingUp } from "lucide-react";

export default function AdminAnalyticsSection() {
  const { data, loading, error } = useAdminAnalytics();

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-64 animate-pulse rounded bg-gray-100" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-64 animate-pulse rounded-3xl bg-gray-100" />
          <div className="h-64 animate-pulse rounded-3xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50/90 p-5 text-red-600 shadow-sm">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                Traffic
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                Visitor trends
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Compare recent marketplace traffic over 7 and 30 days.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                Categories
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                Top activity
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                See where user attention is strongest across major groups.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <LayoutGrid className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                Insights
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                Quick overview
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                A polished snapshot of marketplace performance.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8A715D]/10 text-[#8A715D]">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                Last 7 Days
              </p>
              <h3 className="text-base font-semibold text-gray-900">
                Visitors overview
              </h3>
            </div>
          </div>
          <AdminVisitorsChart title="Visitors - Last 7 Days" data={data.visitors7} />
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                Last 30 Days
              </p>
              <h3 className="text-base font-semibold text-gray-900">
                Visitors overview
              </h3>
            </div>
          </div>
          <AdminVisitorsChart title="Visitors - Last 30 Days" data={data.visitors30} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                Rankings
              </p>
              <h3 className="text-base font-semibold text-gray-900">
                Top categories
              </h3>
            </div>
          </div>
          <AdminTopActivity
            title="Top Categories"
            items={data.topCategories}
            type="category"
          />
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8A715D]/10 text-[#8A715D]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                Rankings
              </p>
              <h3 className="text-base font-semibold text-gray-900">
                Top subcategories
              </h3>
            </div>
          </div>
          <AdminTopActivity
            title="Top Subcategories"
            items={data.topSubcategories}
            type="subcategory"
          />
        </div>
      </div>
    </div>
  );
}