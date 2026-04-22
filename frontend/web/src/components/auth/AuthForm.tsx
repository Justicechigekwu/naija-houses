"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";
import Link from "next/link";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User2 } from "lucide-react";

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!isLogin && !agreedToTerms) {
      setError("You must agree to the Terms & Conditions to create an account.");
      return;
    }

    try {
      setError("");

      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, data);

      login(res.data.user);

      const redirectUrl = params.get("redirect");
      router.push(redirectUrl || "/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-[#eadfd6] bg-white/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur sm:p-8">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f5efe9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8A715D]">
          <ShieldCheck className="h-4 w-4" />
          Velora Access
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
          {isLogin
            ? "Login to manage your listings, messages, drafts, and marketplace activity."
            : "Join Velora to create listings, connect with buyers, and manage your marketplace activity."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {!isLogin && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="relative">
                <User2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("firstName", { required: "First name is required" })}
                  placeholder="First Name"
                  className="w-full rounded-2xl border border-gray-200 bg-[#fcfbfa] py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#8A715D] focus:ring-4 focus:ring-[#8A715D]/10"
                />
              </div>
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="relative">
                <User2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  placeholder="Last Name"
                  className="w-full rounded-2xl border border-gray-200 bg-[#fcfbfa] py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#8A715D] focus:ring-4 focus:ring-[#8A715D]/10"
                />
              </div>
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              type="email"
              className="w-full rounded-2xl border border-gray-200 bg-[#fcfbfa] py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#8A715D] focus:ring-4 focus:ring-[#8A715D]/10"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
              type={showPassword ? "text" : "password"}
              className="w-full rounded-2xl border border-gray-200 bg-[#fcfbfa] py-3 pl-11 pr-12 text-sm text-gray-800 outline-none transition focus:border-[#8A715D] focus:ring-4 focus:ring-[#8A715D]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#8A715D]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {!isLogin && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full rounded-2xl border border-gray-200 bg-[#fcfbfa] py-3 pl-11 pr-12 text-sm text-gray-800 outline-none transition focus:border-[#8A715D] focus:ring-4 focus:ring-[#8A715D]/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#8A715D]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!isLogin && (
          <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-[#fcfbfa] px-4 py-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#8A715D]"
            />
            <span className="leading-6">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-[#8A715D] underline underline-offset-4"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#8A715D] underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-2xl bg-[#8A715D] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7a624f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm text-gray-400">or continue with</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-[#fcfbfa] p-3">
        <GoogleAuthButton mode={isLogin ? "login" : "register"} />
      </div>

      <div className="mt-6 text-center">
        {isLogin ? (
          <>
            <p className="text-sm text-gray-600">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[#8A715D] hover:underline"
              >
                Sign up
              </Link>
            </p>

            <p className="mt-3 text-sm text-gray-600">
              Forgot password?{" "}
              <Link
                href="/auth/forgot-password"
                className="font-medium text-[#8A715D] hover:underline"
              >
                reset-password
              </Link>
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#8A715D] hover:underline"
            >
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}