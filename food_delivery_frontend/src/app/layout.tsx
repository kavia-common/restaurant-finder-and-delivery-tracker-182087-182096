import type { Metadata } from "next";
/* Global styles include Tailwind and theme variables */
import "./globals.css";

export const metadata: Metadata = {
  title: "Minimal Next.js App",
  description: "Ultra-minimal Next.js application with Ocean Professional theme",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
