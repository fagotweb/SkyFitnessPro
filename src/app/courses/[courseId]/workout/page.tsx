'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import WorkoutModals from '@/components/WorkoutModals';
import { apiFetch } from '@/services/api';
import { Course } from '@/sharedTypes/course';

interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

interface WorkoutData {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

interface WorkoutVideoPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function WorkoutVideoPage({ params }: WorkoutVideoPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Распаковываем асинхронные параметры роута с помощью React.use()
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.courseId;

  // Получаем ID конкретной тренировки из query-параметров (?workoutId=...)
  const workoutId = searchParams.get('workoutId');

  // Состояния для данных
  const [course, setCourse] = useState<Course | null>(null);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [userProgress, setUserProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния для модальных окон
  const [modalType, setModalType] = useState<'input' | 'success' | 'select'>(
    'input'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInputs, setModalInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    // Проверка авторизации
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.replace('/');
      return;
    }

    async function loadWorkoutData() {
      try {
        setLoading(true);

        // Получаем общие детали курса
        const courseData = await apiFetch(`/courses/${courseId}`, {
          method: 'GET',
        });
        setCourse(courseData);

        // Определяем, какую тренировку открывать (первую из курса, если ID не передан)
        const targetWorkoutId = workoutId || courseData.workouts[0];

        if (targetWorkoutId) {
          // Получаем данные конкретной тренировки (видео, упражнения)
          const workoutData = await apiFetch(`/workouts/${targetWorkoutId}`, {
            method: 'GET',
          });
          setWorkout(workoutData);

          // Получаем текущий прогресс пользователя по этой тренировке
          try {
            const progressResponse = await apiFetch(
              `/users/me/progress?courseId=${courseId}&workoutId=${targetWorkoutId}`,
              { method: 'GET' }
            );
            setUserProgress(progressResponse.progressData || []);

            // Заполняем инпуты модалки текущими значениями с бэка
            const initialInputs: Record<string, string> = {};
            workoutData.exercises.forEach((ex: Exercise, index: number) => {
              initialInputs[ex._id] = String(
                progressResponse.progressData?.[index] || 0
              );
            });
            setModalInputs(initialInputs);
          } catch {
            // Если прогресса еще нет, инициализируем нулями
            setUserProgress(new Array(workoutData.exercises.length).fill(0));
          }
        }
      } catch (error) {
        console.error('Не удалось загрузить данные тренировки:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkoutData();
  }, [courseId, workoutId, router]);

  const handleInputChange = (id: string, value: string) => {
    setModalInputs((prev) => ({ ...prev, [id]: value }));
  };

  // Сохранение прогресса на бэкенд
  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workout || !course) return;

    try {
      // Собираем массив в соответствии с порядком упражнений на бэкенде
      const progressData = workout.exercises.map((ex) =>
        Number(modalInputs[ex._id] || 0)
      );

      // Отправляем PATCH запрос на сохранение прогресса
      await apiFetch(`/courses/${course._id}/workouts/${workout._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ progressData }),
      });

      // Обновляем локальный стейт прогресса на странице
      setUserProgress(progressData);

      // Показываем окно успеха
      setModalType('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setModalType('input');
      }, 2000);
    } catch (error) {
      console.error('Ошибка при сохранении прогресса:', error);
      alert('Не удалось сохранить прогресс. Попробуйте позже.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans">
        <p className="text-lg text-slate-500">Загрузка тренировки...</p>
      </div>
    );
  }

  const workoutNumber = course
    ? course.workouts.indexOf(workout?._id || '') + 1
    : 1;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-black pb-12 relative">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6">
        <Header showTagline={false} />

        <main className="mt-6">
          {/* Название курса */}
          <h1 className="text-[40px] md:text-[48px] font-bold leading-tight mb-2 m-0">
            {course?.nameRU || 'Просмотр тренировки'}
          </h1>

          {/* Видеоплеер */}
          <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black shadow-sm mb-10 group">
            {workout?.video ? (
              <iframe
                className="w-full h-full border-none"
                src={workout.video.replace('watch?v=', 'embed/')}
                title={workout.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-900">
                Видеозапись тренировки не найдена
              </div>
            )}
          </div>

          {/* Блок упражнений тренировки */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-[24px] md:text-[32px] font-bold mb-6 m-0">
              Упражнения тренировки {workoutNumber}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mb-8">
              {workout?.exercises.map((exercise, index) => {
                // Считаем прогресс по каждому упражнению на основе данных с бэка
                const currentCount = userProgress[index] || 0;
                const percent = Math.min(
                  Math.round((currentCount / exercise.quantity) * 100),
                  100
                );

                return (
                  <div
                    key={exercise._id || index}
                    className="flex flex-col gap-2"
                  >
                    {/* Название упражнения и количество из базы данных */}
                    <span className="text-[18px] font-normal leading-tight text-black font-sans">
                      {exercise.name} ({currentCount} из {exercise.quantity})
                    </span>

                    {/* Полоса прогресса упражнения */}
                    <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0071EE] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="h-[52px] bg-[#BCEC30] hover:bg-[#C2FF1A] text-black font-medium text-[18px] rounded-full px-8 transition-colors cursor-pointer border-none font-sans shrink-0"
            >
              Заполнить свой прогресс
            </button>
          </div>
        </main>
      </div>

      {/* Модалки прогресса */}
      {workout && (
        <WorkoutModals
          isOpen={isModalOpen}
          type={modalType}
          // Приводим интерфейс к ожидаемому компонентом WorkoutModals
          exercises={workout.exercises.map((ex) => ({
            id: ex._id,
            name: ex.name,
            progress: userProgress[workout.exercises.indexOf(ex)] || 0,
          }))}
          modalInputs={modalInputs}
          onInputChange={handleInputChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveProgress}
        />
      )}
    </div>
  );
}
