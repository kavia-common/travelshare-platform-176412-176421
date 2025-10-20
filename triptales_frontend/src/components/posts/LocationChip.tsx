import React from "react";

// PUBLIC_INTERFACE
export default function LocationChip({ location, onRemove }: { location: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-200">
      📍 {location}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove location ${location}`}
          className="ml-1 rounded-full px-1 hover:bg-amber-100"
        >
          ✕
        </button>
      )}
    </span>
  );
}
