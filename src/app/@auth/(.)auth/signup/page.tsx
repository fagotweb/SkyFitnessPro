'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';

export default function SignUpModalPage() {
  const router = useRouter();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="relative bg-white rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-6 text-slate-400 hover:text-black text-xl font-bold cursor-pointer border-none bg-none p-1"
          aria-label="Закрыть"
        >
          ✕
        </button>

        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
