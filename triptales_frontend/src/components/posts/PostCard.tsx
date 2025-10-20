import React from "react";
import Image from "next/image";
import type { Post } from "@/types/post";

import TagChips from "./TagChips";
import LocationChip from "./LocationChip";
import { LikeButton } from "@/components/interactions/LikeButton";
import { FavoriteToggle } from "@/components/interactions/FavoriteToggle";

// PUBLIC_INTERFACE
export default function PostCard({ post }: { post: Post }) {
  const thumb = post.images?.[0];

  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100 transition hover:shadow-md">
      <a href={`/posts/${post._id}`} aria-label={`Open post ${post.title}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          {thumb ? (
            <Image
              src={thumb.url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-3xl">🗺️</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.content || " "}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {post.locations?.slice(0, 2).map((loc) => (
              <LocationChip key={loc} location={loc} />
            ))}
            {post.tags && post.tags.length > 0 && <TagChips tags={post.tags.slice(0, 3)} />}
          </div>

          {/* Interactions */}
          <div className="mt-3 flex items-center justify-between">
            <LikeButton
              postId={post._id || ""}
              initialCount={post.likedCount || 0}
              initiallyLiked={false /* anonymous: no persisted like marker */}
            />
            <FavoriteToggle
              postId={post._id || ""}
              initialFavorites={post.favorites || []}
              userId={undefined /* anonymous for now */}
            />
          </div>
        </div>
      </a>
    </article>
  );
}
