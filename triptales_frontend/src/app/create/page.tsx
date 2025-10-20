import React from "react";
import Link from "next/link";

// PUBLIC_INTERFACE
export default function CreateAlias() {
  /** Friendly alias route that points users to /posts/new to avoid 404 from old links. */
  return (
    <main className="min-h-[50vh] flex items-center justify-center p-6">
      <section className="card-surface p-6 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold text-gray-900">Create a new TripTale</h1>
        <p className="mt-2 text-sm text-gray-600">
          We’ve moved the create page. Use the button below to continue.
        </p>
        <Link
          href="/posts/new"
          className="inline-block mt-4 text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm hover:brightness-105"
        >
          Go to New Post
        </Link>
      </section>
    </main>
  );
}
