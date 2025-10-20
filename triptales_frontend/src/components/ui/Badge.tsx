import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "danger";

// PUBLIC_INTERFACE
export const Badge: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }
> = ({ className, variant = "default", ...rest }) => {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    success: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    warning: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    danger: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...rest}
    />
  );
};
