import { Course, UserProfile } from '@/sharedTypes/course';

const BASE_URL = 'https://wedev-api.sky.pro/api/fitness';

// Вспомогательная функция для запросов с автоматическим Bearer-токеном
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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

// Получить все курсы
export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${BASE_URL}/courses`, {
    next: { revalidate: 3600 }, // кэш на час
  });
  if (!res.ok) throw new Error('Не удалось загрузить курсы');
  const serverCourses: Course[] = await res.json();

  const visualMap: Record<string, { imageBg: string; image: string }> = {
    йога: { imageBg: 'bg-[#FFC900]', image: '/images/yoga.png' },
    стретчинг: { imageBg: 'bg-[#1890FF]', image: '/images/stretching.png' },
    фитнес: { imageBg: 'bg-[#FF9900]', image: '/images/fitness.png' },
    'степ-аэробика': { imageBg: 'bg-[#F5222D]', image: '/images/step.png' },
    бодифлекс: { imageBg: 'bg-[#722ED1]', image: '/images/bodyflex.png' },
  };

  return [...serverCourses]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((course) => {
      const key = (course.nameRU || '').toLowerCase().trim();
      const visual = visualMap[key] || visualMap['йога'];
      return { ...course, imageBg: visual.imageBg, image: visual.image };
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
export async function addCourseToUser(
  courseId: string
): Promise<{ message: string }> {
  return apiFetch('/users/me/courses', {
    method: 'POST',
    body: JSON.stringify({ courseId }), // передаем ID курса в теле запроса
  });
}

export async function removeCourseFromUser(
  courseId: string
): Promise<{ message: string }> {
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
    йога: { imageBg: 'bg-[#FFC700]', image: '/images/yoga.png' },
    стретчинг: { imageBg: 'bg-[#2491D2]', image: '/images/stretching.png' },
    фитнес: { imageBg: 'bg-[#F7A012]', image: '/images/fitness.png' },
    'степ-аэробика': { imageBg: 'bg-[#FF7E65]', image: '/images/step.png' },
    бодифлекс: { imageBg: 'bg-[#7D458C]', image: '/images/bodyflex.png' },
  };

  const key = (course.nameRU || '').toLowerCase().trim();
  const visual = visualMap[key] || visualMap['йога'];

  return {
    ...course,
    imageBg: visual.imageBg,
    image: visual.image,
  };
}

// Получить детальные данные курса по его ID для видеоплеера
export async function getCourseDetails(courseId: string): Promise<Course> {
  return apiFetch(`/courses/${courseId}`, {
    method: 'GET',
  });
}

export async function getWorkoutById(workoutId: string) {
  return apiFetch(`/workouts/${workoutId}`, { method: 'GET' });
}
