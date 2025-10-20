import React from "react";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

// PUBLIC_INTERFACE
export const Select: React.FC<SelectProps> = ({ className, children, ...rest }) => {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
        "hover:border-gray-400",
        "focus:border-[color:var(--color-primary)]",
        getFocusRing(),
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
};
