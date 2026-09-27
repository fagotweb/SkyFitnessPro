'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  showTagline?: boolean;
}

export default function Header({ showTagline = true }: HeaderProps) {
  const router = useRouter();
  const { userEmail, logout } = useAuth(); // Забираем email и функцию выхода
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Получение имени
  const displayHeaderName = userEmail
    ? userEmail.split('@')[0]
    : 'Пользователь';
  const formattedHeaderName =
    displayHeaderName.charAt(0).toUpperCase() + displayHeaderName.slice(1);

  const pathname = usePathname();

  const handleLogoutClick = () => {
    logout(); // Сбрасываем контекст и очищаем токен
    setIsMenuOpen(false);
    // На профиле — на главную, на других страницах — остаёмся
    if (pathname === '/profile') {
      router.push('/');
    } else {
      router.refresh();
    }
  };

  return (
    <header className="flex justify-between items-center mb-6 md:mb-12 relative">
      {/* Вуаль для закрытия меню по клику вокруг */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="flex flex-col">
        <Link
          href="/"
          className="relative w-[160px] h-[25.5px] md:w-[220px] md:h-[35px]"
        >
          <Image
            src="/icons/logo.svg"
            alt="SkyFitnessPro"
            fill
            unoptimized
            className="object-contain"
          />
        </Link>
        {showTagline && (
          <p className="hidden lg:block text-[18px] text-black/50 mt-1 pl-[44px] tracking-normal font-normal whitespace-nowrap">
            Онлайн-тренировки для занятий дома
          </p>
        )}
      </div>

      {userEmail ? (
        // Блок авторизованного пользователя
        <div className="relative z-40">
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 cursor-pointer select-none py-2"
          >
            <div className="w-10 h-10 shrink-0 relative">
              <Image
                src="/icons/user.svg"
                alt="Профиль"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <span className="text-black font-normal text-[18px] font-sans flex items-center gap-1.5">
              {formattedHeaderName}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://w3.org"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* Выпадающее меню */}
          {isMenuOpen && (
            <div className="absolute right-0 top-14 bg-white rounded-[24px] p-6 shadow-xl border border-slate-100 flex flex-col items-center w-[220px] box-border animate-in fade-in zoom-in-95 duration-150">
              <span className="text-black font-medium text-[18px] mb-1 font-sans">
                {formattedHeaderName}
              </span>
              <span className="text-[#A1A1A1] font-normal text-[14px] mb-4 font-sans truncate w-full text-center">
                {userEmail}
              </span>

              <Link
                href="/profile"
                className="w-full no-underline mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <button className="w-full h-[46px] bg-[#BCEC30] hover:bg-[#C2FF1A] text-black font-medium rounded-full transition-colors flex items-center justify-center text-[16px] cursor-pointer border-none font-sans">
                  Мой профиль
                </button>
              </Link>

              <button
                onClick={handleLogoutClick}
                className="w-full h-[46px] bg-transparent text-black border border-black hover:bg-slate-50 font-normal text-[16px] rounded-full transition-colors flex items-center justify-center cursor-pointer font-sans"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      ) : (
        // Блок неавторизованного пользователя
        <Link href="/auth/signin" className="no-underline">
          <button className="bg-[#BCEC30] hover:bg-[#a6d423] text-black font-medium rounded-3xl transition-colors text-xs md:text-sm w-[83px] h-[36px] md:w-[103px] md:h-[52px] flex items-center justify-center shrink-0 cursor-pointer border-none font-sans">
            Войти
          </button>
        </Link>
      )}
    </header>
  );
}
