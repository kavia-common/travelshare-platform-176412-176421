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
      setToast({ message: isFavorited ? "Removed from favorites" : "Added to favorites", type: "success" });
      onChange?.(
        isFavorited
          ? prevFavorites.filter((f) => f !== marker)
          : [...prevFavorites, marker]
      );
    }
  }, [favorites, isFavorited, loading, onChange, postId, userId, marker]);

  return (
    <div className={cn("inline-flex items-center", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-pressed={isFavorited ? "true" : "false"}
        className={cn(
          "text-sm px-3 py-1.5 rounded-md border shadow-sm bg-white hover:bg-gray-50",
          isFavorited ? "border-blue-300 text-blue-700" : "border-gray-200 text-gray-700",
          "active:translate-y-[0.5px]",
          getFocusRing()
        )}
        title={isFavorited ? "Unfavorite" : "Favorite"}
      >
        <span className="mr-1" aria-hidden="true">
          {isFavorited ? "⭐" : "☆"}
        </span>
        {isFavorited ? "Favorited" : "Favorite"}
      </button>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
