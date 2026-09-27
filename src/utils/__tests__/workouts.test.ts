import { parseWorkoutName } from '../workouts';

describe('parseWorkoutName', () => {
  it('разбивает на title и subtitle', () => {
    const result = parseWorkoutName(
      'Утренняя практика / Йога на каждый день / 1 день',
      0
    );
    expect(result.title).toBe('Утренняя практика');
    expect(result.subtitle).toBe('Йога на каждый день / 1 день');
  });

  it('fallback если name пустой', () => {
    const result = parseWorkoutName('', 2);
    expect(result.title).toBe('Тренировка 3');
    expect(result.subtitle).toBe('Урок 3');
  });

  it('работает с одной частью', () => {
    const result = parseWorkoutName('Утренняя практика', 0);
    expect(result.title).toBe('Утренняя практика');
    expect(result.subtitle).toBe('Урок 1');
  });

  it('не падает на undefined', () => {
    const result = parseWorkoutName(undefined, 0);
    expect(result.title).toBe('Тренировка 1');
    expect(result.subtitle).toBe('Урок 1');
  });
});