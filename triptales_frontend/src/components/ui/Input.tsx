import React from "react";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// PUBLIC_INTERFACE
export const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
        "hover:border-gray-400",
        "focus:border-[color:var(--color-primary)]",
        getFocusRing(),
        className
      )}
      {...rest}
    />
  );
};
