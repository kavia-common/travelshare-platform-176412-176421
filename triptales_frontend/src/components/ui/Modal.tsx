"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

// PUBLIC_INTERFACE
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, initialFocusRef }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Initial focus
  useEffect(() => {
    if (open) {
      const target = initialFocusRef?.current || overlayRef.current?.querySelector<HTMLElement>("[data-autofocus]");
      target?.focus();
    }
  }, [open, initialFocusRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={overlayRef}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-lg bg-white shadow-lg",
          "focus:outline-none"
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 p-4">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <Button aria-label="Close dialog" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
