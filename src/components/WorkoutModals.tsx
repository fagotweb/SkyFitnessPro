'use client';

import { useState } from 'react';
import Image from 'next/image';
import { parseWorkoutName } from '@/utils/workouts';

export interface WorkoutProgressItem {
  _id: string; // Системный ID записи
  workoutId: string; // Короткий ID тренировки
  workoutCompleted: boolean;
  progressData: number[];
}

interface Exercise {
  id: string;
  name: string;
  progress: number;
}

// Добавляем в интерфейс пропсов модалки массив самих тренировок
interface ServerWorkoutData {
  _id: string;
  name: string;
  video: string;
}

interface WorkoutModalsProps {
  isOpen: boolean;
  type: 'input' | 'success' | 'select' | '';
  exercises: Exercise[];
  modalInputs: Record<string, string>;
  onInputChange: (id: string, value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSelectWorkout?: (workoutId: string) => void;
  workouts?: string[];
  workoutsData?: ServerWorkoutData[];
  workoutsProgress?: WorkoutProgressItem[];
}

export default function WorkoutModals({
  isOpen,
  type,
  exercises,
  modalInputs,
  onInputChange,
  onClose,
  onSubmit,
  onSelectWorkout,
  workoutsData = [],
  workoutsProgress = [],
}: WorkoutModalsProps) {
  // Храним только ID выбранного пользователем урока при клике.
  // По умолчанию пустая строка — если пустая, выберем первый элемент на лету в верстке.
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  if (!isOpen) return null;

  // Расчет прогресса
  const currentLessons = workoutsData.map((workout, index: number) => {
    const serverProgress = workoutsProgress.find(
      (p) => p.workoutId === workout._id
    );

    const { title, subtitle } = parseWorkoutName(workout.name, index);

    return {
      id: workout._id,
      title,
      description: subtitle,
      isCompleted: serverProgress?.workoutCompleted === true,
    };
  });

  // Определяем активный ID для подсветки (если стейт пустой, берем первую тренировку из прилетевших пропсов)
  const activeSelectedId = selectedLessonId || workoutsData[0]?._id || '';

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {type === 'input' && (
        <div className="bg-white rounded-[30px] p-10 shadow-2xl max-w-[426px] w-full max-h-[600px] box-border flex flex-col animate-in zoom-in-95 duration-200">
          <h3 className="text-[32px] font-medium leading-none mb-6 m-0 text-black font-sans shrink-0">
            Мой прогресс
          </h3>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-6 flex-1 overflow-hidden"
          >
            <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="flex flex-col gap-2">
                  <label className="text-[16px] font-normal leading-tight text-black font-sans">
                    Сколько раз вы сделали {exercise.name.toLowerCase()}?
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={modalInputs[exercise.id] || ''}
                    onChange={(e) => onInputChange(exercise.id, e.target.value)}
                    className="w-full h-10 border-0 border-b border-solid border-[#D9D9D9] focus:border-black text-[18px] transition-colors outline-none pb-1 box-border font-sans"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="h-[52px] bg-[#BCEC30] hover:bg-[#C2FF1A] text-black font-medium text-[18px] rounded-full w-full border-none font-sans mt-2 cursor-pointer transition-colors shrink-0"
            >
              Сохранить
            </button>
          </form>
        </div>
      )}

      {type === 'success' && (
        /* ОКНО 2: ВАШ ПРОГРЕСС ЗАСЧИТАН */
        <div className="bg-white rounded-[30px] p-10 shadow-2xl max-w-[426px] h-[270px] w-full box-border flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
          <h3 className="text-[32px] font-medium leading-tight mb-4 m-0 text-black font-sans w-[280px]">
            Ваш прогресс засчитан!
          </h3>
          <div className="w-12 h-12 relative mt-2">
            <Image
              src="/icons/workout-success.svg"
              alt="Успех"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}

      {type === 'select' && (
        /* ОКНО 3: ВЫБЕРИТЕ ТРЕНИРОВКУ */
        <div className="bg-white rounded-[30px] p-10 shadow-2xl w-[460px] max-h-[609px] box-border flex flex-col animate-in zoom-in-95 duration-200">
          <h3 className="text-[32px] font-medium leading-none mb-6 m-0 text-black font-sans shrink-0">
            Выберите тренировку
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 mb-6 custom-scrollbar min-h-0">
            {currentLessons.map((lesson) => {
              const isSelected = lesson.id === activeSelectedId;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-solid ${
                    isSelected
                      ? 'border-black bg-slate-50'
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="shrink-0">
                    {lesson.isCompleted ? (
                      <div className="w-5 h-5 relative">
                        <Image
                          src="/icons/workout-success.svg"
                          alt="Выполнено"
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-solid border-[#D9D9D9]" />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`text-[18px] font-normal leading-tight font-sans ${
                        isSelected ? 'font-medium' : 'text-black'
                      }`}
                    >
                      {lesson.title}
                    </span>
                    <span className="text-[14px] text-[#A1A1A1] font-normal font-sans">
                      {lesson.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onSelectWorkout?.(activeSelectedId)}
            className="h-[52px] bg-[#BCEC30] hover:bg-[#C2FF1A] text-black font-medium text-[18px] rounded-full w-full border-none font-sans shrink-0 cursor-pointer transition-colors"
          >
            Начать
          </button>
        </div>
      )}
    </div>
  );
}
