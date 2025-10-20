import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavbarServer from "@/components/navigation/NavbarServer";
import { Footer } from "@/components/navigation/Footer";

const siteName = "TripTales";
const siteTitleDefault = "TripTales — Share Your Journeys";
const siteDescription =
  "TripTales is a modern travel-sharing platform for posts, photo albums, and guide tips.";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "http://localhost:3000";

/**
 * Global SEO metadata configuration
 * - Title template, description
 * - Theme color
 * - Open Graph and Twitter defaults
 */
export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: siteTitleDefault,
    template: "%s | TripTales",
  },
  description: siteDescription,
  applicationName: siteName,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: ["travel", "blog", "photos", "tips", "guides", "TripTales"],
  authors: [{ name: "TripTales" }],
  creator: "TripTales",
  publisher: "TripTales",
  formatDetection: { telephone: false, email: false, address: false },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteTitleDefault,
    description: siteDescription,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "TripTales – Share Your Journeys",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitleDefault,
    description: siteDescription,
    images: ["/og-default.png"],
    creator: "@triptales",
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    "theme-color": "#2563EB",
  },
};

// PUBLIC_INTERFACE
export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-ocean-gradient">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 bg-white text-blue-700 px-3 py-2 rounded-md shadow">
          Skip to content
        </a>
        {/* Server-aware Navbar reflects auth state and exposes logout */}
        <NavbarServer />
        <main id="main" role="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
