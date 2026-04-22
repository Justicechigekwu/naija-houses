export type AuthUser = {
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

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type GoogleAuthPayload = {
  credential: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  password: string;
  confirmPassword: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
  accessToken?: string;
  tokenType?: "Bearer";
  expiresIn?: string;
};

export type SignupResponse = LoginResponse;

export type GetMeResponse = {
  user: AuthUser;
};