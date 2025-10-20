"use client";

import React from "react";
import Link from "next/link";
import type { Post } from "@/types/post";
import PostCardClient from "./PostCard.client";

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg bg-white border border-gray-100">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function PostGrid({ posts }: { posts: Post[] }) {
  if (!posts) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
        <p className="text-gray-700">No posts yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Create the first one and inspire others!
        </p>
        <Link
          href="/posts/new"
          className="inline-block mt-3 text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm hover:brightness-105"
        >
          New Post
        </Link>
      </div>
    );
  }
  return (
    <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((p) => (
        <li key={p._id || p.title}>
          <PostCardClient post={p} />
        </li>
      ))}
    </ul>
  );
}
