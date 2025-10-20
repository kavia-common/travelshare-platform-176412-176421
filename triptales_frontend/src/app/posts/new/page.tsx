"use client";

import React, { useState } from "react";
import PostForm from "@/components/posts/PostForm";
import type { Post } from "@/types/post";
import { Toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
    setToast({ message: "Post created successfully!", type: "success" });
    setTimeout(() => {
      router.push(`/posts/${created._id}`);
    }, 800);
  };

  return (
    <main className="app-container section-spacing">
      {/* Hero Section */}
      <header className="mb-8 text-center">
        <h1 className={cn(
          "text-3xl md:text-4xl font-bold tracking-tight mb-3",
          "bg-gradient-to-r from-[color:var(--color-primary)] via-blue-600 to-blue-500",
          "bg-clip-text text-transparent"
        )}>
          Create Your TripTale
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Share your travel adventures with the world. Upload photos, add tips, and inspire fellow travelers.
        </p>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <PostForm onSubmit={onSubmit} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}
