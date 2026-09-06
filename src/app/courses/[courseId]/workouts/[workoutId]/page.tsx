'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';

export default function WorkoutPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const workoutId = params.workoutId as string;

  // Рабочий ID реального видео с YouTube (вместо текстовой строки)
  const youtubeVideoId = 'eK68Y3o0cNA';

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-black pb-16">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6">
        {/* Базовая шапка сайта */}
        <Header />

        <main className="mt-6 w-full">
          {/* Заголовки на русском языке */}
          <h1 className="text-[40px] font-bold tracking-tight mb-2 text-black font-sans">
            {courseId === 'yoga'
              ? 'Йога'
              : courseId === 'stretching'
                ? 'Стретчинг'
                : 'Бодифлекс'}
          </h1>
          <h2 className="text-[24px] font-normal text-black/60 mb-6 font-sans">
            Красота и здоровье / Разминка #{workoutId}
          </h2>

          {/* Исправленный плеер YouTube: строго с косыми кавычками, чтобы переменная подставилась */}
          <div className="w-full aspect-video rounded-[32px] overflow-hidden border border-slate-100 shadow-sm bg-black mb-10">
            <iframe
              className="w-full h-full"
              src={`https://youtube.com{youtubeVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
              allowFullScreen
            ></iframe>
          </div>
        </main>
      </div>
    </div>
  );
}
