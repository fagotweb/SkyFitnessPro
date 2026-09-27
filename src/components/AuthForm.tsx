'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { isEmailValid, isPasswordSecure } from '@/utils/validation';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isLoginMode = mode === 'login';
  const router = useRouter();
  const { login } = useAuth();

  // Стейты для полей ввода
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // Стейт для хранения и вывода ошибок бэкенда
  const [errorMessage, setErrorMessage] = useState('');

  const emailOk = isEmailValid(email);
  const passwordOk = isPasswordSecure(password);

  // Кнопка заблокирована (Inactive), если поля пустые или пароль не проходит правила бэкенда (только для регистрации)
  const isButtonDisabled = isLoginMode
    ? !email.trim() || !password.trim()
    : !email.trim() || !emailOk || !passwordOk || !repeatPassword.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonDisabled) return;
    setErrorMessage('');

    if (!isLoginMode && password !== repeatPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }

    try {
      if (isLoginMode) {
        // 1. Получаем токен от сервера
        const data = await loginUser({ email, password });

        // 2. Передаем токен И email в наш контекст
        login(data.token, email);

        // 3. Возвращаемся на главную страницу
        router.back();
      } else {
        await registerUser({ email, password });
        alert('Регистрация прошла успешно! Теперь вы можете войти.');
        router.push('/auth/signin');
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Произошла непредвиденная ошибка');
      }
    }
  };

  return (
    <div className="bg-white rounded-[42px] w-[343px] md:w-[360px] shadow-sm border border-slate-100 flex flex-col items-center p-8 box-border justify-between transition-all">
      {/* Логотип */}
      <div
        className="mt-2 mb-4 shrink-0 cursor-pointer"
        onClick={() => router.back()} // Клик по логотипу закроет модалку
        title="Вернуться на главную"
      >
        <div className="relative w-[220px] h-[35px]">
          <Image
            src="/icons/logo.svg"
            alt="SkyFitnessPro"
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </div>
      </div>

      {/* Форма */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-3 flex-grow justify-end mt-4"
      >
        {/* Поле 1: Всегда Эл. почта */}
        <input
          type="email"
          placeholder="Эл. почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full h-[52px] px-4 rounded-[12px] border text-black placeholder:text-[#D0D0D0] text-[18px] focus:outline-none transition-colors box-border ${errorMessage ? 'border-[#F5222D]' : 'border-slate-200 focus:border-[#BCEC30]'}`}
        />

        {/* Поле 2: Пароль */}
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full h-[52px] px-4 rounded-[12px] border text-black placeholder:text-[#D0D0D0] text-[18px] focus:outline-none transition-colors box-border ${errorMessage ? 'border-[#F5222D]' : 'border-slate-200 focus:border-[#BCEC30]'}`}
        />

        {/* Поле 3: Повторите пароль (только в режиме регистрации) */}
        {!isLoginMode && (
          <input
            type="password"
            placeholder="Повторите пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full h-[52px] px-4 rounded-[12px] border border-slate-200 text-black placeholder:text-[#D0D0D0] text-[18px] focus:outline-none focus:border-[#BCEC30] transition-colors box-border"
          />
        )}

        {/*  КРАСНЫЙ ТЕКСТ ОШИБКИ: */}
        {errorMessage && (
          <div className="text-[#F5222D] text-xs font-normal text-center leading-tight px-2 mt-1 max-w-[280px] mx-auto whitespace-pre-line animate-fade-in">
            {errorMessage}
          </div>
        )}

        {/* Кнопка 1: Салатовая */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full h-[52px] bg-[#BCEC30] hover:bg-[#C2FF1A] active:bg-black active:text-white disabled:bg-[#F5F5F5] disabled:text-[#D0D0D0] disabled:cursor-not-allowed text-black text-[18px] font-medium rounded-full transition-colors mt-2 cursor-pointer flex items-center justify-center select-none shrink-0"
        >
          {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
        </button>

        {/* Кнопка 2: Переход */}
        <Link
          href={isLoginMode ? '/auth/signup' : '/auth/signin'}
          className="w-full h-[52px] bg-transparent border border-black hover:bg-[#F5F5F5] active:bg-[#E5E5E5] text-black text-[18px] font-normal rounded-full transition-colors flex items-center justify-center select-none shrink-0"
        >
          {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
        </Link>

        {/* Интерактивная подсказка требований к паролю при регистрации */}
        {!isLoginMode && !passwordOk && password.length > 0 && (
          <div className="text-[10px] text-slate-400 mt-1 text-center leading-none">
            Пароль требует: ≥6 симв., 1 заглавную, 2 спецсимвола (!@#$)
          </div>
        )}
      </form>
    </div>
  );
}
