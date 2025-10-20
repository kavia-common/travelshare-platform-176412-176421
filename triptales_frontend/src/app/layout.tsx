import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

/**
 - Base metadata placeholders for TripTales
 - Update dynamically per route later as needed
*/
export const metadata: Metadata = {
  title: {
    default: "TripTales — Share Your Journeys",
    template: "%s | TripTales",
  },
  description:
    "TripTales is a modern travel-sharing platform for posts, photo albums, and guide tips.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-ocean-gradient">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
