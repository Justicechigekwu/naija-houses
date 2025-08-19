'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";

type FormData = {
  name?: string;
  email: string;
  password: string;
};

export default function AuthForm({ isLogin = false }: { isLogin?: boolean }) {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const res = await api.post(endpoint, data);
      localStorage.setItem("token", res.data.token);
      login(res.data.user, res.data.token);

      const redirectUrl = params.get('redirect');
      router.push(redirectUrl || "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl border bg-white rounded shadow mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {!isLogin && (
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Name"
            className="border shadow p-2"
          />
        )}
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          type="email"
          className="border shadow p-2"
        />
        <input
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
          type="password"
          className="border shadow p-2"
        />
  
        {error && <p className="text-red-500">{error}</p>}
  
        <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white p-2">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}


