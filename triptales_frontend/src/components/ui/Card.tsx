import React, { JSX as ReactJSX } from "react";
import { cn } from "@/lib/utils";

/**
 * Polymorphic Card component with HTML-only tags
 */
type ElementTag = keyof Pick<ReactJSX.IntrinsicElements,
  // limit to common HTML container tags only (exclude SVG)
  "div" | "section" | "article" | "aside" | "main" | "header" | "footer">;

type PolymorphicProps<TTag extends ElementTag> =
  Omit<React.ComponentPropsWithoutRef<TTag>, "as" | "color"> & {
    as?: TTag;
  };

// PUBLIC_INTERFACE
export function Card<TTag extends ElementTag = "div">(
  { className, as, ...rest }: PolymorphicProps<TTag>
) {
  const Tag = (as || "div") as ElementTag;
  return (
    <Tag
      className={cn(
        "card-surface p-4 md:p-6",
        className
      )}
      {...(rest as React.ComponentPropsWithoutRef<ElementTag>)}
    />
  );
}

// PUBLIC_INTERFACE
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn("mb-3", className)} {...rest} />
);

// PUBLIC_INTERFACE
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...rest }) => (
  <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...rest} />
);

// PUBLIC_INTERFACE
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn("text-sm text-gray-700", className)} {...rest} />
);

// PUBLIC_INTERFACE
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn("mt-4 pt-4 border-t border-gray-100", className)} {...rest} />
);
