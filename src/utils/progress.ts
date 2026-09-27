export function calculateCourseProgress(
  completedWorkouts: number,
  totalWorkouts: number
): number {
  if (totalWorkouts <= 0) return 0;
  return Math.round((completedWorkouts / totalWorkouts) * 100);
}

export function countCompletedWorkouts(
  workoutsProgress: { workoutCompleted: boolean }[] | undefined
): number {
  if (!workoutsProgress) return 0;
  return workoutsProgress.filter((wp) => wp.workoutCompleted).length;
}