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
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.velora.ng";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Velora Marketplace",
    template: "%s",
  },
  description:
    "Buy, sell and rent properties, vehicles, electronics, phones and more across Nigeria on Velora Marketplace.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Velora Marketplace",
    title: "Velora Marketplace",
    description:
      "Buy, sell and rent properties, vehicles, electronics, phones and more across Nigeria on Velora Marketplace.",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velora Marketplace",
    description:
      "Buy, sell and rent properties, vehicles, electronics, phones and more across Nigeria on Velora Marketplace.",
  },
  robots: {
    index: true,
    follow: true,
  },
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