import React from "react";

// PUBLIC_INTERFACE
export default function TagChips({ tags, onRemove }: { tags: string[]; onRemove?: (t: string) => void }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 ring-1 ring-blue-200">
          #{t}
          {onRemove && (
            <button
              type="button"
              aria-label={`Remove tag ${t}`}
              onClick={() => onRemove(t)}
              className="ml-1 rounded-full px-1 hover:bg-blue-100"
            >
              ✕
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
