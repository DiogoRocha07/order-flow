type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const hasAction = actionLabel && onAction;

  return (
    <div className='rounded-x1 border border-dashed border-slate-300 bg-white px-6 py-12 text-center'>
      <div
        aria-hidden='true'
        className='mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-x1 text-slate-500'
      >
        -
      </div>

      <h2 className='mt-4 text-lg font-semibold text-slate-900'>{title}</h2>

      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600'>
        {description}
      </p>

      {hasAction && (
        <button
          type='button'
          onClick={onAction}
          className='mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300'
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
