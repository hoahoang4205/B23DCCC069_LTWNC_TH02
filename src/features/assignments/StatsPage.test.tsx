import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Priority, type Assignment } from '../../types';
import StatsPage from './StatsPage';
import assignmentsReducer from './assignmentsSlice';

describe('StatsPage', () => {
  it('hiển thị tổng hợp trạng thái và môn học', () => {
    const timestamp = new Date().toISOString();
    const items: Assignment[] = [{ id: '1', subject: 'Web', title: 'Bài tập', description: '', dueDate: timestamp, assignedDate: timestamp, priority: Priority.High, isSubmitted: true, submittedAt: timestamp, createdAt: timestamp, updatedAt: timestamp }];
    const initial = assignmentsReducer(undefined, { type: 'init' });
    const store = configureStore({ reducer: { assignments: assignmentsReducer }, preloadedState: { assignments: { ...initial, items } } });
    render(<Provider store={store}><StatsPage /></Provider>);

    expect(screen.getByRole('heading', { name: /thống kê/i })).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('1/1')).toBeInTheDocument();
  });
});