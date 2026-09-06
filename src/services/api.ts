import { Course, UserProfile } from '@/sharedTypes/course';
import { MOCK_COURSES } from '@/utils/data';

const BASE_URL = 'https://wedev-api.sky.pro/api/fitness';

// Вспомогательная функция для запросов с автоматическим Bearer-токеном
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Произошла ошибка');
  }

  return data;
}

// === НОВЫЕ ФУНКЦИИ АВТОРИЗАЦИИ ===

// Регистрация
export async function registerUser(body: Record<string, string>) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// Авторизация (Логин)
export async function loginUser(body: Record<string, string>) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  
  if (data.token && typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
  }
  
  return data;
}

// === ТВОЙ СУЩЕСТВУЮЩИЙ КОД (ВРЕМЕННЫЙ МОК) ===

// Получить все курсы (картинки жестко привязываем на фронтенде)
// Получить все курсы (картинки жестко привязываем на фронтенде)
export async function getCourses(): Promise<Course[]> {
  const serverCourses: Course[] = await apiFetch('/courses', {
    method: 'GET',
  });

  const visualMap: Record<string, { imageBg: string; image: string }> = {
    'йога': { imageBg: 'bg-[#FFC900]', image: '/images/yoga.png' },
    'стретчинг': { imageBg: 'bg-[#1890FF]', image: '/images/stretching.png' },
    'фитнес': { imageBg: 'bg-[#FF9900]', image: '/images/fitness.png' },
    'степ-аэробика': { imageBg: 'bg-[#F5222D]', image: '/images/step.png' },
    'бодифлекс': { imageBg: 'bg-[#722ED1]', image: '/images/bodyflex.png' },
  };

  // Сначала сортируем по order, а потом маппим картинки
  return [...serverCourses]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((course) => {
      const key = (course.nameRU || '').toLowerCase().trim();
      const visual = visualMap[key] || visualMap['йога'];
      return {
        ...course,
        imageBg: visual.imageBg,
        image: visual.image,
      };
    });
}


// Получение реальных данных профиля с бэкенда
export async function getUserProfile(): Promise<UserProfile> {
  const data = await apiFetch('/users/me', {
    method: 'GET',
  });
  
  // Возвращаем именно вложенный объект user, как пришло в ответе бэка
  return data.user; 
}

// Добавить курс в профиль пользователя
export async function addCourseToUser(courseId: string): Promise<{ message: string }> {
  return apiFetch('/users/me/courses', {
    method: 'POST',
    body: JSON.stringify({ courseId }), // передаем ID курса в теле запроса
  });
}

export async function removeCourseFromUser(courseId: string): Promise<{ message: string }> {
  return apiFetch(`/users/me/courses/${courseId}`, {
    method: 'DELETE',
  });
}

// Получить один курс по ID
export async function getCourseById(courseId: string): Promise<Course> {
  const course: Course = await apiFetch(`/courses/${courseId}`, {
    method: 'GET',
  });

  const visualMap: Record<string, { imageBg: string; image: string }> = {
  'йога': { imageBg: 'bg-[#FFC900]', image: '/images/yoga.png' },
  'стретчинг': { imageBg: 'bg-[#1890FF]', image: '/images/stretching.png' },
  'фитнес': { imageBg: 'bg-[#FF9900]', image: '/images/fitness.png' },
  'степ-аэробика': { imageBg: 'bg-[#F5222D]', image: '/images/step.png' }, // Исправили на step.png
  'бодифлекс': { imageBg: 'bg-[#722ED1]', image: '/images/bodyflex.png' }, // Исправили на bodyflex.png
};


  const key = (course.nameRU || '').toLowerCase().trim();
  const visual = visualMap[key] || visualMap['йога'];

  return {
    ...course,
    imageBg: visual.imageBg,
    image: visual.image,
  };
}

// // Вспомогательная функция для исправления косяков в путях картинок бэкенда
// function patchCourseFields(course: Course): Course {
//   let correctedImage = course.image || '/images/yoga.png';

//   // Если для Бодифлекса бэк прислал йогу, заменяем на правильный файл bodyflex.png
//   if (course.nameRU?.includes('Бодифлекс') && correctedImage.includes('yoga.png')) {
//     correctedImage = '/images/bodyflex.png';
//   }
//   // Если для Степ-аэробики бэк прислал стретчинг, заменяем на step.png
//   if (course.nameRU?.includes('Степ') && correctedImage.includes('stretching.png')) {
//     correctedImage = '/images/step.png';
//   }

//   return {
//     ...course,
//     imageBg: course.imageBg || 'bg-slate-200',
//     image: correctedImage,
//   };
// }

// // Получить все курсы
// export async function getCourses(): Promise<Course[]> {
//   const serverCourses: Course[] = await apiFetch('/courses', {
//     method: 'GET',
//   });
//   // Сортируем по order и прогоняем через исправление картинок
//   return serverCourses
//     .sort((a, b) => (a.order || 0) - (b.order || 0))
//     .map(patchCourseFields);
// }

// // Получить один курс по ID
// export async function getCourseById(courseId: string): Promise<Course> {
//   const course: Course = await apiFetch(`/courses/${courseId}`, {
//     method: 'GET',
//   });
//   return patchCourseFields(course);
// }