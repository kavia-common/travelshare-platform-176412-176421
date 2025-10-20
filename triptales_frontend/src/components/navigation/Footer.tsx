import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white/70" role="contentinfo">
      <div className="app-container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} TripTales. All rights reserved.
        </p>
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6 text-sm text-gray-600">
            <li>
              <Link className="hover:text-[color:var(--color-primary)]" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-[color:var(--color-primary)]" href="/explore">
                Explore
              </Link>
            </li>
            <li>
              <Link className="hover:text-[color:var(--color-primary)]" href="/posts/new">
                New Post
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
