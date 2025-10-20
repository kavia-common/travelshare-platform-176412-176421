import React from "react";
import { cn } from "@/lib/utils";
import { getInputStyles } from "@/lib/theme";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  helperText?: string;
};

// PUBLIC_INTERFACE
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, helperText, ...rest }, ref) => {
    const inputId = rest.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <input
          ref={ref}
          id={inputId}
          className={cn(
            getInputStyles(error),
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          {...rest}
        />
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-red-600" : "text-gray-500"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
