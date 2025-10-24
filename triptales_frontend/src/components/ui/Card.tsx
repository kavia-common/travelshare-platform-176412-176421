import { cn } from '@/lib/utils';

// PUBLIC_INTERFACE
export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  /** Simple card wrapper with Ocean Professional styles. */
  return (
    <div
      {...props}
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-100/60',
        className
      )}
    />
  );
}

// PUBLIC_INTERFACE
export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  /** Card header region. */
  return <div {...props} className={cn('px-5 pt-5', className)} />;
}

// PUBLIC_INTERFACE
export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  /** Card title. */
  return <h3 {...props} className={cn('text-lg font-semibold text-gray-900', className)} />;
}

// PUBLIC_INTERFACE
export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  /** Card content region. */
  return <div {...props} className={cn('px-5 pb-5', className)} />;
}
