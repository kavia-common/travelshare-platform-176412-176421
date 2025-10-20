"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

// PUBLIC_INTERFACE
export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors select-none";
  const sizes: Record<ButtonSize, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-3",
  };
  const variants: Record<ButtonVariant, string> = {
    primary:
      "text-white bg-[color:var(--color-primary)] hover:brightness-105 active:brightness-95 shadow-sm",
    secondary:
      "text-gray-900 bg-amber-200 hover:bg-amber-300 active:bg-amber-400",
    ghost:
      "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    danger:
      "text-white bg-[color:var(--color-error)] hover:brightness-105 active:brightness-95",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], getFocusRing(), className)}
      aria-busy={loading ? "true" : "false"}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
        />
      )}
      {children}
    </button>
  );
};
