"use client";

import {
  Mail,
  MapPin,
  Phone,
  User,
  CalendarDays,
  VenusAndMars,
  FileText,
} from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  location?: string;
  phone?: string;
  sex?: string;
  bio?: string;
  dob?: string;
};

type Props = {
  user: UserProfile | null;
};

export default function ProfileDetails({ user }: Props) {
  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const Item = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
  }) => {
    if (!value) return null;

    return (
      <div className="flex items-start gap-3 text-sm">
        <div className="mt-0.5 text-gray-400">{icon}</div>

        <div className="text-left">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <p className="font-medium text-gray-800 break-words">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 w-full space-y-4">
      <Item
        icon={<User className="h-4 w-4" />}
        label="Username"
        value={`${user?.firstName || ""} ${user?.lastName || ""}`}
      />

      <Item
        icon={<Mail className="h-4 w-4" />}
        label="Email"
        value={user?.email}
      />

      <Item
        icon={<MapPin className="h-4 w-4" />}
        label="Location"
        value={user?.location}
      />

      <Item
        icon={<Phone className="h-4 w-4" />}
        label="Phone"
        value={user?.phone}
      />

      <Item
        icon={<VenusAndMars className="h-4 w-4" />}
        label="Gender"
        value={user?.sex}
      />

      <Item
        icon={<CalendarDays className="h-4 w-4" />}
        label="Date of Birth"
        value={formatDate(user?.dob)}
      />

      {user?.bio && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-start gap-3 text-sm">
            <div className="mt-0.5 text-gray-400">
              <FileText className="h-4 w-4" />
            </div>

            <div className="text-left">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Bio
              </p>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}