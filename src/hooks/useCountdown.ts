import { useEffect, useState } from 'react';
import { CountdownState } from '../types';

function calculateCountdown(dueDate: string): Exclude<CountdownState, { kind: 'submitted' }> {
  const difference = new Date(dueDate).getTime() - Date.now();
  const absoluteSeconds = Math.floor(Math.abs(difference) / 1000);
  const days = Math.floor(absoluteSeconds / 86_400);
  const hours = Math.floor((absoluteSeconds % 86_400) / 3_600);
  const minutes = Math.floor((absoluteSeconds % 3_600) / 60);
  const seconds = absoluteSeconds % 60;
  if (difference < 0) return { kind: 'overdue', days, hours, minutes, seconds };
  if (difference < 5 * 3_600_000) return { kind: 'warning', days, hours, minutes, seconds };
  if (difference < 86_400_000) return { kind: 'urgent', days, hours, minutes, seconds };
  return { kind: 'normal', days, hours, minutes, seconds };
}

export function useCountdown(dueDate: string, isSubmitted: boolean): CountdownState {
  const [countdown, setCountdown] = useState<CountdownState>(() => isSubmitted ? { kind: 'submitted' } : calculateCountdown(dueDate));
  useEffect(() => {
    if (isSubmitted) { setCountdown({ kind: 'submitted' }); return undefined; }
    const update = (): void => setCountdown(calculateCountdown(dueDate));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [dueDate, isSubmitted]);
  return countdown;
}
