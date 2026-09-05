import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { Providers } from "./providers";
import { Navbar } from "./components/Navbar";
import { AuthButton } from "./components/AuthButton";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthToastListener } from "./components/AuthToastListener";
import { Toast } from "@heroui/react";
import { getUnreadCount } from "./actions/notifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Step Group Portal",
  description: "Live updates for Step Group operations",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Step Portal",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  const isSignedIn = !!session?.user;

  // Only query when signed in — skips a DB round-trip for anonymous visitors.
  const unreadCount = isSignedIn ? await getUnreadCount() : 0;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <ScrollToTop />
          <Navbar
            authButton={<AuthButton />}
            isSignedIn={isSignedIn}
            unreadCount={unreadCount}
          />
          <Toast.Provider />
          <Suspense fallback={null}>
            <AuthToastListener />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  );
}