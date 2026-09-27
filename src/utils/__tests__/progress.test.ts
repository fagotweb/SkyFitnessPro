import { calculateCourseProgress, countCompletedWorkouts } from '../progress';

describe('calculateCourseProgress', () => {
  it('0 при отсутствии тренировок', () => {
    expect(calculateCourseProgress(0, 0)).toBe(0);
  });
  it('50% при 2 из 4', () => {
    expect(calculateCourseProgress(2, 4)).toBe(50);
  });
  it('100% при полном выполнении', () => {
    expect(calculateCourseProgress(5, 5)).toBe(100);
  });
  it('округляет до целого', () => {
    expect(calculateCourseProgress(1, 3)).toBe(33);
  });
});

describe('countCompletedWorkouts', () => {
  it('0 для undefined', () => {
    expect(countCompletedWorkouts(undefined)).toBe(0);
  });
  it('считает только completed', () => {
    const data = [
      { workoutCompleted: true },
      { workoutCompleted: false },
      { workoutCompleted: true },
    ];
    expect(countCompletedWorkouts(data)).toBe(2);
  });
  it('0 если ничего не выполнено', () => {
    expect(countCompletedWorkouts([{ workoutCompleted: false }])).toBe(0);
  });
});