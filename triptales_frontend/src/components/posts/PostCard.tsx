import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/post";
import { cn } from "@/lib/utils";
import TagChips from "./TagChips";
import LocationChip from "./LocationChip";
import { LikeButton } from "@/components/interactions/LikeButton";
import { FavoriteToggle } from "@/components/interactions/FavoriteToggle";
import { getSession } from "@/lib/auth/session-impl.server";

// Server Component: safe to use getSession (uses next/headers)
export default async function PostCard({ post }: { post: Post & { _id?: string; author?: string } }) {
  const thumb = post.images && post.images.length > 0 ? post.images[0] : undefined;
  const session = await getSession();
  const isOwner = Boolean(session && post.author && String(post.author) === String(session.userId));

  return (
    <article 
      className={cn(
        "group overflow-hidden rounded-xl bg-white",
        "shadow-md border border-gray-100/50",
        "transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1"
      )}
    >
      <a
        href={`/posts/${post._id ?? ""}`}
        aria-label={`Open post: ${post.title}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(37,99,235,0.6)]"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {thumb ? (
            <Image
              src={thumb.url}
              alt={thumb.publicId ? `${post.title} – photo ${thumb.publicId}` : post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={cn(
                "object-cover transition-transform duration-500",
                "group-hover:scale-105"
              )}
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-4xl" aria-hidden="true">
              🗺️
            </div>
          )}
          
          {/* Overlay gradient on hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )} />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-[color:var(--color-primary)] transition-colors">
              {post.title}
            </h3>
            {isOwner && post._id && (
              <Link
                href={`/posts/${post._id}/edit`}
                className={cn(
                  "text-xs font-medium text-gray-500 hover:text-[color:var(--color-primary)]",
                  "underline transition-colors"
                )}
                aria-label={`Edit post ${post.title}`}
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
            )}
          </div>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {post.content || "No description available"}
          </p>

          {/* Metadata chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {post.locations?.slice(0, 2).map((loc) => (
              <LocationChip key={loc} location={loc} />
            ))}
            {post.tags && post.tags.length > 0 && <TagChips tags={post.tags.slice(0, 3)} />}
          </div>

          {/* Interactions */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <LikeButton
              postId={post._id || ""}
              initialCount={post.likedCount || 0}
              initiallyLiked={false}
            />
            <FavoriteToggle
              postId={post._id || ""}
              initialFavorites={post.favorites || []}
              userId={session?.userId}
            />
          </div>
        </div>
      </a>
    </article>
  );
}
