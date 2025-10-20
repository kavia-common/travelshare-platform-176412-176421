"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

export const Navbar: React.FC = () => {
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
          <span className="inline-block h-8 w-8 rounded-lg bg-[color:var(--color-primary)] shadow-sm" />
          <span>TripTales</span>
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <a
                href="/explore"
                className={cn(
                  "text-sm text-gray-700 hover:text-[color:var(--color-primary)]",
                  getFocusRing()
                )}
              >
                Explore
              </a>
            </li>
            <li>
              <a
                href="/create"
                className={cn(
                  "text-sm text-gray-700 hover:text-[color:var(--color-primary)]",
                  getFocusRing()
                )}
              >
                Create
              </a>
            </li>
            <li>
              <a
                href="/guides"
                className={cn(
                  "text-sm text-gray-700 hover:text-[color:var(--color-primary)]",
                  getFocusRing()
                )}
              >
                Guides
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/signin"
            className={cn(
              "text-sm px-3 py-2 rounded-md text-[color:var(--color-primary)]",
              "hover:bg-blue-50",
              getFocusRing()
            )}
          >
            Sign in
          </a>
          <a
            href="/create"
            className={cn(
              "text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm",
              "hover:brightness-105 active:brightness-95",
              getFocusRing()
            )}
          >
            New Post
          </a>
        </div>
      </div>
    </header>
  );
};
