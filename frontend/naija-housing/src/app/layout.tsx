import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import { UIProvider } from "@/context/UiContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "@/context/NotificationContext";
import AppQueryProvider from "@/components/providers/QueryProvider";
import { BrowsingLocationProvider } from "@/context/BrowsingLocationContext";

export const metadata = {
  title: "Velora Marketplace",
  description:
    "Buy sell or rent anything from properties to vehicles to electronics and more.",
    icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  return (
    <html lang="en">
      <body>
          <GoogleOAuthProvider clientId={googleClientId}>
            <AppQueryProvider>
              <AuthProvider>
                <NotificationProvider>
                  <BrowsingLocationProvider>
                    <SearchProvider>
                      <UIProvider>
                        <Navbar />
                        {children}
                      </UIProvider>
                    </SearchProvider>
                  </BrowsingLocationProvider>
                </NotificationProvider>
              </AuthProvider>
            </AppQueryProvider>
          </GoogleOAuthProvider>
      </body>
    </html>
  );
}