"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type ProfileFormData = {
  firstName?: string;
  lastName?: string;
  location?: string;
  phone?: number;
  bio?: string;
  dob?: string;
  sex?: string;
  avatar?: FileList;
};

export default function ProfileForm() {
  const { user, login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.user || "",
      lastName: user?.user || "",
      location: user?.location || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      dob: user?.dob || "",
      sex: user?.sex || "",
    },
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (data: ProfileFormData) => {
    try {

    const {avatar, ...rest } = data;

    const res = await api.put('/profile/update', rest);

      login(res.data.user, localStorage.getItem("token") || "");
      setMessage("Profile updated!");
      router.push("/profile");
    } catch {
      setMessage("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("firstName")} placeholder="First name" className="w-full border p-2 rounded" />
      <input {...register("lastName")} placeholder="Last name" className="w-full border p-2 rounded" />
      <input {...register("location")} placeholder="Location" className="w-full border p-2 rounded" />
      <input {...register("phone")} type="number" placeholder="phone" className="w-full border p-2 rounded" />
      <input {...register("dob")} type="date" className="w-full border p-2 rounded" />
      <select {...register("sex")} className="w-full border p-2 rounded">
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <textarea {...register("bio")} placeholder="Bio" className="w-full border p-2 rounded" rows={10} />

      {message && <p className="text-sm text-green-600">{message}</p>}

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Save
      </button>
    </form>
  );
}
