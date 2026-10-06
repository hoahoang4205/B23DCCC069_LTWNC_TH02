import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { FilterStatus, Priority, type Assignment } from '../../types';
import FilterStats from './FilterStats';
import assignmentsReducer from './assignmentsSlice';

const makeAssignment = (id: string, override: Partial<Assignment> = {}): Assignment => {
  const timestamp = new Date().toISOString();
  return { id, subject: 'Web', title: `Bài ${id}`, description: '', dueDate: timestamp, assignedDate: timestamp, priority: Priority.High, isSubmitted: false, submittedAt: null, createdAt: timestamp, updatedAt: timestamp, ...override };
};

describe('FilterStats', () => {
  it('hiển thị số lượng theo trạng thái và cập nhật bộ lọc khi chọn', () => {
    const initial = assignmentsReducer(undefined, { type: 'init' });
    const items = [
      makeAssignment('done', { isSubmitted: true }),
      makeAssignment('overdue', { dueDate: new Date(Date.now() - 86_400_000).toISOString() }),
    ];
    const store = configureStore({ reducer: { assignments: assignmentsReducer }, preloadedState: { assignments: { ...initial, items } } });
    render(<Provider store={store}><FilterStats /></Provider>);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: /quá hạn/i }));

    expect(store.getState().assignments.filters.status).toBe(FilterStatus.Overdue);
    expect(store.getState().assignments.filters.page).toBe(1);
  });
});