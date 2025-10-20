import React from "react";
import { cn } from "@/lib/utils";
import { getInputStyles } from "@/lib/theme";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
  helperText?: string;
};

// PUBLIC_INTERFACE
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error = false, helperText, children, ...rest }, ref) => {
    const selectId = rest.id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              getInputStyles(error),
              "appearance-none pr-10 cursor-pointer",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={helperText ? `${selectId}-helper` : undefined}
            {...rest}
          >
            {children}
          </select>
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg 
              className="h-4 w-4 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {helperText && (
          <p
            id={`${selectId}-helper`}
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

Select.displayName = "Select";
