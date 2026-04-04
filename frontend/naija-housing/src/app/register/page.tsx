import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="p-8 bg-[#F5F5F5]">
      <h1 className="text-2xl font-semibold align-center flex justify-center mb-4">
        Register
      </h1>

      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}