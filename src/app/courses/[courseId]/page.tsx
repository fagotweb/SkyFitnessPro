import Image from 'next/image';
import Header from '@/components/Header';
import { getCourseById } from '@/services/api';
import { notFound } from 'next/navigation';
import { Course } from '@/sharedTypes/course';
import { Metadata } from 'next';
import AddCourseButton from '@/components/AddCourseButton';

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  try {
    const { courseId } = await params;
    const course = await getCourseById(courseId);
    return { title: course.nameRU };
  } catch {
    return { title: 'Курс' };
  }
}

// Делаем компонент асинхронным для работы с API
export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { courseId } = await params;

  let course: Course;
  try {
    course = await getCourseById(courseId);
  } catch {
    notFound();
  }

  // Типизируем аргументы функции
  const fittingItems = course.fitting.map((text: string, index: number) => ({
    num: String(index + 1),
    text: text,
  }));

  const directionItems: string[] = course.directions;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-black pb-16">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6">
        <Header />

        <main className="mt-6 flex flex-col gap-12">
          {/* Большой промо-баннер курса */}
          <div
            className={`${course.imageBg} w-full h-[250px] md:h-[310px] rounded-[30px] p-10 flex relative overflow-hidden items-center justify-between`}
          >
            <h1 className="hidden md:block text-white text-[40px] md:text-[64px] font-bold leading-none tracking-tight m-0">
              {course.nameRU}
            </h1>

            <div className="absolute inset-0 w-full h-full">
              <Image
                src={course.image}
                alt={course.nameRU}
                fill
                priority
                className="object-contain object-center md:object-right-bottom"
              />
            </div>
          </div>

          {/* Блок "Подойдет для вас, если:" */}
          <div>
            <h3 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-6">
              Подойдет для вас, если:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fittingItems.map((item: { num: string; text: string }) => (
                <div
                  key={item.num}
                  className="bg-[#202020] text-white p-5 rounded-[24px] min-h-[128px] flex items-center gap-6 box-border"
                >
                  <span className="font-['Roboto'] font-medium text-[75px] text-[#BCEC30] leading-none select-none shrink-0">
                    {item.num}
                  </span>
                  <p className="font-['Roboto'] font-normal text-[24px] leading-[110%] text-white tracking-tight">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Блок "Направления" */}
          <div>
            <h3 className="text-[32px] md:text-[40px] font-bold tracking-tight">
              Направления
            </h3>
            <div className="bg-[#E9F9C4] rounded-[32px] p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6">
              {directionItems.map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 text-[18px] md:text-[20px] font-medium text-black"
                >
                  <div className="w-[19.5px] h-[19.5px] relative shrink-0">
                    <Image
                      src="/icons/star.svg"
                      alt=""
                      width={19.5}
                      height={19.5}
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Нижний промо-блок */}
          <div className="relative mt-[156px] lg:mt-[102px]">
            {/* Бегун + сплайны — absolute, поверх фона на desktop, под фоном на mobile */}
            <div
              className="absolute inset-0 pointer-events-none select-none z-10 lg:z-30"
              style={{ clipPath: 'inset(-2000px -2000px 0 -2000px)' }}
            >
              <div
                className="absolute right-[-130px] lg:right-[-30px] z-10 lg:z-30 pointer-events-none select-none top-[-297px] lg:top-auto lg:bottom-0
               origin-top-right lg:origin-bottom-right
               scale-[0.75] lg:scale-100"
              >
                <div className="relative w-[520px] h-[540px]">
                  {/* Зелёный сплайн */}
                  <div className="absolute bottom-[-30px] right-[20px] w-[670px] h-[390px] z-0">
                    <Image
                      src="/icons/spline_green.svg"
                      alt=""
                      fill
                      unoptimized
                      priority
                      sizes="670px"
                      className="object-contain"
                    />
                  </div>

                  {/* Чёрный сплайн */}
                  <div className="absolute top-[90px] left-[60px] w-[50px] h-[42.5px] z-20">
                    <Image
                      src="/icons/spline_black.svg"
                      alt=""
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>

                  {/* Бегун */}
                  <div className="absolute bottom-0 right-0 w-[604px] h-[604px] rotate-[-3deg] origin-bottom-right z-10">
                    <Image
                      src="/images/crouching_man.png"
                      alt="Crouching Man"
                      fill
                      priority
                      sizes="(max-width: 768px) 333px, 604px"
                      className="object-contain object-bottom"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Белый блок с текстом */}
            <div className="relative z-20 bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-10 lg:min-h-[438px]">
              <div className="flex flex-col gap-6 max-w-[550px] relative z-30">
                <h4 className="text-[36px] md:text-[48px] font-bold leading-[110%] tracking-tight">
                  Начните путь
                  <br />к новому телу
                </h4>
                <ul className="flex flex-col gap-2 text-[#666666] text-[16px] md:text-[18px] font-light list-disc pl-5">
                  <li>проработка всех групп мышц</li>
                  <li>тренировка суставов</li>
                  <li>улучшение циркуляции крови</li>
                  <li>упражнения заряжают бодростью</li>
                  <li>помогают противостоять стрессам</li>
                </ul>
                <AddCourseButton courseId={course._id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
