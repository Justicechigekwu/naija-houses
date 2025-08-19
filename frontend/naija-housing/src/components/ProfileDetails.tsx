"use client";

type Props = {
  user: any;
};

export default function ProfileDetails({ user }: Props) {
  return (
    <div className="space-y-4">
      <p><span >Username</span> {user?.name}</p>
      <p><span className="">Email:</span> {user?.email}</p>
      {user?.location && <p><span>Location:</span> {user.location}</p>}
      {user?.phone && <p><span>phone:</span> {user.phone}</p>}
      {user?.sex && <p><span>sex:</span> {user.sex}</p>}
      {user?.bio && <p><span>Bio:</span> {user.bio}</p>}
      {user?.dob && <p><span>Date of Birth:</span> {user.dob}</p>}
    </div>
  );
}
