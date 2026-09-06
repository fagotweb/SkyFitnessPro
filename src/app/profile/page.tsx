'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import { Course, UserProfile } from '@/sharedTypes/course';
import { useAuth } from '@/context/AuthContext';
import {
  getCourses,
  getUserProfile,
  removeCourseFromUser,
} from '@/services/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout, userEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.replace('/');
      return;
    }

    async function loadData() {
      try {
        // Запрашиваем данные параллельно
        const [userProf, coursesList] = await Promise.all([
          getUserProfile().catch(() => null), // Если бэк упадет, запишем null вместо краша всего приложения
          getCourses().catch(() => []), // Если курсы не загрузятся, вернем пустой массив
        ]);

        if (userProf) {
          setProfile(userProf);
        }
        setAllCourses(coursesList);
      } catch (error) {
        console.error('Ошибка загрузки данных профиля:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleRemoveCourse = async (courseId: string) => {
    if (!profile) return;
    try {
      // 1. Отправляем реальный запрос на удаление в API
      await removeCourseFromUser(courseId);

      // 2. Сразу обновляем стейт: убираем удаленный ID из массива selectedCourses
      setProfile({
        ...profile,
        selectedCourses: profile.selectedCourses.filter(
          (id) => id !== courseId
        ),
      });
    } catch (error) {
      console.error('Не удалось удалить курс с сервера:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-lg font-medium text-black">
        Загрузка профиля...
      </div>
    );
  }

  // Фильтруем курсы: показываем только те, ID которых есть в selectedCourses пользователя
    // 1. Получаем массив реальных ID курсов, которые пользователь добавил в профиль
  const serverSelectedIds: string[] = profile?.selectedCourses || [];

  // 2. Честно фильтруем курсы: на экране появятся ТОЛЬКО те, чьи ID совпали с массивом бэка
  const userCourses: Course[] = allCourses.filter((course: Course) => {
    return serverSelectedIds.includes(course._id);
  });

  // 3. Вычисляем имя пользователя для профиля из контекста
  const displayEmail: string = profile?.email || userEmail || 'alex123@mail.ru';
  const emailParts: string[] = displayEmail.split('@');
  const userName: string = emailParts[0] || 'Пользователь';
  const formattedName: string = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-black pb-12">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6">
        <Header />

        <main className="mt-4">
          {/* Блок Профиля */}
          <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm mb-12">
            <h1 className="text-[40px] font-bold tracking-tight mb-6">
              Профиль
            </h1>

            <div className="flex items-start gap-6">
              {/* Аватар по макету */}
              <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center shrink-0 relative overflow-hidden">
                <Image
                  src="/icons/prof.svg"
                  alt="Аватар профиля"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>

              {/* Данные */}
              <div className="flex flex-col gap-1 justify-center pt-2">
                <h2 className="text-[32px] font-medium leading-none mb-2">
                  {formattedName}
                </h2>
                <p className="text-base text-slate-400 font-normal">
                  Логин: {displayEmail}
                </p>

                <button
                  onClick={() => {
                    logout();
                    // ЗАМЕНИЛИ: Переходим на главную через роутер Next.js
                    router.push('/');
                  }}
                  className="w-max mt-4 border border-black rounded-full px-6 py-2.5 text-base font-normal hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer font-sans"
                >
                  Выйти
                </button>
              </div>
            </div>
          </section>

          {/* Блок Мои курсы */}
          <section>
            <h2 className="text-[40px] font-bold tracking-tight mb-6">
              Мои курсы
            </h2>

            {userCourses.length === 0 ? (
              <p className="text-lg text-slate-400">
                У вас пока нет выбранных курсов. Добавьте их на главной
                странице!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center md:justify-items-start">
                {userCourses.map((course) => {
                  // Имитируем разный прогресс из макета
                  let currentProgress = 0;
                  // Сравниваем по названию, так как ID теперь могут быть серверными динамическими строками
                  if (course.nameRU?.includes('Йога')) currentProgress = 40;
                  if (course.nameRU?.includes('Фитнес')) currentProgress = 100;

                  return (
                    <CourseCard
                      key={course._id} // Ключ теперь железно привязан к уникальному ID
                      course={course} // Передаем готовый объект из отфильтрованного массива
                      isProfileMode={true}
                      progress={currentProgress}
                      onRemove={handleRemoveCourse}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
