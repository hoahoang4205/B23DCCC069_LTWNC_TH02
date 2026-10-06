import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import * as api from './assignmentsApi';
import AssignmentList from './AssignmentList';
import assignmentsReducer, { fetchAssignments } from './assignmentsSlice';
import type { Assignment } from '../../types';

jest.mock('./assignmentsApi');

const mockedFetchAssignments = jest.mocked(api.fetchMockAssignments);

function makeStore() {
  return configureStore({ reducer: { assignments: assignmentsReducer } });
}

describe('AssignmentList async', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedFetchAssignments.mockReset();
  });

  it('hiển thị trạng thái đang tải khi fetch đang chạy', () => {
    mockedFetchAssignments.mockImplementation(() => new Promise(() => {}));
    const store = makeStore();
    void store.dispatch(fetchAssignments());

    render(<Provider store={store}><AssignmentList /></Provider>);

    expect(screen.getByText(/đang tải/i)).toBeInTheDocument();
  });

  it('hiển thị lỗi khi API thất bại', async () => {
    mockedFetchAssignments.mockRejectedValue(new Error('500'));
    const store = makeStore();
    await store.dispatch(fetchAssignments());

    render(<Provider store={store}><AssignmentList /></Provider>);

    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('hiển thị bài tải thành công và xác nhận xóa', async () => {
    const timestamp = new Date(Date.now() + 86_400_000).toISOString();
    const assignment: Assignment = { id: 'loaded-1', subject: 'Web', title: 'Bài được tải', description: '', dueDate: timestamp, assignedDate: timestamp, priority: 'high' as Assignment['priority'], isSubmitted: false, submittedAt: null, createdAt: timestamp, updatedAt: timestamp };
    mockedFetchAssignments.mockResolvedValue({ statusCode: 200, message: 'ok', data: [assignment] });
    const store = makeStore();
    await store.dispatch(fetchAssignments());
    const onDeleted = jest.fn();
    render(<Provider store={store}><AssignmentList onDeleted={onDeleted} /></Provider>);

    expect(screen.getByText('Bài được tải')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Xóa Bài được tải' }));
    expect(screen.getByRole('dialog', { name: 'Xóa bài tập' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Xóa vĩnh viễn' }));

    expect(store.getState().assignments.items).toHaveLength(0);
    expect(onDeleted).toHaveBeenCalledTimes(1);
  });

  it('render danh sách dài qua virtualized List', async () => {
    const timestamp = new Date(Date.now() + 86_400_000).toISOString();
    const data: Assignment[] = Array.from({ length: 35 }, (_, index) => ({ id: `row-${index}`, subject: 'Web', title: `Bài ${index}`, description: '', dueDate: timestamp, assignedDate: timestamp, priority: 'high' as Assignment['priority'], isSubmitted: false, submittedAt: null, createdAt: timestamp, updatedAt: timestamp }));
    mockedFetchAssignments.mockResolvedValue({ statusCode: 200, message: 'ok', data });
    const store = makeStore();
    await store.dispatch(fetchAssignments());
    store.dispatch({ type: 'assignments/setFilters', payload: { itemsPerPage: 35 } });

    render(<Provider store={store}><AssignmentList /></Provider>);

    expect(await screen.findByText('Bài 0')).toBeInTheDocument();
  });
});