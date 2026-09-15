import { describe, expect, it } from 'vitest';
import reducer, { addAssignment, deleteAssignment, toggleSubmitted } from './assignmentsSlice';
import { Assignment, Priority } from '../../types';

const item = (id: string): Assignment => ({ id, subject: 'Toán rời rạc', title: 'Bài tập', description: '', dueDate: '2026-09-20T10:00:00.000Z', assignedDate: '2026-09-10T10:00:00.000Z', priority: Priority.High, isSubmitted: false, submittedAt: null, createdAt: '2026-09-10T10:00:00.000Z', updatedAt: '2026-09-10T10:00:00.000Z' });
const payload = { subject: 'Lập trình Web', title: 'Báo cáo', description: 'Mô tả', dueDate: '2026-09-20T10:00:00.000Z', priority: Priority.Medium };

describe('assignmentsSlice', () => {
  it('addAssignment tạo item đúng', () => { const state = reducer(undefined, addAssignment(payload)); expect(state.items).toHaveLength(1); expect(state.items[0]).toMatchObject({ ...payload, isSubmitted: false, submittedAt: null }); });
  it('deleteAssignment xoá đúng', () => { const state = reducer({ items: [item('1'), item('2')], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, deleteAssignment('1')); expect(state.items.map((entry) => entry.id)).toEqual(['2']); });
  it('toggleSubmitted đánh dấu khi chưa nộp', () => { const state = reducer({ items: [item('1')], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, toggleSubmitted('1')); expect(state.items[0].isSubmitted).toBe(true); expect(state.items[0].submittedAt).not.toBeNull(); });
  it('toggleSubmitted bỏ đánh dấu khi đã nộp', () => { const submitted = { ...item('1'), isSubmitted: true, submittedAt: '2026-09-12T10:00:00.000Z' }; const state = reducer({ items: [submitted], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, toggleSubmitted('1')); expect(state.items[0]).toMatchObject({ isSubmitted: false, submittedAt: null }); });
  it('giữ vị trí item sau khi toggle', () => { const state = reducer({ items: [item('1'), item('2')], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, toggleSubmitted('1')); expect(state.items.map((entry) => entry.id)).toEqual(['1', '2']); });
});
