type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      className='flex min-h-40 items-center justify-center rounded-x1 border border-slate-200 bg-white p-6 shadow-sm'
    >
      <div className='flex items-center gap-3'>
        <span
          aria-hidden='true'
          className='size-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600'
        />

        <p className='text-sm font-medium text-slate-600'>{message}</p>
      </div>
    </div>
  );
}
