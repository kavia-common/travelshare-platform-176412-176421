"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "info" | "success" | "error" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

// PUBLIC_INTERFACE
export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const [open, setOpen] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setOpen(false);
        onClose?.();
      }, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!open) return null;

  const styles: Record<ToastType, { bg: string; icon: string }> = {
    info: { 
      bg: "bg-blue-600 text-white", 
      icon: "ℹ️" 
    },
    success: { 
      bg: "bg-emerald-600 text-white", 
      icon: "✓" 
    },
    error: { 
      bg: "bg-red-600 text-white", 
      icon: "✕" 
    },
    warning: { 
      bg: "bg-amber-600 text-white", 
      icon: "⚠" 
    },
  };

  const config = styles[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "px-5 py-3 rounded-lg shadow-xl",
        "flex items-center gap-3 min-w-[280px] max-w-md",
        config.bg,
        "transition-all duration-200",
        isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      )}
    >
      <span className="text-lg" aria-hidden="true">
        {config.icon}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setOpen(false);
            onClose?.();
          }, 200);
        }}
        className="text-white/80 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
