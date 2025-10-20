import { Suspense } from "react";
import type { Post } from "@/types/post";
import PostGrid from "@/components/posts/PostGrid";

async function fetchPosts(): Promise<{ data: Post[] }> {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/posts?limit=12&sort=recent`;
  // In Next.js App Router, fetch on server can use relative URL; ensure proper cache hints.
  const res = await fetch(url || "/api/posts?limit=12&sort=recent", {
    // Revalidate Home every 60s to keep it fresh while leveraging caching
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    // Fail gracefully — return empty list
    return { data: [] };
  }
  const body = await res.json();
  return { data: body.data || [] };
}

export default async function Home() {
  const { data } = await fetchPosts();

  return (
    <main className="app-container py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
          Discover recent TripTales
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Fresh stories from the community — photos, tips, and travel notes.
        </p>
      </header>

      <Suspense fallback={<div className="text-gray-600">Loading posts…</div>}>
        <PostGrid posts={data} />
      </Suspense>
    </main>
  );
}
