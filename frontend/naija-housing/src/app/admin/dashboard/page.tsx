"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminUsersTable from "@/components/AdminUsersTable";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminToken, adminLogout } = useAdminAuth();

  useEffect(() => {
    if (!adminToken) router.push("/admin/login");
  }, [adminToken, router]);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <button className="border px-3 py-2 rounded" onClick={() => router.push("/admin/payments")}>
            Pending Payments
          </button>

          <button
            className="bg-black text-white px-3 py-2 rounded"
            onClick={() => {
              adminLogout();
              router.push("/admin/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <AdminUsersTable/>
    </div>
  );
}