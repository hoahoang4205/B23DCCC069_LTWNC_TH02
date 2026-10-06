import type { Assignment } from '../types';
import { isOverdue } from '../types';

export interface Stats {
  total: number;
  done: number;
  overdue: number;
  notDone: number;
  bySubject: Record<string, { total: number; done: number }>;
}

export function calcStats(items: Assignment[]): Stats {
  const stats: Stats = { total: items.length, done: 0, overdue: 0, notDone: 0, bySubject: {} };

  for (const assignment of items) {
    if (assignment.isSubmitted) stats.done += 1;
    else {
      stats.notDone += 1;
      if (isOverdue(assignment)) stats.overdue += 1;
    }

    stats.bySubject[assignment.subject] ??= { total: 0, done: 0 };
    stats.bySubject[assignment.subject].total += 1;
    if (assignment.isSubmitted) stats.bySubject[assignment.subject].done += 1;
  }

  return stats;
}