import React, { JSX as ReactJSX } from "react";
import { cn } from "@/lib/utils";

/**
 * Polymorphic Card component with HTML-only tags
 */
type ElementTag = keyof Pick<ReactJSX.IntrinsicElements,
  "div" | "section" | "article" | "aside" | "main" | "header" | "footer">;

type PolymorphicProps<TTag extends ElementTag> =
  Omit<React.ComponentPropsWithoutRef<TTag>, "as" | "color"> & {
    as?: TTag;
    elevated?: boolean;
  };

// PUBLIC_INTERFACE
export function Card<TTag extends ElementTag = "div">({
  className,
  as,
  elevated = false,
  ...rest
}: PolymorphicProps<TTag>) {
  const Tag = (as || "div") as ElementTag;
  
  const cardClasses = cn(
    "bg-white rounded-lg border border-gray-100/50 transition-all duration-200",
    elevated 
      ? "shadow-lg hover:shadow-xl hover:-translate-y-1" 
      : "shadow-md hover:shadow-lg hover:-translate-y-0.5",
    "p-4 md:p-6",
    className
  );

  return (
    <Tag
      className={cardClasses}
      {...(rest as React.ComponentPropsWithoutRef<ElementTag>)}
    />
  );
}

// PUBLIC_INTERFACE
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  ...rest 
}) => (
  <div 
    className={cn("mb-4 pb-3 border-b border-gray-100", className)} 
    {...rest} 
  />
);

// PUBLIC_INTERFACE
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  className, 
  ...rest 
}) => (
  <h3 
    className={cn(
      "text-lg font-semibold tracking-tight text-gray-900",
      "leading-tight",
      className
    )} 
    {...rest} 
  />
);

// PUBLIC_INTERFACE
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  className, 
  ...rest 
}) => (
  <p 
    className={cn("text-sm text-gray-600 mt-1", className)} 
    {...rest} 
  />
);

// PUBLIC_INTERFACE
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  ...rest 
}) => (
  <div 
    className={cn("text-sm text-gray-700", className)} 
    {...rest} 
  />
);

// PUBLIC_INTERFACE
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  ...rest 
}) => (
  <div 
    className={cn(
      "mt-4 pt-4 border-t border-gray-100",
      "flex items-center gap-2",
      className
    )} 
    {...rest} 
  />
);
