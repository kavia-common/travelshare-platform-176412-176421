import { cn } from '@/lib/utils';

export type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  className?: string;
  onClose?: () => void;
};

// PUBLIC_INTERFACE
export function Toast({ message, type = 'info', className = '', onClose }: ToastProps) {
  /** Simple inline toast banner. */
  const styles =
    type === 'success'
      ? 'bg-green-50 text-green-700 border-green-200'
      : type === 'error'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div className={cn('px-3 py-2 rounded-md border text-sm', styles, className)}>
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded hover:bg-white/50"
            aria-label="Close"
            type="button"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
