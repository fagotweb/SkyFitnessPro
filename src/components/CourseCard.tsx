'use client';

import Image from 'next/image';
import { Course } from '@/sharedTypes/course';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addCourseAction } from '@/app/actions';
import { useState } from 'react';

interface CourseCardProps {
  course: Course;
  isProfileMode?: boolean; // Для переключения плюс/минус
  progress?: number; // Для передачи процентов прогресса
  isAlreadyAdded?: boolean;
  onAdded?: (id: string) => void;
  onRemove?: (id: string) => void;
  onCardClick?: (course: Course) => void;
}

export default function CourseCard({
  course,
  isProfileMode = false,
  progress = 0,
  isAlreadyAdded = false,
  onAdded,
  onRemove,
  onCardClick,
}: CourseCardProps & { onRemove?: (id: string) => void }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow w-[360px] h-auto pb-5 box-border relative overflow-hidden">
      {notice && (
        <div
          className="absolute top-14 right-4 z-30 bg-[#202020] text-white text-xs font-medium px-3 py-2 rounded-xl shadow-lg"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          {notice}
        </div>
      )}
      {/* Кнопка плюс/минус */}
      <div
        className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center z-20 ${
          isPending ? 'cursor-wait opacity-50' : 'cursor-pointer'
        }`}
        title={isProfileMode ? 'Удалить курс' : 'Добавить курс'}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (isPending) return;

          // Если курс уже добавлен — не делаем запрос
          if (!isProfileMode && isAlreadyAdded) {
            showNotice('Курс уже в вашем профиле');
            return;
          }

          if (isProfileMode) {
            if (onRemove) await onRemove(course._id);
            return;
          }

          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/auth/signin');
            return;
          }

          setIsPending(true);
          try {
            await addCourseAction(course._id, token);
            showNotice('Курс добавлен');
            onAdded?.(course._id);
            router.refresh();
          } catch (error) {
            if (error instanceof Error && error.message === 'UNAUTHORIZED') {
              localStorage.removeItem('token');
              router.push('/auth/signin');
              return;
            }
            const msg =
              error instanceof Error ? error.message.toLowerCase() : '';
            if (msg.includes('уже')) {
              showNotice('Курс уже в вашем профиле');
              return;
            }
            console.error('Ошибка:', error);
            showNotice('Не удалось добавить курс');
          } finally {
            setIsPending(false);
          }
        }}
      >
        {isProfileMode ? (
          <Image
            src="/icons/minus.svg"
            alt="Удалить"
            width={32}
            height={32}
            unoptimized
          />
        ) : (
          <Image
            src="/icons/plus.svg"
            alt="Добавить"
            width={32}
            height={32}
            unoptimized
          />
        )}
      </div>

      <Link
        href={isProfileMode ? '#' : `/courses/${course._id}`}
        className="no-underline block relative"
        onClick={(e) => {
          if (isProfileMode) {
            e.preventDefault(); // Отменяем переход по '#'

            // Проверка: если кликнули именно по телу карточки, а не по кнопке минуса
            const target = e.target as HTMLElement;
            if (!target.closest('.absolute.top-4.right-4')) {
              if (onCardClick) onCardClick(course); // Открываем модалку уроков
            }
          }
        }}
      >
        {/* Блок картинки */}
        <div
          className={`${course.imageBg} w-full h-[325px] min-h-[325px] rounded-t-[32px] relative overflow-hidden flex items-center justify-center shrink-0`}
        >
          <Image
            src={course.image}
            alt={course.nameRU}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            loading="eager" // Убирает варнинг про LCP для первых картинок
            className="object-cover pointer-events-none"
          />
        </div>

        {/* Текстовый блок */}
        <div className="w-full px-5 pt-3 pb-5 flex flex-col justify-between flex-grow box-border">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[30px] font-bold leading-none tracking-tight text-black m-0 truncate">
              {course.nameRU}
            </h3>

            <div className="flex flex-row flex-wrap gap-1.5 text-xs text-black font-normal w-[300px]">
              <span className="bg-[#F5F5F5] h-[38px] px-3 py-1.5 rounded-full flex items-center gap-1.5 box-border">
                <Image
                  src="/icons/calendar.svg"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                />
                {course.durationInDays} дней
              </span>
              <span className="bg-[#F5F5F5] h-[38px] px-3 py-1.5 rounded-full flex items-center gap-1.5 box-border">
                <Image
                  src="/icons/watch.svg"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                />
                {course.dailyDurationInMinutes.from}-
                {course.dailyDurationInMinutes.to} мин/день
              </span>
              <span
                className="bg-[#F5F5F5] h-[38px] px-3 py-1.5 rounded-full flex items-center gap-1.5 box-border cursor-help"
                title={`Уровень сложности: ${course.difficulty || 'начальный'}`}
              >
                <Image
                  src="/icons/network.svg"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                  className="shrink-0"
                />
                Сложность
              </span>
            </div>
          </div>

          {/* Нижняя группа: Прогресс и Кнопка для профиля */}
          {isProfileMode && (
            <div className="flex flex-col w-full mt-auto pt-2">
              <div className="flex flex-col gap-2 mb-4">
                <div className="text-sm font-normal text-black font-sans leading-none pl-0.5">
                  Прогресс {progress}%
                </div>
                <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0071EE] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <button
                className="w-full h-[46px] bg-[#BCEC30] hover:bg-[#C2FF1A] text-black font-semibold rounded-full transition-colors flex items-center justify-center text-sm cursor-pointer border-none font-sans"
                onClick={(e) => {
                  e.stopPropagation(); // Исключаем переход по ссылке карточки
                  if (onCardClick) {
                    onCardClick(course); // Вызываем открытие модалки выбора уроков
                  }
                }}
              >
                {progress === 100
                  ? 'Начать заново'
                  : progress === 0
                    ? 'Начать тренировки'
                    : 'Продолжить'}
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
