'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";
import Link from "next/link";

type FormData = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function AuthForm({ isLogin = false }: { isLogin?: boolean }) {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const {
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const res = await api.post(endpoint, data);
      localStorage.setItem("token", res.data.token);
      login(res.data.user, res.data.token);

      const redirectUrl = params.get('redirect');
      router.push(redirectUrl || "/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } 
    }
  };

  return (
    <div className="max-w-3xl border bg-white rounded shadow mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {!isLogin && (
          <>
          <input
            {...register("firstName", { required: "First ame is required" })}
            placeholder="First Name"
            className="border shadow p-2"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}

          <input
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Last Name"
            className="border shadow p-2"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
          </>
        )}
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
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
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (value) =>
                value === watch('password') || 'Pwasswords do not match',
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
          </>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" disabled={isSubmitting}
         className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <div className="mt-4 text-center">
        {isLogin ? (
        <>
            <p className="text-sm">
            Do not have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
            Sign up
            </Link>
          </p>

          <p className="mt-2 text-sm">
            Forgot password?{" "}
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline">
            reset-password
            </Link>
          </p>
        </>
        ) : (
           <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
            Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
 

