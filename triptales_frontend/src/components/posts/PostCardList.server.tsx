import React from "react";
import type { Post } from "@/types/post";
import PostCard from "./PostCard";

/**
 * PUBLIC_INTERFACE
 * PostCardList.server - Server Component wrapper to render a list of PostCard items.
 * Use this from client components via a dynamic import with ssr: true if needed,
 * or directly in server components/pages.
 */
export default async function PostCardListServer({ posts }: { posts: Array<Post & { _id?: string; author?: string }> }) {
  return (
    <>
      {posts.map((p) => (
        <PostCard key={p._id ?? p.title} post={p} />
      ))}
    </>
  );
}
