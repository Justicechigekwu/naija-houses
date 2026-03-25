"use client";

import { ReactNode } from "react";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}