"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/post";

/**
 * PUBLIC_INTERFACE
 * PostCardClient - Client-only lightweight card without session ownership controls.
 * Use in client contexts where importing Server Components is not allowed.
 */
export default function PostCardClient({ post }: { post: Post & { _id?: string; author?: string } }) {
  const thumb = post.images && post.images.length > 0 ? post.images[0] : undefined;

  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100 transition hover:shadow-md">
      <a
        href={`/posts/${post._id ?? ""}`}
        aria-label={`Open post: ${post.title}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(37,99,235,0.6)]"
      >
        <div className="relative aspect-[4/3] bg-gray-100">
          {thumb ? (
            <Image
              src={thumb.url}
              alt={thumb.publicId ? `${post.title} – photo ${thumb.publicId}` : post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-3xl" aria-hidden="true">
              🗺️
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.content || " "}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {post.locations?.slice(0, 2).map((loc) => (
              <span key={loc} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {loc}
              </span>
            ))}
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-1 text-xs">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Link href={`/posts/${post._id ?? ""}`} className="text-sm text-blue-600 hover:underline">
              View
            </Link>
          </div>
        </div>
      </a>
    </article>
  );
}
