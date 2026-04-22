"use client";

import { FileText, Phone, User2 } from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  location?: string;
  phone?: string;
  bio?: string;
};

type Props = {
  user: UserProfile | null;
};

export default function PublicProfileDetails({ user }: Props) {
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 text-gray-600 shadow-sm">
            <User2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Name
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {fullName || "Not available"}
            </p>
          </div>
        </div>
      </div>

      {user?.bio && (
        <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-2 text-gray-600 shadow-sm">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                About
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-700">{user.bio}</p>
            </div>
          </div>
        </div>
      )}

      {user?.phone && (
        <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-2 text-gray-600 shadow-sm">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contact
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {user.phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}