'use client';

import PostForm from '@/components/posts/PostForm';
import { useState } from 'react';
import { Toast } from '@/components/ui/Toast';

export default function NewPostPage() {
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  return (
    <main className="app-container section-spacing">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Post</h1>
      <PostForm
        onSubmit={async () => {
          // Placeholder: send to /api/posts
          try {
            const res = await fetch('/api/posts', {
              method: 'POST',
              body: JSON.stringify({}),
              headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setToast({ message: 'Post saved (draft)', type: 'success' });
          } catch (e) {
            const err = e as { message?: string };
            setToast({ message: err?.message || 'Failed to save', type: 'error' });
          }
        }}
      />
      {toast && <div className="mt-4"><Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /></div>}
    </main>
  );
}
