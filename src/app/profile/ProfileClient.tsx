'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import WorkoutModals from '@/components/WorkoutModals';
import { useAuth } from '@/context/AuthContext';
import { removeCourseAction } from '@/app/actions';
import { Course, CourseProgressItem, UserProfile } from '@/sharedTypes/course';
import { getUserProfile, getWorkoutById } from '@/services/api';
import {
  calculateCourseProgress,
  countCompletedWorkouts,
} from '@/utils/progress';

interface Props {
  allCourses: Course[];
}

interface WorkoutResponse {
  _id: string;
  name: string;
  video: string;
  exercises: { _id: string; name: string; quantity: number }[];
}

async function getWorkoutWithRetry(
  id: string,
  retries = 2
): Promise<WorkoutResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      return await getWorkoutById(id);
    } catch (e: unknown) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  // Недостижимо, но TS требует
  throw new Error('Retry failed');
}

const CACHE_KEY = 'profile_cache';

export default function ProfileClient({ allCourses }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!profile);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [workoutsMap, setWorkoutsMap] = useState<
    Record<string, { _id: string; name: string; video: string }>
  >(() => {
    if (typeof window === 'undefined') return {};
    try {
      const cached = sessionStorage.getItem('workoutsCache');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const { logout, userEmail } = useAuth();
  const router = useRouter();

  // Загружаем профиль (нужен токен из localStorage)
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/');
      return;
    }

    getUserProfile()
      .then((fresh) => {
        setProfile(fresh);
        localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
      })
      .catch(() => {
        localStorage.removeItem(CACHE_KEY);
        router.replace('/');
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Фильтруем курсы пользователя
  const userCourses = useMemo(
    () => allCourses.filter((c) => profile?.selectedCourses?.includes(c._id)),
    [allCourses, profile?.selectedCourses]
  );

  const fetchedIdsRef = useRef<Set<string>>(new Set());

  const handleSelectWorkout = (workoutId: string) => {
    if (!selectedCourse) return;
    setIsSelectModalOpen(false);
    router.push(
      `/courses/${selectedCourse._id}/workout?workoutId=${workoutId}`
    );
  };

  const handleRemoveCourse = async (courseId: string) => {
    if (!profile) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await removeCourseAction(courseId, token);
      setProfile({
        ...profile,
        selectedCourses: profile.selectedCourses.filter(
          (id) => id !== courseId
        ),
      });
    } catch (e) {
      if (e instanceof Error && e.message === 'UNAUTHORIZED') {
        localStorage.removeItem('token');
        router.push('/auth/signin');
        return;
      }
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-black pb-12">
        <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6">
          <Header showTagline={false} />
          <main className="mt-4">
            <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm mb-12 animate-pulse">
              <div className="h-10 w-32 bg-slate-200 rounded mb-6" />
              <div className="flex items-start gap-6">
                <div className="w-[120px] h-[120px] rounded-full bg-slate-200" />
                <div className="flex flex-col gap-2 pt-4">
                  <div className="h-8 w-40 bg-slate-200 rounded" />
                  <div className="h-4 w-56 bg-slate-200 rounded" />
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  const selectedCourseFull = allCourses.find(
    (c) => c._id === selectedCourse?._id
  );
  const modalWorkoutsData = (selectedCourseFull?.workouts || []).map(
    (id, i) =>
      workoutsMap[id] || { _id: id, name: `Тренировка ${i + 1}`, video: '' }
  );

  const modalWorkoutsProgress =
    profile?.courseProgress?.find(
      (cp) => cp.courseId === selectedCourseFull?._id
    )?.workoutsProgress || [];

  const displayEmail = profile?.email || userEmail || 'alex123@mail.ru';
  const formattedName =
    (displayEmail.split('@')[0] || 'Пользователь').charAt(0).toUpperCase() +
    (displayEmail.split('@')[0] || 'Пользователь').slice(1);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-black pb-12">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6">
        <Header showTagline={false} />
        <main className="mt-4">
          <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm mb-12">
            <h1 className="text-[40px] font-bold tracking-tight mb-6">
              Профиль
            </h1>
            <div className="flex items-start gap-6">
              <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center shrink-0 relative overflow-hidden">
                <Image
                  src="/icons/prof.svg"
                  alt="Аватар"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
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
                    router.push('/');
                  }}
                  className="w-max mt-4 border border-black rounded-full px-6 py-2.5 text-base hover:bg-slate-50 transition-colors cursor-pointer font-sans"
                >
                  Выйти
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[40px] font-bold tracking-tight mb-6">
              Мои курсы
            </h2>
            {userCourses.length === 0 ? (
              <p className="text-lg text-slate-400">
                У вас пока нет выбранных курсов.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center md:justify-items-start">
                {userCourses.map((course) => {
                  const scp = profile?.courseProgress?.find(
                    (cp: CourseProgressItem) => cp.courseId === course._id
                  );
                  const completed = countCompletedWorkouts(
                    scp?.workoutsProgress
                  );
                  const total = course.workouts?.length || 0;
                  const progress = calculateCourseProgress(completed, total);

                  return (
                    <CourseCard
                      key={course._id}
                      course={course}
                      isProfileMode
                      progress={progress}
                      onRemove={handleRemoveCourse}
                      onCardClick={async (c) => {
                        setSelectedCourse(c);
                        setIsSelectModalOpen(true);

                        const missing = c.workouts.filter(
                          (id) => !fetchedIdsRef.current.has(id)
                        );
                        if (!missing.length) return;
                        missing.forEach((id) => fetchedIdsRef.current.add(id));

                        // Загружаем по 2
                        const CONCURRENCY = 2;
                        for (let i = 0; i < missing.length; i += CONCURRENCY) {
                          const chunk = missing.slice(i, i + CONCURRENCY);
                          const results = await Promise.all(
                            chunk.map((id) =>
                              getWorkoutWithRetry(id)
                                .then((w) => ({
                                  id,
                                  data: {
                                    _id: w._id,
                                    name: w.name,
                                    video: w.video,
                                  },
                                }))
                                .catch(() => ({ id, data: null }))
                            )
                          );
                          setWorkoutsMap((prev) => {
                            const next = { ...prev };
                            results.forEach((r) => {
                              if (r.data) next[r.id] = r.data;
                            });
                            try {
                              sessionStorage.setItem(
                                'workoutsCache',
                                JSON.stringify(next)
                              );
                            } catch {}
                            return next;
                          });
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      <WorkoutModals
        isOpen={isSelectModalOpen}
        type="select"
        exercises={[]}
        modalInputs={{}}
        onInputChange={() => {}}
        onClose={() => setIsSelectModalOpen(false)}
        onSubmit={(e) => e.preventDefault()}
        onSelectWorkout={handleSelectWorkout}
        workoutsData={modalWorkoutsData}
        workoutsProgress={modalWorkoutsProgress}
      />
    </div>
  );
}
