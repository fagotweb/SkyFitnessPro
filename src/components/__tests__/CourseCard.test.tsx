import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseCard from '../CourseCard';
import { Course } from '@/sharedTypes/course';

// Мокаем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Мокаем серверный экшн (он тянет next/cache)
jest.mock('@/app/actions', () => ({
  addCourseAction: jest.fn().mockResolvedValue({ message: 'ok' }),
  removeCourseAction: jest.fn(),
}));

const mockCourse: Course = {
  _id: 'yoga-1',
  nameRU: 'Йога',
  nameEN: 'Yoga',
  description: 'Описание',
  difficulty: 'начальный',
  durationInDays: 25,
  fitting: [],
  directions: [],
  order: 1,
  dailyDurationInMinutes: { from: 20, to: 50 },
  workouts: ['w1', 'w2'],
  imageBg: 'bg-[#FFC900]',
  image: '/images/yoga.png',
};

describe('CourseCard', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  it('рендерит название курса', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('Йога')).toBeInTheDocument();
  });

  it('показывает длительность и время', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('25 дней')).toBeInTheDocument();
    expect(screen.getByText('20-50 мин/день')).toBeInTheDocument();
  });

  it('ведёт на /courses/[id] при клике на карточку (обычный режим)', () => {
    render(<CourseCard course={mockCourse} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/courses/yoga-1');
  });

  it('в режиме профиля показывает прогресс и кнопку', () => {
    render(<CourseCard course={mockCourse} isProfileMode progress={40} />);
    expect(screen.getByText('Прогресс 40%')).toBeInTheDocument();
    expect(screen.getByText('Продолжить')).toBeInTheDocument();
  });

  it('кнопка «Начать тренировки» при progress=0', () => {
    render(<CourseCard course={mockCourse} isProfileMode progress={0} />);
    expect(screen.getByText('Начать тренировки')).toBeInTheDocument();
  });

  it('кнопка «Начать заново» при progress=100', () => {
    render(<CourseCard course={mockCourse} isProfileMode progress={100} />);
    expect(screen.getByText('Начать заново')).toBeInTheDocument();
  });

  it('вызывает onCardClick при клике на карточку в режиме профиля', async () => {
    const onCardClick = jest.fn();
    render(
      <CourseCard course={mockCourse} isProfileMode onCardClick={onCardClick} />
    );

    await userEvent.click(screen.getByText('Йога'));
    expect(onCardClick).toHaveBeenCalledWith(mockCourse);
  });
});
