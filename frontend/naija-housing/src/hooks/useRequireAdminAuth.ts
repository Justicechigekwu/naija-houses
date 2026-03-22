"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function useRequireAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { adminToken, isHydrated } = useAdminAuth();

  useEffect(() => {
    if (!isHydrated) return;

    if (!adminToken) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [adminToken, isHydrated, pathname, router]);

  return {
    isAuthenticated: !!adminToken,
    isCheckingAuth: !isHydrated,
  };
}