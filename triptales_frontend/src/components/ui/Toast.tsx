"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "info" | "success" | "error";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // ms
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

  useEffect(() => {
    const t = setTimeout(() => {
      setOpen(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  if (!open) return null;

  const styles: Record<ToastType, string> = {
    info: "bg-blue-600 text-white",
    success: "bg-amber-600 text-white",
    error: "bg-red-600 text-white",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md shadow-md",
        styles[type]
      )}
    >
      {message}
    </div>
  );
};
