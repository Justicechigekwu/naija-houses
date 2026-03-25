"use client";

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
  return (
    <div className="space-y-4">
      <p><span>Username</span> {user?.firstName} {user?.lastName}</p>
      <p><span>Email:</span> {user?.email}</p>
      {user?.location && <p><span>Location:</span> {user.location}</p>}
      {user?.phone && <p><span>phone:</span> {user.phone}</p>}
      {user?.sex && <p><span>sex:</span> {user.sex}</p>}
      {user?.bio && <p><span>Bio:</span> {user.bio}</p>}
      {user?.dob && <p><span>Date of Birth:</span> {user.dob}</p>}
    </div>
  );
}