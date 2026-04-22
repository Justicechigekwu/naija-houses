import { create } from "zustand";
import {
  getMe,
  googleLoginUser,
  loginUser,
  logoutUser,
  signupUser,
} from "@/features/auth/api";
import {
  configureGoogleSignin,
  getGoogleIdToken,
} from "@/features/auth/google";
import type {
  AuthUser,
  LoginPayload,
  SignupPayload,
} from "@/features/auth/types";
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "@/libs/auth-storage";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthStore = {
  user: AuthUser | null;
  status: AuthStatus;
  hydrated: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setError: (message: string | null) => void;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: "idle",
  hydrated: false,
  error: null,

  async login(payload) {
    set({ status: "loading", error: null });

    try {
      const data = await loginUser(payload);

      if (!data.accessToken) {
        throw new Error("No access token returned for mobile login");
      }

      await saveAccessToken(data.accessToken);

      set({
        user: data.user,
        status: "authenticated",
        error: null,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";

      await removeAccessToken();

      set({
        user: null,
        status: "unauthenticated",
        error: message,
      });

      throw error;
    }
  },

  async signup(payload) {
    set({ status: "loading", error: null });

    try {
      const data = await signupUser(payload);

      if (!data.accessToken) {
        throw new Error("No access token returned for mobile signup");
      }

      await saveAccessToken(data.accessToken);

      set({
        user: data.user,
        status: "authenticated",
        error: null,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Please try again.";

      await removeAccessToken();

      set({
        user: null,
        status: "unauthenticated",
        error: message,
      });

      throw error;
    }
  },

  async loginWithGoogle() {
    set({ status: "loading", error: null });

    try {
      await configureGoogleSignin();
      const idToken = await getGoogleIdToken();

      const data = await googleLoginUser({
        credential: idToken,
      });

      if (!data.accessToken) {
        throw new Error("No access token returned for Google mobile login");
      }

      await saveAccessToken(data.accessToken);

      set({
        user: data.user,
        status: "authenticated",
        error: null,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Google sign-in failed.";

      await removeAccessToken();

      set({
        user: null,
        status: "unauthenticated",
        error: message,
      });

      throw error;
    }
  },

  async restoreSession() {
    set({ status: "loading", error: null });

    try {
      const token = await getAccessToken();

      if (!token) {
        set({
          user: null,
          status: "unauthenticated",
          hydrated: true,
          error: null,
        });
        return;
      }

      const data = await getMe();

      set({
        user: data.user,
        status: "authenticated",
        hydrated: true,
        error: null,
      });
    } catch {
      await removeAccessToken();

      set({
        user: null,
        status: "unauthenticated",
        hydrated: true,
        error: null,
      });
    }
  },

  async logout() {
    try {
      await logoutUser();
    } catch {
      //
    } finally {
      await removeAccessToken();
      set({
        user: null,
        status: "unauthenticated",
        error: null,
      });
    }
  },

  clearError() {
    set({ error: null });
  },

  setError(message) {
    set({ error: message });
  },

  setUser(user) {
    set({ user });
  },
}));