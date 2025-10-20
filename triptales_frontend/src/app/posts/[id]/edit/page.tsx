"use client";

import React, { useEffect, useState } from "react";
import PostForm from "@/components/posts/PostForm";
import type { Post } from "@/types/post";
import { Toast } from "@/components/ui/Toast";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      const res = await fetch(`/api/posts/${params.id}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = (await res.json()) as Post;
      if (!ignore) {
        setPost(json);
        setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [params.id]);

  const onSubmit = async (data: Post) => {
    const res = await fetch(`/api/posts/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setToast({ message: "Failed to update post", type: "error" });
      return;
    }
    const updated = (await res.json()) as Post;
    setToast({ message: "Post updated", type: "success" });
    router.push(`/posts/${updated._id}`);
  };

  if (loading) {
    return (
      <main className="app-container py-6">
        <p className="text-gray-600">Loading…</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="app-container py-6">
        <p className="text-red-600">Post not found.</p>
      </main>
    );
  }

  return (
    <main className="app-container py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Edit post</h1>
      <PostForm initialValue={post} onSubmit={onSubmit} />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}
