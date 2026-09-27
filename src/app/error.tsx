'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-[40px] font-bold text-black mb-4">Что-то пошло не так</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        {error.message || 'Попробуйте обновить страницу'}
      </p>
      <button
        onClick={reset}
        className="bg-[#BCEC30] hover:bg-[#C2FF1A] text-black font-medium rounded-full px-8 py-3 transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  );
}