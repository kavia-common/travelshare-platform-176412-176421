import { Suspense } from "react";
import type { Post } from "@/types/post";
import PostGrid from "@/components/posts/PostGrid";

async function fetchPosts(): Promise<{ data: Post[] }> {
  /**
   * Ensure absolute URL during build/prerender:
   * - Prefer NEXT_PUBLIC_SITE_URL or VERCEL_URL
   * - Fallback to http://localhost:3000 for local dev builds
   */
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  const url = `${base}/api/posts?limit=12&sort=recent`;

  const res = await fetch(url, {
    // Revalidate Home every 60s to keep it fresh while leveraging caching
    next: { revalidate: 60 },
  });
  if (!res.ok) {
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

      <Suspense fallback={<div className="text-gray-600" aria-live="polite">Loading posts…</div>}>
        <PostGrid posts={data} />
      </Suspense>
    </main>
  );
}
