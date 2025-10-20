"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const baseLink =
    "text-sm px-2.5 py-2 rounded-md text-gray-700 hover:text-[color:var(--color-primary)]";
  const activeLink =
    "text-[color:var(--color-primary)] bg-blue-50 ring-1 ring-blue-100";

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
