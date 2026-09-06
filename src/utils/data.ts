import { Course } from '@/sharedTypes/course';

export const MOCK_COURSES: Course[] = [
  { 
    _id: 'yoga', 
    nameRU: 'Йога', 
    nameEN: 'Yoga',
    description: 'Комплекс асан для баланса тела и ума',
    durationInDays: 25, 
    dailyDurationInMinutes: { from: 20, to: 50 },
    workouts: ['w1', 'w2'],
    imageBg: 'bg-[#FFC900]', 
    image: '/images/yoga.png' 
  },
  { 
    _id: 'stretching', 
    nameRU: 'Стретчинг', 
    nameEN: 'Stretching',
    description: 'Растяжка и гибкость',
    durationInDays: 25, 
    dailyDurationInMinutes: { from: 20, to: 50 },
    workouts: ['w3'],
    imageBg: 'bg-[#1890FF]', 
    image: '/images/stretching.png' 
  },
  { 
    _id: 'fitness', 
    nameRU: 'Фитнес', 
    nameEN: 'Fitness',
    description: 'Силовые тренировки',
    durationInDays: 25, 
    dailyDurationInMinutes: { from: 20, to: 50 },
    workouts: ['w4'],
    imageBg: 'bg-[#FF9900]', 
    image: '/images/fitness.png' 
  }
];
