"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
  size?: "sm" | "md" | "lg" | "xl";
}

// PUBLIC_INTERFACE
export const Modal: React.FC<ModalProps> = ({ 
  open, 
  onClose, 
  title, 
  children, 
  initialFocusRef,
  size = "md"
}) => {
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Initial focus
  useEffect(() => {
    if (open) {
      const target = initialFocusRef?.current || overlayRef.current?.querySelector<HTMLElement>("[data-autofocus]");
      target?.focus();
    }
  }, [open, initialFocusRef]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "animate-in fade-in duration-200"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop with blur */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm",
          "transition-opacity duration-200"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={overlayRef}
        className={cn(
          "relative z-10 w-full rounded-xl bg-white shadow-2xl",
          "border border-gray-100",
          "animate-in zoom-in-95 duration-200",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        {title && (
          <header className={cn(
            "flex items-center justify-between gap-4",
            "border-b border-gray-100 px-6 py-4"
          )}>
            <h2 
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                "rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                "transition-colors duration-200",
                getFocusRing()
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
