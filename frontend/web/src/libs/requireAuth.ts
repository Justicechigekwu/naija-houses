"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function useRequireAuth(action?: string) {
  const router = useRouter();
  const { user, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      const redirectTo = action
        ? `?redirect=${encodeURIComponent(action)}`
        : "";
      router.push(`/register${redirectTo}`);
    }
  }, [user, isHydrated, router, action]);
}