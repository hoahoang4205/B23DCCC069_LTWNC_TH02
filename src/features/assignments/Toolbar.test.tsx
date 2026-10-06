import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Provider } from 'react-redux';
import { Priority, SortBy } from '../../types';
import Toolbar from './Toolbar';
import assignmentsReducer from './assignmentsSlice';

describe('Toolbar', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounce search và áp dụng filter/sort', () => {
    jest.useFakeTimers();
    const store = configureStore({ reducer: { assignments: assignmentsReducer } });
    render(<Provider store={store}><Toolbar /></Provider>);

    fireEvent.change(screen.getByPlaceholderText('Tìm theo môn hoặc tên bài...'), { target: { value: 'react' } });
    expect(store.getState().assignments.filters.search).toBe('');
    act(() => jest.advanceTimersByTime(300));
    expect(store.getState().assignments.filters.search).toBe('react');

    fireEvent.change(screen.getByRole('combobox', { name: 'Lọc ưu tiên' }), { target: { value: Priority.High } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Sắp xếp' }), { target: { value: SortBy.CreatedAtAsc } });
    expect(store.getState().assignments.filters.priority).toBe(Priority.High);
    expect(store.getState().assignments.filters.sortBy).toBe(SortBy.CreatedAtAsc);
  });
});