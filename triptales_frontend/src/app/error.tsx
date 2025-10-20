"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// PUBLIC_INTERFACE
export default function GlobalError({ error, reset }: ErrorProps) {
  /**
   * Global error boundary UI for App Router.
   * Next.js uses this for rendering unexpected errors at the root.
   */
  return (
    <html>
      <body>
        <main className="min-h-screen flex items-center justify-center p-6 bg-ocean-gradient">
          <div className="card-surface p-6 max-w-lg w-full text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-600">
              {error?.message || "An unexpected error occurred."}
            </p>
            {error?.digest && (
              <p className="mt-1 text-xs text-gray-400">Ref: {error.digest}</p>
            )}
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button onClick={() => reset()}>Try again</Button>
              <Link
                href="/"
                className="text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm hover:brightness-105"
              >
                Go home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
