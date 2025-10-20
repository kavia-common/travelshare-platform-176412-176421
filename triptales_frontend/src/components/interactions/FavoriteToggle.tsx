"use client";

import React, { useCallback, useMemo, useState } from "react";
import { toggleFavoriteOptimistic } from "@/lib/client/mutations";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";
import { Toast } from "@/components/ui/Toast";

export type FavoriteToggleProps = {
  postId: string;
  /** The known favorites (e.g., user IDs). If no auth, can be a local placeholder list. */
  initialFavorites?: string[];
  /** Current user id (optional). If omitted, performs local-only favorite toggle. */
  userId?: string;
  /** Optional callback when favorites change */
  onChange?: (favorites: string[]) => void;
  className?: string;
};

// PUBLIC_INTERFACE
export const FavoriteToggle: React.FC<FavoriteToggleProps> = ({
  postId,
  initialFavorites = [],
  userId,
  onChange,
  className,
}) => {
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const marker = userId || "anon";
  const isFavorited = useMemo(() => favorites.includes(marker), [favorites, marker]);

  const onClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const prevFavorites = favorites;

    const result = await toggleFavoriteOptimistic({
      postId,
      currentFavorites: favorites,
      userId, // may be undefined; helper will do local-only in that case
      apply: (next) => setFavorites(next),
      rollback: () => setFavorites(prevFavorites),
    });

    setLoading(false);
    if (!result.ok) {
      setToast({ message: result.error || "Failed to update favorite", type: "error" });
    } else {
      onChange?.(
        isFavorited
          ? prevFavorites.filter((f) => f !== marker)
          : [...prevFavorites, marker]
      );
    }
  }, [favorites, isFavorited, loading, onChange, postId, userId, marker]);

  const count = favorites.length;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-pressed={isFavorited ? "true" : "false"}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
          "text-sm font-medium transition-all duration-200",
          "border shadow-sm",
          isFavorited
            ? cn(
                "bg-gradient-to-r from-amber-50 to-yellow-50",
                "border-amber-200 text-amber-700",
                "hover:from-amber-100 hover:to-yellow-100"
              )
            : cn(
                "bg-white border-gray-200 text-gray-700",
                "hover:bg-gray-50 hover:border-gray-300"
              ),
          "active:scale-95",
          getFocusRing()
        )}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <span 
          className={cn(
            "text-base transition-transform",
            isFavorited && "animate-pulse"
          )} 
          aria-hidden="true"
        >
          {isFavorited ? "⭐" : "☆"}
        </span>
        <span>{isFavorited ? "Saved" : "Save"}</span>
        {count > 0 && (
          <span className={cn(
            "ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold",
            isFavorited ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
          )}>
            {count}
          </span>
        )}
      </button>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
