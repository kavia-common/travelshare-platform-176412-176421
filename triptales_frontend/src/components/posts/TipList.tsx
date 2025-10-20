import React from "react";
import type { PostTip } from "@/types/post";

// PUBLIC_INTERFACE
export default function TipList({ tips }: { tips: PostTip[] }) {
  if (!tips || tips.length === 0) {
    return <p className="text-gray-600">No tips yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {tips.map((t, i) => (
        <li key={`${t.text}-${i}`} className="rounded-md border border-gray-200 bg-white p-3">
          <p className="text-sm text-gray-800">{t.text}</p>
          {t.author && <p className="text-xs text-gray-500 mt-1">— {t.author}</p>}
        </li>
      ))}
    </ul>
  );
}
