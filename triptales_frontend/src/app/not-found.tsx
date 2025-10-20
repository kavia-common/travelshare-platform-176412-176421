import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <section
        className="card-surface p-6 max-w-lg w-full text-center"
        role="alert"
        aria-live="polite"
      >
        <h1 id="nf-title" className="text-2xl font-semibold text-gray-900">
          404 — Page not found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Link
            href="/"
            className="text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm hover:brightness-105"
          >
            Go home
          </Link>
          <Link
            href="/explore"
            className="text-sm px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Explore posts
          </Link>
        </div>
      </section>
    </main>
  );
}
