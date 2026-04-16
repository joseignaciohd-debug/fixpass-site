import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/layout/app-chrome";

export const metadata: Metadata = {
  title: "Fixpass — Home maintenance, handled.",
  description:
    "Fixpass is the membership for home maintenance in Katy, Texas. Predictable Stripe billing, trusted technicians, operator-led scheduling, and a calmer way to keep your house running.",
  openGraph: {
    title: "Fixpass — Home maintenance, handled.",
    description:
      "Premium home repair membership. Vetted technicians, clear scope, billed end-to-end on Stripe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parchment text-ink antialiased">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
