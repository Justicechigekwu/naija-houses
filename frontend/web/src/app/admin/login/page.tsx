import { Suspense } from "react";
import AdminAuthForm from "@/components/admin/AdminAuthForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <AdminAuthForm isLogin />
    </Suspense>
  );
}  
