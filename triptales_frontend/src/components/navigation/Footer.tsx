import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// PUBLIC_INTERFACE
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className={cn(
        "border-t border-gray-200/70 bg-white/80 backdrop-blur-sm mt-auto"
      )} 
      role="contentinfo"
    >
      <div className="app-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-lg",
                  "bg-gradient-to-br from-[color:var(--color-primary)] to-blue-600",
                  "shadow-sm text-white text-sm font-bold"
                )}
                aria-hidden="true"
              >
                T
              </span>
              <span className="font-bold text-lg text-gray-900">TripTales</span>
            </div>
            <p className="text-sm text-gray-600">
              © {currentYear} TripTales. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-8 text-sm">
              <li>
                <Link 
                  className={cn(
                    "text-gray-600 hover:text-[color:var(--color-primary)]",
                    "transition-colors duration-200 font-medium"
                  )} 
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  className={cn(
                    "text-gray-600 hover:text-[color:var(--color-primary)]",
                    "transition-colors duration-200 font-medium"
                  )} 
                  href="/explore"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link 
                  className={cn(
                    "text-gray-600 hover:text-[color:var(--color-primary)]",
                    "transition-colors duration-200 font-medium"
                  )} 
                  href="/posts/new"
                >
                  New Post
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Social or additional links could go here */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Share your journeys, inspire others, discover the world.
          </p>
        </div>
      </div>
    </footer>
  );
};
