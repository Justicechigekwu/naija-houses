"use client";

import useAdminAnalytics from "@/hooks/useAdminAnalytics";
import AdminVisitorsChart from "./AdminVisitorsChart";
import AdminTopActivity from "./AdminTopActivity";

export default function AdminAnalyticsSection() {
  const { data, loading, error } = useAdminAnalytics();

  if (loading) {
    return <div className="bg-white border rounded-xl p-4">Loading analytics...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 border rounded-xl p-4">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <AdminVisitorsChart title="Visitors - Last 7 Days" data={data.visitors7} />
        <AdminVisitorsChart title="Visitors - Last 30 Days" data={data.visitors30} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AdminTopActivity
          title="Top Categories"
          items={data.topCategories}
          type="category"
        />
        <AdminTopActivity
          title="Top Subcategories"
          items={data.topSubcategories}
          type="subcategory"
        />
      </div>
    </div>
  );
}