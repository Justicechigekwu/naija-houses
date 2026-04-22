"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import {
  User,
  MapPin,
  Phone,
  CalendarDays,
  VenusAndMars,
  FileText,
  LogOut,
  Save,
} from "lucide-react";

type ProfileFormData = {
  firstName?: string;
  lastName?: string;
  location?: string;
  phone?: string;
  bio?: string;
  dob?: string;
  sex?: string;
  avatar?: FileList;
};

export default function ProfileForm() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const { register, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      location: user?.location || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      dob: user?.dob || "",
      sex: user?.sex || "",
    },
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSubmitting(true);
      setMessage("");

      const { avatar, ...rest } = data;
      const res = await api.put("/profile/update", rest);

      login(res.data.user);
      setMessage("Profile updated successfully.");
      router.push("/profile");
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#8A715D] focus:ring-4 focus:ring-[#8A715D]/10";

  const labelClass = "mb-2 flex items-center gap-2 text-sm font-medium text-gray-700";

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your basic details so your profile stays accurate.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                <User className="h-4 w-4 text-gray-500" />
                First Name
              </label>
              <input
                {...register("firstName")}
                placeholder="Enter your first name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <User className="h-4 w-4 text-gray-500" />
                Last Name
              </label>
              <input
                {...register("lastName")}
                placeholder="Enter your last name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <MapPin className="h-4 w-4 text-gray-500" />
                Location
              </label>
              <input
                {...register("location")}
                placeholder="Enter your location"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Phone className="h-4 w-4 text-gray-500" />
                Phone
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="Enter your phone number"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <CalendarDays className="h-4 w-4 text-gray-500" />
                Date of Birth
              </label>
              <input
                {...register("dob")}
                type="date"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <VenusAndMars className="h-4 w-4 text-gray-500" />
                Gender
              </label>
              <select {...register("sex")} className={inputClass}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">About You</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a short bio so people can know more about you.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              <FileText className="h-4 w-4 text-gray-500" />
              Bio
            </label>
            <textarea
              {...register("bio")}
              placeholder="Write a short bio..."
              className={`${inputClass} min-h-[180px] resize-none`}
              rows={8}
            />
          </div>
        </section>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.toLowerCase().includes("failed")
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8A715D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7A6352] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your password to keep your account secure.
          </p>
        </div>

        <ChangePasswordForm />
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-red-700">Account Actions</h2>
          <p className="mt-1 text-sm text-red-600">
            Logging out will end your current session on this device.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </section>
    </div>
  );
}