"use client";

import React from "react";
import Link from "next/link";
import type { Post } from "@/types/post";
import PostCardClient from "./PostCard.client";
import { cn } from "@/lib/utils";

function SkeletonCard() {
  return (
    <div className={cn(
      "overflow-hidden rounded-xl bg-white border border-gray-100 shadow-md"
    )}>
      <div className="aspect-[4/3] skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 skeleton" />
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-5/6 skeleton" />
        <div className="flex gap-2 mt-3">
          <div className="h-6 w-20 skeleton rounded-full" />
          <div className="h-6 w-16 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function PostGrid({ posts }: { posts: Post[] }) {
  if (!posts) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <SkeletonCard />
          </li>
        ))}
      </ul>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={cn(
        "rounded-xl border-2 border-dashed border-gray-300 bg-white",
        "p-12 text-center shadow-sm"
      )}>
        <div className="text-6xl mb-4" aria-hidden="true">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No posts yet
        </h3>
        <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
          Create the first one and inspire others to share their adventures!
        </p>
        <Link
          href="/posts/new"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
            "text-sm font-medium text-white",
            "bg-gradient-to-r from-[color:var(--color-primary)] to-blue-600",
            "shadow-md hover:shadow-lg hover:scale-[1.02]",
            "active:scale-[0.98] transition-all duration-200"
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Post
        </Link>
      </div>
    );
  }

  return (
    <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((p) => (
        <li key={p._id || p.title}>
          <PostCardClient post={p} />
        </li>
      ))}
    </ul>
  );
}
