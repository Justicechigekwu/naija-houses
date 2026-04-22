import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="bg-[#F5F5F5] p-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <AuthForm isLogin={true} />
      </Suspense>
    </div>
  );
}