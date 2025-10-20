"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

// PUBLIC_INTERFACE
export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  ...rest
}) => {
  const base = cn(
    "inline-flex items-center justify-center rounded-lg font-medium",
    "transition-all duration-200 select-none",
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
  );

  const sizes: Record<ButtonSize, string> = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: cn(
      "text-white bg-gradient-to-r from-[color:var(--color-primary)] to-blue-600",
      "shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
    ),
    secondary: cn(
      "text-white bg-gradient-to-r from-[color:var(--color-secondary)] to-amber-500",
      "shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
    ),
    ghost: cn(
      "text-gray-700 bg-transparent hover:bg-gray-100",
      "active:bg-gray-200"
    ),
    danger: cn(
      "text-white bg-[color:var(--color-error)]",
      "shadow-md hover:shadow-lg hover:brightness-110",
      "hover:scale-[1.02] active:scale-[0.98]"
    ),
    outline: cn(
      "text-gray-700 bg-white border-2 border-gray-300",
      "hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]",
      "shadow-sm hover:shadow-md"
    ),
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={cn(
        base,
        sizes[size],
        variants[variant],
        widthClass,
        getFocusRing(),
        className
      )}
      aria-busy={loading ? "true" : "false"}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      )}
      {children}
    </button>
  );
};
