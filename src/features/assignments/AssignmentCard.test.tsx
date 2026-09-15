import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './assignmentsSlice';
import AssignmentCard from './AssignmentCard';
import { Assignment, Priority } from '../../types';

const makeAssignment = (isSubmitted: boolean): Assignment => ({ id: '1', subject: 'Lập trình Web', title: 'Báo cáo giữa kỳ', description: '', dueDate: '2099-09-20T10:00:00.000Z', assignedDate: '2026-09-10T10:00:00.000Z', priority: Priority.High, isSubmitted, submittedAt: isSubmitted ? '2026-09-12T10:00:00.000Z' : null, createdAt: '2026-09-10T10:00:00.000Z', updatedAt: '2026-09-10T10:00:00.000Z' });
const renderCard = (assignment: Assignment) => { const store = configureStore({ reducer: { assignments: reducer }, preloadedState: { assignments: { items: [assignment], status: 'idle' as const, error: null, filters: reducer(undefined, { type: 'init' }).filters } } }); return { store, ...render(<Provider store={store}><AssignmentCard assignment={assignment} onDelete={vi.fn()} onDetails={vi.fn()} /></Provider>) }; };

describe('AssignmentCard', () => {
  it('hiển thị subject và title', () => { renderCard(makeAssignment(false)); expect(screen.getByText('Lập trình Web')).toBeInTheDocument(); expect(screen.getByText('Báo cáo giữa kỳ')).toBeInTheDocument(); });
  it('card chưa nộp hiện nút đánh dấu hoàn thành', () => { renderCard(makeAssignment(false)); expect(screen.getByText('✓ Đánh dấu đã hoàn thành')).toBeInTheDocument(); });
  it('card đã hoàn thành hiện nút bỏ đánh dấu và text gạch ngang', () => { renderCard(makeAssignment(true)); expect(screen.getByText('↩ Bỏ đánh dấu hoàn thành')).toBeInTheDocument(); expect(screen.getByText('Báo cáo giữa kỳ')).toHaveStyle({ textDecoration: 'line-through' }); });
  it('click nút hoàn thành dispatch action', async () => { const user = userEvent.setup(); const { store } = renderCard(makeAssignment(false)); await user.click(screen.getByText('✓ Đánh dấu đã hoàn thành')); expect(store.getState().assignments.items[0].isSubmitted).toBe(true); });
});
