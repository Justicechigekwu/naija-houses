'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function requireAuth(action?: string) {
    const router = useRouter();
    const params = useSearchParams();

    useEffect( () => {
        const token = localStorage.getItem('token');
         if (!token) {
        const redirectTo = action ? `?redirect=${encodeURIComponent(action)}` : "";
        router.push(`/register${redirectTo}`);
    }
    }, [router, params])
}