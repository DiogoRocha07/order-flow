type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Não foi possível carregar os dados.",
  message,
  retryLabel = "Tentar novamente",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role='alert'
      className='rounded-x1 border border-red-200 bg-red-50 p-6'
    >
      <h2 className='font-semibold text-red-900'>{title}</h2>

      <p className='mt-1 text-sm text-red-700'>{message}</p>

      {onRetry && (
        <button
          type='button'
          onClick={onRetry}
          className='mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300'
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
