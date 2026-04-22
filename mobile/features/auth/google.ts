import { env } from "@/libs/env";

export async function configureGoogleSignin() {
  const { GoogleSignin } = await import(
    "@react-native-google-signin/google-signin"
  );

  GoogleSignin.configure({
    webClientId: env.googleWebClientId,
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });
}

export async function getGoogleIdToken(): Promise<string> {
  const {
    GoogleSignin,
    isSuccessResponse,
  } = await import("@react-native-google-signin/google-signin");

  await GoogleSignin.hasPlayServices();

  const hasPreviousSignIn = await GoogleSignin.hasPreviousSignIn();

  if (hasPreviousSignIn) {
    await GoogleSignin.signOut();
  }

  const result = await GoogleSignin.signIn();

  if (!isSuccessResponse(result)) {
    throw new Error("Google sign-in was cancelled");
  }

  const idToken = result.data?.idToken;

  if (!idToken) {
    throw new Error("Google did not return an ID token");
  }

  return idToken;
}

export function mapGoogleSignInError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : "Google sign-in failed.";

  if (
    message.includes("SIGN_IN_CANCELLED") ||
    message.toLowerCase().includes("cancel")
  ) {
    return "Google sign-in was cancelled.";
  }

  if (
    message.includes("IN_PROGRESS") ||
    message.toLowerCase().includes("in progress")
  ) {
    return "Google sign-in is already in progress.";
  }

  if (
    message.includes("PLAY_SERVICES_NOT_AVAILABLE") ||
    message.toLowerCase().includes("play services")
  ) {
    return "Google Play Services is not available or needs update.";
  }

  return message || "Google sign-in failed.";
}