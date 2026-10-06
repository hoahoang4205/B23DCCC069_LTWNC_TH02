import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import AddForm from './AddForm';
import assignmentsReducer from './assignmentsSlice';

describe('AddForm', () => {
  it('không thêm bài khi submit form trống', async () => {
    const store = configureStore({ reducer: { assignments: assignmentsReducer } });
    render(<Provider store={store}><AddForm /></Provider>);

    await userEvent.click(screen.getByRole('button', { name: /thêm bài tập/i }));

    expect(screen.getByLabelText('Tên bài tập *')).toBeInvalid();
    expect(store.getState().assignments.items).toHaveLength(0);
  });

  it('dispatch bài tập hợp lệ và gọi onAdded', () => {
    const store = configureStore({ reducer: { assignments: assignmentsReducer } });
    const onAdded = jest.fn();
    const { container } = render(<Provider store={store}><AddForm onAdded={onAdded} /></Provider>);
    const dueDate = new Date(Date.now() + 3_600_000);
    const localDueDate = new Date(dueDate.getTime() - dueDate.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

    fireEvent.change(screen.getByLabelText('Tên bài tập *'), { target: { value: 'Bài hợp lệ' } });
    fireEvent.change(screen.getByLabelText('Hạn nộp *'), { target: { value: localDueDate } });
    fireEvent.submit(container.querySelector('form')!);

    expect(store.getState().assignments.items).toHaveLength(1);
    expect(store.getState().assignments.items[0].title).toBe('Bài hợp lệ');
    expect(onAdded).toHaveBeenCalledTimes(1);
  });
});