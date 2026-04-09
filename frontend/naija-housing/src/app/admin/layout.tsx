"use client";

import { ReactNode } from "react";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminRealtimeProvider } from "@/context/AdminRealtimeContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminRealtimeProvider>
        {children}
      </AdminRealtimeProvider>
    </AdminAuthProvider>
  );
}