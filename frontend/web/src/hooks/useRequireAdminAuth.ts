"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function useRequireAdminAuth() {
  const { admin, isHydrated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!admin) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsCheckingAuth(false);
  }, [admin, isHydrated, router, pathname]);

  return {
    admin,
    isAuthenticated: !!admin,
    isCheckingAuth: !isHydrated || isCheckingAuth,
  };
}