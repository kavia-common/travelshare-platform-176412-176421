"use client";

import React, { useState } from "react";
import PostForm from "@/components/posts/PostForm";
import type { Post } from "@/types/post";
import { Toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const onSubmit = async (data: Post) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setToast({ message: "Failed to create post", type: "error" });
      return;
    }
    const created = (await res.json()) as Post;
    setToast({ message: "Post created", type: "success" });
    router.push(`/posts/${created._id}`);
  };

  return (
    <main className="app-container py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Create a new TripTale</h1>
      <PostForm onSubmit={onSubmit} />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}
