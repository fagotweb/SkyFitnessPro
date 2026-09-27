export interface Course {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  difficulty?: string;
  durationInDays: number;
  fitting: string[];
  directions: string[];
  order: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workouts: string[]; // Массив ID тренировок

  // Визуальные свойства фронтенда
  imageBg: string;
  image: string;
}

export interface WorkoutProgressItem {
  _id: string; // ID тренировки
  workoutId: string;
  workoutCompleted: boolean; // Статус выполнения с бэка
  progressData: number[]; // Массив повторений
}

export interface CourseProgressItem {
  courseId: string;
  _id: string; // ID курса
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgressItem[];
}

export interface UserProfile {
  _id: string;
  email: string;
  selectedCourses: string[]; // Массив ID курсов, например
  courseProgress?: CourseProgressItem[];
}
