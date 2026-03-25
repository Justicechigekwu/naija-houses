"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import adminApi from "@/libs/adminApi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AxiosError } from "axios";
import Link from "next/link";

type AdminFormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  setupKey?: string;
};

export default function AdminAuthForm({
  isLogin = false,
}: {
  isLogin?: boolean;
}) {
  const { adminLogin } = useAdminAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormData>();

  // const onSubmit = async (data: AdminFormData) => {
  //   try {
  //     setError("");

  //     const endpoint = isLogin ? "/admin/auth/login" : "/admin/auth/register";

  //     // For register: ensure setupKey exists
  //     if (!isLogin && !data.setupKey) {
  //       setError("Setup key is required to create admin.");
  //       return;
  //     }

  //     const res = await adminApi.post(endpoint, data);

  //     // store via context (context already saves to localStorage)
  //     adminLogin(res.data.admin, res.data.token);

  //     const redirectUrl = params.get("redirect");
  //     router.push(redirectUrl || "/admin/dashboard");
  //   } catch (err: unknown) {
  //     if (err instanceof AxiosError) {
  //       setError(err.response?.data?.message || "Something went wrong");
  //     } else {
  //       setError("Something went wrong");
  //     }
  //   }
  // };

  const onSubmit = async (data: AdminFormData) => {
    try {
      setError("");
  
      const endpoint = isLogin ? "/admin/auth/login" : "/admin/auth/register";
  
      if (!isLogin && !data.setupKey) {
        setError("Setup key is required to create admin.");
        return;
      }
  
      const res = await adminApi.post(endpoint, data);
  
      adminLogin(res.data.admin);
  
      const redirectUrl = params.get("redirect");
      router.push(redirectUrl || "/admin/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="max-w-3xl border bg-white rounded shadow mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        {isLogin ? "Admin Login" : "Admin Register"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Admin Email"
          type="email"
          className="border shadow p-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          {...register("password", {
            required: "Password is required",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              message:
                "Password must be 8+ chars, include upper, lower, number, special char",
            },
          })}
          placeholder="Password"
          type="password"
          className="border shadow p-2"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {!isLogin && (
          <>
            <input
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              placeholder="Confirm Password"
              type="password"
              className="border shadow p-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}

            <input
              {...register("setupKey", { required: "Setup key is required" })}
              placeholder="Setup Key"
              className="border shadow p-2"
            />
            {errors.setupKey && (
              <p className="text-red-500 text-sm">{errors.setupKey.message}</p>
            )}
          </>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white p-2 rounded hover:opacity-90"
        >
          {isLogin ? "Login" : "Create Admin"}
        </button>
      </form>

      <div className="mt-4 text-center">
        {isLogin ? (
          <p className="text-sm">
            Need to create admin?{" "}
            <Link href="/admin/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        ) : (
          <p className="text-sm">
            Already an admin?{" "}
            <Link href="/admin/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
