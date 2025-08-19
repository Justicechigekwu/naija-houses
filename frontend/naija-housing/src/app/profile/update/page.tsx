"use client";

import ProfileForm from "@/components/ProfileForm";

export default function UpdateProfilePage() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] bg-white p-6 shadow rounded">
        <h1 className="text-xl font-bold mb-4">Update Profile</h1>
        <ProfileForm />
      </div>
    </div>
  );
}


