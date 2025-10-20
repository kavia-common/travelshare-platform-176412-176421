"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

/** PUBLIC_INTERFACE */
export type NavbarSession = { userId: string; email: string } | null;

type Props = {
  /** Auth session passed from the server; null when unauthenticated */
  session: NavbarSession;
};

/**
 * PUBLIC_INTERFACE
 * Navbar - Premium navigation bar with elevated visual design.
 * Features:
 * - Glassmorphism backdrop with smooth blur
 * - Enhanced hover states with smooth transitions
 * - Active state indicators with gradient accents
 * - User avatar with initial
 * - Micro-interactions on all interactive elements
 */
export const Navbar: React.FC<Props> = ({ session }) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const baseLink = cn(
    "relative text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200",
    "text-gray-700 hover:text-[color:var(--color-primary)] hover:bg-blue-50/50"
  );
  
  const activeLink = cn(
    "text-[color:var(--color-primary)] bg-gradient-to-br from-blue-50 to-blue-100/50",
    "shadow-sm ring-1 ring-blue-200/50"
  );

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors for logout
    } finally {
      window.location.assign("/");
    }
  };

  const userInitial = session?.email?.[0]?.toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 glass-effect border-b border-gray-200/50",
        "backdrop-blur-xl supports-[backdrop-filter]:bg-white/80"
      )}
      role="banner"
    >
      <div className="app-container flex items-center justify-between py-3">
        {/* Logo */}
        <Link
          href={"/" as Route}
          className={cn(
            "inline-flex items-center gap-2.5 font-bold text-lg",
            "text-[color:var(--color-text)] hover:opacity-80 transition-opacity",
            getFocusRing()
          )}
          aria-label="TripTales home"
        >
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl",
              "bg-gradient-to-br from-[color:var(--color-primary)] to-blue-600",
              "shadow-md text-white text-lg font-bold",
              "transition-transform hover:scale-105"
            )}
            aria-hidden="true"
          >
            T
          </span>
          <span className="hidden sm:inline">TripTales</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            <li>
              <Link
                href={"/" as Route}
                className={cn(baseLink, getFocusRing(), isActive("/") && activeLink)}
                aria-current={isActive("/") ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={"/explore" as Route}
                className={cn(baseLink, getFocusRing(), isActive("/explore") && activeLink)}
                aria-current={isActive("/explore") ? "page" : undefined}
              >
                Explore
              </Link>
            </li>
            <li>
              <Link
                href={"/posts/new" as Route}
                className={cn(baseLink, getFocusRing(), isActive("/posts/new") && activeLink)}
                aria-current={isActive("/posts/new") ? "page" : undefined}
              >
                New Post
              </Link>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2" aria-label="Actions">
          {!session ? (
            <>
              <Link
                href={"/auth/login" as Route}
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-lg",
                  "text-gray-700 hover:text-[color:var(--color-primary)] hover:bg-gray-100/70",
                  "transition-all duration-200",
                  getFocusRing()
                )}
                aria-label="Log in"
              >
                Log in
              </Link>
              <Link
                href={"/auth/signup" as Route}
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-lg",
                  "text-white bg-gradient-to-r from-[color:var(--color-secondary)] to-amber-500",
                  "shadow-md hover:shadow-lg hover:scale-[1.02]",
                  "active:scale-[0.98] transition-all duration-200",
                  getFocusRing()
                )}
                aria-label="Sign up"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {/* User Info */}
              <div
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gray-50/70"
                aria-label="Current user"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center",
                    "rounded-full bg-gradient-to-br from-blue-600 to-blue-700",
                    "text-white font-semibold text-sm shadow-sm"
                  )}
                  title={session.email}
                >
                  {userInitial || "U"}
                </span>
                <span className="max-w-[140px] truncate text-sm font-medium text-gray-700" title={session.email}>
                  {session.email}
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-lg",
                  "bg-gray-100 text-gray-800 hover:bg-gray-200",
                  "active:bg-gray-300 transition-all duration-200",
                  getFocusRing()
                )}
                aria-label="Log out"
              >
                Log out
              </button>
            </>
          )}

          {/* Primary CTA - Always visible */}
          <Link
            href={"/posts/new" as Route}
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-lg hidden md:inline-flex items-center",
              "text-white bg-gradient-to-r from-[color:var(--color-primary)] to-blue-600",
              "shadow-md hover:shadow-lg hover:scale-[1.02]",
              "active:scale-[0.98] transition-all duration-200",
              getFocusRing()
            )}
            aria-label="Create a new post"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
        </div>
      </div>
    </header>
  );
};
