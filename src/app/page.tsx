import Header from '@/components/Header';
import MainTopBlock from '@/components/MainTopBlock';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { getCourses } from '@/services/api';
import type { Metadata } from 'next';
import CoursesList from '@/components/CoursesList';

export const metadata: Metadata = {
  title: 'Главная',
};

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-black pb-12">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6">
        {/* 1. Хедер */}
        <Header />

        <main>
          {/* 2. Блок промо-баннера */}
          <MainTopBlock />

          {/* 3. Сетка карточек */}
          <CoursesList courses={courses} />

          {/* 4. Кнопка возврата наверх */}
          <ScrollToTopButton />
        </main>
      </div>
    </div>
  );
}
