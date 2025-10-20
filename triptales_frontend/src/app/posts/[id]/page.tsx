import { notFound } from "next/navigation";
import Gallery from "@/components/posts/Gallery";
import TipList from "@/components/posts/TipList";
import TagChips from "@/components/posts/TagChips";
import LocationChip from "@/components/posts/LocationChip";
import type { Post } from "@/types/post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LikeButton } from "@/components/interactions/LikeButton";
import { FavoriteToggle } from "@/components/interactions/FavoriteToggle";

async function fetchPost(id: string): Promise<Post | null> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  const res = await fetch(`${base}/api/posts/${id}`, {
    // revalidate every 60s
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return (await res.json()) as Post;
}

export default async function PostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await fetchPost(id);
  if (!post) {
    notFound();
  }

  return (
    <main className="app-container py-6">
      <article className="space-y-6">
        <header>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{post.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {post.locations?.map((loc) => (
                  <LocationChip key={loc} location={loc} />
                ))}
                {!!post.tags?.length && <TagChips tags={post.tags} />}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {post.author ? `By ${post.author}` : "TripTales user"} •{" "}
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <LikeButton postId={post._id || ""} initialCount={post.likedCount || 0} initiallyLiked={false} />
              <FavoriteToggle postId={post._id || ""} initialFavorites={post.favorites || []} userId={undefined} />
            </div>
          </div>
        </header>

        {post.images && post.images.length > 0 ? (
          <Gallery images={post.images} />
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
            No images uploaded.
          </div>
        )}

        {post.content && (
          <Card>
            <CardHeader>
              <CardTitle>Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Travel Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <TipList tips={post.tips || []} />
          </CardContent>
        </Card>

        {/* Simple nav for editing */}
        <div className="flex items-center gap-2">
          <a
            href={`/posts/${post._id}/edit`}
            className="text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm hover:brightness-105"
          >
            Edit post
          </a>
        </div>
      </article>
    </main>
  );
}
