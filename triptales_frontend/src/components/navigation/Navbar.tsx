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
 * Navbar - Presentational navigation bar that adapts to auth state.
 * - Shows Login/Signup when not authenticated
 * - Shows user's email/initial and Logout when authenticated
 * - Includes mobile-friendly actions (no separate duplicate bars needed)
 */
export const Navbar: React.FC<Props> = ({ session }) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const baseLink =
    "text-sm px-2.5 py-2 rounded-md text-gray-700 hover:text-[color:var(--color-primary)]";
  const activeLink =
    "text-[color:var(--color-primary)] bg-blue-50 ring-1 ring-blue-100";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors for logout
    } finally {
      // Ensure the user is redirected to home after logout as per acceptance criteria
      window.location.assign("/");
    }
  };

  const userInitial = session?.email?.[0]?.toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        "border-b border-gray-200"
      )}
      role="banner"
    >
      <div className="app-container flex items-center justify-between py-3">
        <Link
          href={"/" as Route}
          className={cn(
            "inline-flex items-center gap-2 font-semibold text-[color:var(--color-text)]",
            getFocusRing()
          )}
          aria-label="TripTales home"
        >
          <span
            className="inline-block h-8 w-8 rounded-lg bg-[color:var(--color-primary)] shadow-sm"
            aria-hidden="true"
          />
          <span>TripTales</span>
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="hidden md:flex items-center gap-1">
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

        <div className="flex items-center gap-2" aria-label="Actions">
          {!session ? (
            <>
              <Link
                href={"/auth/login" as Route}
                className={cn(
                  "text-sm px-3 py-2 rounded-md text-gray-700 hover:text-[color:var(--color-primary)]",
                  getFocusRing()
                )}
                aria-label="Log in"
              >
                Log in
              </Link>
              <Link
                href={"/auth/signup" as Route}
                className={cn(
                  "text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-secondary)] shadow-sm",
                  "hover:brightness-105 active:brightness-95",
                  getFocusRing()
                )}
                aria-label="Sign up"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <div
                className="hidden sm:flex items-center gap-2 text-sm text-gray-700"
                aria-label="Current user"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold"
                  title={session.email}
                >
                  {userInitial || "U"}
                </span>
                <span className="max-w-[160px] truncate" title={session.email}>
                  {session.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  "text-sm px-3 py-2 rounded-md bg-gray-100 text-gray-800",
                  "hover:bg-gray-200 active:bg-gray-300",
                  getFocusRing()
                )}
                aria-label="Log out"
              >
                Log out
              </button>
            </>
          )}

          <Link
            href={"/posts/new" as Route}
            className={cn(
              "text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm",
              "hover:brightness-105 active:brightness-95",
              getFocusRing()
            )}
            aria-label="Create a new post"
          >
            New Post
          </Link>
        </div>
      </div>
    </header>
  );
};
