"use client";

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
  return (
    <div className="space-y-3 text-left">
      <p>
        <span className="font-medium">Full name:</span>{" "}
        {user?.firstName} {user?.lastName}
      </p>

      {user?.bio && (
        <p>
          <span className="font-medium">About:</span> {user.bio}
        </p>
      )}

      {user?.phone && (
        <p>
          <span className="font-medium">Contact:</span> {user.phone}
        </p>
      )}
    </div>
  );
}