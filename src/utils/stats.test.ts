import { describe, expect, it } from '@jest/globals';
import { Priority, type Assignment } from '../types';
import { calcStats } from './stats';

const makeAssignment = (override: Partial<Assignment> = {}): Assignment => {
  const timestamp = new Date().toISOString();
  return {
    id: '1',
    subject: 'Lập trình Web',
    title: 'Bài tập',
    description: '',
    dueDate: new Date(Date.now() + 86_400_000).toISOString(),
    assignedDate: timestamp,
    priority: Priority.High,
    isSubmitted: false,
    submittedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...override,
  };
};

describe('calcStats', () => {
  it('đếm đúng trạng thái và số bài theo môn', () => {
    const past = new Date(Date.now() - 86_400_000).toISOString();
    const items = [
      makeAssignment({ id: '1', subject: 'Web', isSubmitted: true }),
      makeAssignment({ id: '2', subject: 'Web', dueDate: past }),
      makeAssignment({ id: '3', subject: 'CSDL' }),
    ];

    expect(calcStats(items)).toEqual({
      total: 3,
      done: 1,
      overdue: 1,
      notDone: 2,
      bySubject: {
        Web: { total: 2, done: 1 },
        CSDL: { total: 1, done: 0 },
      },
    });
  });
});