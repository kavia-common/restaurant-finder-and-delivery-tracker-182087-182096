import type { Metadata, Viewport } from "next";
/* Global styles include Tailwind and theme variables */
import "./globals.css";
import "../styles/theme.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { StoreProvider } from "@/store/store";

/**
 * Root layout for the OceanEats application.
 * PUBLIC_INTERFACE
 * Wraps every page with a shared Navbar and Footer and sets app-wide metadata.
 */
export const metadata: Metadata = {
  title: "OceanEats — Restaurant Finder & Delivery Tracker",
  description:
    "Browse restaurants, order food online, and track your delivery in real time with OceanEats.",
  applicationName: "OceanEats",
  keywords: [
    "restaurants",
    "delivery",
    "food",
    "orders",
    "tracking",
    "OceanEats",
  ],
  openGraph: {
    title: "OceanEats",
    description:
      "Browse restaurants, order food online, and track your delivery in real time.",
    url: "/",
    siteName: "OceanEats",
    type: "website",
  },
};

// Per Next.js guidance, themeColor belongs to the viewport export
export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-50" suppressHydrationWarning>
      <body
        className="min-h-screen bg-gray-50 text-gray-900 antialiased"
        suppressHydrationWarning
      >
        <StoreProvider>
          {/* Wrap Navbar in Suspense because it uses useSearchParams hook */}
          <Suspense fallback={<div className="h-16 w-full" />}>
            <Navbar />
          </Suspense>
          <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
