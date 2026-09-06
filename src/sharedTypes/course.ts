export interface Course {
  _id: string;              // Из доки (GET /api/fitness/courses)
  nameRU: string;           // Из доки
  nameEN: string;           // Из доки
  description: string;      // Из доки
  difficulty?: string;      // Из доки (GET /api/fitness/courses/[courseId])
  durationInDays: number;   // Из доки
  fitting: string[];
  directions: string[];
  order: number;
  dailyDurationInMinutes: { // Из доки
    from: number;
    to: number;
  };
  workouts: string[];       // Массив ID тренировок из доки
  
  // Оставляем наши визуальные свойства фронтенда, которых нет на бэке
  imageBg: string;
  image: string;
}

export interface UserProfile {
  email: string;
  selectedCourses: string[]; // Массив ID курсов, например ['yoga', 'fitness']
}

