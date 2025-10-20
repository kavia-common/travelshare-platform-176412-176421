import React from "react";
import type { Post } from "@/types/post";
import PostCard from "./PostCard";

// PUBLIC_INTERFACE
export default function PostGrid({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return <p className="text-gray-600">No posts yet.</p>;
  }
  return (
    <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((p) => (
        <li key={p._id || p.title}>
          <PostCard post={p} />
        </li>
      ))}
    </ul>
  );
}
