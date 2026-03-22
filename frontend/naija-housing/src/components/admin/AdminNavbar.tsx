"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import adminApi from "@/libs/adminApi";
import { useAdminAuth } from "@/context/AdminAuthContext";

type AdminProfile = {
  id: string;
  email: string;
  createdAt?: string;
};

export default function AdminNavbar() {
  const { adminToken, adminLogout } = useAdminAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!adminToken) return;
      try {
        const res = await adminApi.get("/admin/auth/me");
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to load admin profile", error);
      }
    };

    loadProfile();
  }, [adminToken]);

  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard" className="font-bold text-lg">
            Admin Panel
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-sm hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/payments" className="text-sm hover:underline">
            Payments
          </Link>

          <div className="text-sm text-gray-600">
            {profile?.email || "Admin"}
          </div>

          <button
            onClick={adminLogout}
            className="px-3 py-2 rounded bg-black text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}