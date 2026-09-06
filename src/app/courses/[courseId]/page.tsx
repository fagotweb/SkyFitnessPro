import Image from 'next/image';
import Header from '@/components/Header';
// 1. Импортируем функцию запроса одного курса вместо getCourses
import { getCourseById } from '@/services/api';
import { notFound } from 'next/navigation';
import { Course } from '@/sharedTypes/course';

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

// 2. Делаем компонент асинхронным для работы с API
export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { courseId } = await params;

  let course: Course;
  try {
    course = await getCourseById(courseId);
  } catch (error) {
    notFound();
  }

  // Типизируем аргументы функции: text — строка, index — число
  const fittingItems = course.fitting.map((text: string, index: number) => ({
    num: String(index + 1),
    text: text
  }));

  const directionItems: string[] = course.directions;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-black pb-16">
      {/* ВРЕМЕННО ДОБАВЛЯЕМ ЭТУ СТРОКУ, ЧТОБЫ УВИДЕТЬ ДАННЫЕ С БЭКЕНДА */}
    {/* <pre className="bg-black text-green-400 p-4 rounded text-xs overflow-auto max-w-full">
      {JSON.stringify(course, null, 2)}
    </pre> */}

      <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6">
        <Header />

        <main className="mt-6 flex flex-col gap-12">
          {/* Большой промо-баннер курса */}
          <div
            className={`${course.imageBg} w-full h-[250px] md:h-[310px] rounded-[30px] p-10 flex relative overflow-hidden items-center justify-between`}
          >
            <h1 className="text-white text-[40px] md:text-[64px] font-bold leading-none tracking-tight m-0">
              {course.nameRU}
            </h1>

            <div className="absolute right-0 bottom-0 top-0 w-[300px] md:w-[440px] h-full">
              <Image
                src={course.image} // Динамическая картинка курса вместо захардкоженной йоги
                alt={course.nameRU}
                fill
                priority // Промо-баннер — это LCP элемент, загружаем в приоритете
                className="object-contain object-right-bottom"
              />
            </div>
          </div>

          {/* 2. Блок "Подойдет для вас, если:" с точными параметрами из инспектора Figma */}
          <div>
            <h3 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-6">
              Подойдет для вас, если:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fittingItems.map((item: { num: string; text: string }) => (
                /* Карточка: padding p-5 (20px),items-center для выравнивания с гигантской цифрой */
                <div
                  key={item.num}
                  className="bg-[#202020] text-white p-5 rounded-[24px] min-h-[128px] flex items-center gap-6 box-border"
                >
                  {/* Зеленые цифры: строго Roboto, 75px, Medium (500) */}
                  <span className="font-['Roboto'] font-medium text-[75px] text-[#BCEC30] leading-none select-none shrink-0">
                    {item.num}
                  </span>

                  {/* 
                    Текстовый блок: 
                    - строго w-[268px] и h-[78px] по инспектору Figma!
                    - Шрифт text-[24px], leading-[110%], цвет белый.
                  */}
                  <p className="font-['Roboto'] font-normal text-[24px] leading-[110%] text-white w-[268px] h-[78px] flex items-center tracking-tight">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Блок "Направления" (исправленный чистый вывод) */}
          <div>
            <h3 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-6">
              Направления
            </h3>
            <div className="bg-[#E9F9C4] rounded-[32px] p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6">
              {directionItems.map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 text-[18px] md:text-[20px] font-medium text-black"
                >
                  {/* Красивый аккуратный салатовый или черный плюсик без мусорных символов */}
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

          {/* 4. Нижний промо-блок */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-10 flex flex-col lg:flex-row justify-between items-center relative overflow-hidden min-h-[340px] mt-4">
            {/* Левая текстовая часть */}
            <div className="flex flex-col gap-6 max-w-[550px] relative z-10 w-full shrink-0">
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
              <button className="bg-[#BCEC30] hover:bg-[#a6d423] text-black text-[16px] md:text-[18px] font-medium py-3.5 px-8 rounded-full transition-colors w-full md:w-max mt-2 cursor-pointer shadow-sm">
                Войдите, чтобы добавить курс
              </button>
            </div>

            {/* Графика справа */}
            <div className="w-full h-[340px] md:h-[400px] relative mt-8 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 lg:w-[520px] lg:h-[540px] pointer-events-none select-none overflow-visible z-0">
              {/* 1. Большой зеленый сплайн на заднем плане (наклон 12.38 deg) */}
              <div className="absolute bottom-[-30px] right-[-60px] w-[670px] h-[390px] rotate-[12.38deg] z-0 opacity-100 origin-center">
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

              {/* 2. Маленькая звездочка */}
              <div className="absolute top-[20px] left-[20px] md:top-[40px] md:left-[80px] w-[19.5px] h-[19.5px] z-10">
                <Image
                  src="/icons/star.svg"
                  alt=""
                  width={19.5}
                  height={19.5}
                  unoptimized
                />
              </div>

              {/* 3. Маленький черный сплайн */}
              <div className="absolute top-[160px] left-[120px] w-[50px] h-[42.5px] z-20">
                <Image
                  src="/icons/spline_black.svg"
                  alt=""
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>

              {/* 4. Сам crouching_man на переднем переднем плане */}
              <div className="absolute bottom-0 right-0 w-[519px] h-[539px] rotate-[-3deg] origin-bottom-right z-10">
                <Image
                  src="/images/сrouching_man.png"
                  alt="Crouching Man"
                  fill
                  priority
                  sizes="(max-w-768px) 280px, 519px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
