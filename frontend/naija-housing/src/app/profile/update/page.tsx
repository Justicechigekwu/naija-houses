"use client";

import ProfileForm from "@/components/ProfileForm";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default function UpdateProfilePage() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] bg-white p-6 shadow rounded">
        <h1 className="text-xl font-bold mb-4">Update Profile</h1>
        <ProfileForm />
        <Link
          href="/settings/help"
          className="block rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
        >
          <h3 className="font-semibold text-gray-900">FAQ</h3>
          <p className="mt-1 text-sm text-gray-600">
            Terms, privacy, support, safety tips, appeal policy and more.
          </p>
        </Link>
        <ThemeToggle/>
      </div>
    </div>
  );
}


