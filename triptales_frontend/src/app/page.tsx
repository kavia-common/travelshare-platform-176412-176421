import { Suspense } from "react";
import type { Post } from "@/types/post";
import PostGrid from "@/components/posts/PostGrid";
import { cn } from "@/lib/utils";

async function fetchPosts(): Promise<{ data: Post[] }> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  const url = `${base}/api/posts?limit=12&sort=recent`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    return { data: [] };
  }
  const body = await res.json();
  return { data: body.data || [] };
}

function PostGridSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading posts">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <li 
            key={i} 
            className={cn(
              "overflow-hidden rounded-lg bg-white",
              "border border-gray-100 shadow-md"
            )}
          >
            <div className="aspect-[4/3] skeleton" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-2/3 skeleton" />
              <div className="h-3 w-full skeleton" />
              <div className="h-3 w-5/6 skeleton" />
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-16 skeleton rounded-full" />
                <div className="h-6 w-20 skeleton rounded-full" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function Home() {
  const { data } = await fetchPosts();

  return (
    <main className="app-container section-spacing">
      {/* Hero Section */}
      <header className="mb-12 text-center">
        <h1 className={cn(
          "text-4xl md:text-5xl font-bold tracking-tight mb-4",
          "bg-gradient-to-r from-[color:var(--color-primary)] via-blue-600 to-blue-500",
          "bg-clip-text text-transparent"
        )}>
          Discover TripTales
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Fresh travel stories from around the world — stunning photos, insider tips, and authentic experiences.
        </p>
      </header>

      {/* Posts Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Stories
          </h2>
          <span className="text-sm text-gray-500">
            {data.length} {data.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        <Suspense fallback={<PostGridSkeleton />}>
          <PostGrid posts={data} />
        </Suspense>
      </section>
    </main>
  );
}
