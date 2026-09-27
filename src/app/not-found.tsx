import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-[120px] font-bold text-[#BCEC30] leading-none">404</h1>
      <h2 className="text-[32px] font-bold text-black mb-4">Страница не найдена</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        Возможно, курс был удалён или вы перешли по неверной ссылке
      </p>
      <Link
        href="/"
        className="bg-[#BCEC30] hover:bg-[#C2FF1A] text-black font-medium rounded-full px-8 py-3 transition-colors no-underline"
      >
        На главную
      </Link>
    </div>
  );
}