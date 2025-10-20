import React from "react";
import { cn } from "@/lib/utils";

// PUBLIC_INTERFACE
export default function LocationChip({ 
  location, 
  onRemove 
}: { 
  location: string; 
  onRemove?: () => void;
}) {
  return (
    <span
      className={cn(
        "chip bg-amber-50 text-amber-700 ring-1 ring-amber-200/70",
        "inline-flex items-center gap-1.5"
      )}
    >
      <span aria-hidden="true">📍</span>
      {location}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove location ${location}`}
          className={cn(
            "ml-0.5 rounded-full p-0.5",
            "hover:bg-amber-100 transition-colors"
          )}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </span>
  );
}
