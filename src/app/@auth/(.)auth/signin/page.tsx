'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';

export default function SignInModalPage() {
  const router = useRouter();

  // Закрытие при клике на темный фон вокруг формы
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back();
    }
  };

  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {/* Контейнер теперь не имеет фиксированной высоты и плавно подстраивается под форму */}
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
