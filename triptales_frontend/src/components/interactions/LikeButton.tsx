"use client";

import React, { useCallback, useMemo, useState } from "react";
import { adjustLikeCountOptimistic } from "@/lib/client/mutations";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";
import { Toast } from "@/components/ui/Toast";

export type LikeButtonProps = {
  postId: string;
  initialCount?: number;
  /** In absence of auth, allow parent to tell if the current viewer has liked (local tracking) */
  initiallyLiked?: boolean;
  /** Optional: notify parent about like state change */
  onChange?: (liked: boolean, count: number) => void;
  className?: string;
};

// PUBLIC_INTERFACE
export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialCount = 0,
  initiallyLiked = false,
  onChange,
  className,
}) => {
  const [count, setCount] = useState<number>(initialCount || 0);
  const [liked, setLiked] = useState<boolean>(initiallyLiked);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const label = useMemo(() => (liked ? "Unlike" : "Like"), [liked]);

  const onClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const prevLiked = liked;
    const prevCount = count;

    // optimistic toggle like
    setLiked(!prevLiked);
    setCount((c) => Math.max(0, c + (prevLiked ? -1 : 1)));

    const result = await adjustLikeCountOptimistic({
      postId,
      currentCount: prevCount,
      isLiking: !prevLiked,
      apply: () => {
        // already applied above
      },
      rollback: () => {
        setLiked(prevLiked);
        setCount(prevCount);
      },
    });

    setLoading(false);

    if (!result.ok) {
      setToast({ message: result.error || "Failed to update like", type: "error" });
    } else {
      setToast({ message: prevLiked ? "Unliked" : "Liked!", type: "success" });
      onChange?.(!prevLiked, Math.max(0, prevCount + (prevLiked ? -1 : 1)));
    }
  }, [loading, liked, count, onChange, postId]);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-pressed={liked ? "true" : "false"}
        className={cn(
          "text-sm px-3 py-1.5 rounded-md border shadow-sm bg-white hover:bg-gray-50",
          liked ? "border-amber-300 text-amber-700" : "border-gray-200 text-gray-700",
          "active:translate-y-[0.5px]",
          getFocusRing()
        )}
        title={label}
      >
        <span className="mr-1" aria-hidden="true">
          {liked ? "❤️" : "🤍"}
        </span>
        {label}
      </button>
      <span className="text-sm text-gray-700" aria-label="Like count">
        {count}
      </span>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
