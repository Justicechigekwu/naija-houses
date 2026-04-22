export type ProfileUser = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string;
  location: string;
  bio: string;
  dob: string;
  sex: string;
  provider: "local" | "google";
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  dob?: string;
  sex?: string;
  avatar?: {
    uri: string;
    name: string;
    type: string;
  };
};

export type UpdateProfileResponse = {
  message: string;
  user: ProfileUser;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};