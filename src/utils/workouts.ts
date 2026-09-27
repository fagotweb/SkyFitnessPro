export interface ParsedWorkoutName {
  title: string;
  subtitle: string;
}

export function parseWorkoutName(
  rawName: string | undefined,
  fallbackIndex: number
): ParsedWorkoutName {
  const safe = rawName || '';
  const parts = safe.split(' / ');
  return {
    title: parts[0] || `Тренировка ${fallbackIndex + 1}`,
    subtitle: parts.slice(1, 3).join(' / ') || `Урок ${fallbackIndex + 1}`,
  };
}