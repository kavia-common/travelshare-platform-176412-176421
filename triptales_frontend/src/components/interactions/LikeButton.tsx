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

  const label = useMemo(() => (liked ? "Liked" : "Like"), [liked]);

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
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
          "text-sm font-medium transition-all duration-200",
          "border shadow-sm",
          liked
            ? cn(
                "bg-gradient-to-r from-red-50 to-pink-50",
                "border-red-200 text-red-700",
                "hover:from-red-100 hover:to-pink-100"
              )
            : cn(
                "bg-white border-gray-200 text-gray-700",
                "hover:bg-gray-50 hover:border-gray-300"
              ),
          "active:scale-95",
          getFocusRing()
        )}
        title={label}
      >
        <span 
          className={cn(
            "text-base transition-transform",
            liked && "animate-pulse"
          )} 
          aria-hidden="true"
        >
          {liked ? "❤️" : "🤍"}
        </span>
        <span>{label}</span>
        {count > 0 && (
          <span className={cn(
            "ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold",
            liked ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
          )}>
            {count}
          </span>
        )}
      </button>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
