import { describe, expect, it } from '@jest/globals';
import reducer, { addAssignment, bulkAdd, deleteAssignment, toggleSubmitted } from './assignmentsSlice';
import { Priority, type Assignment } from '../../types';
import { generateStressData } from '../../utils/stressTest';

const item = (id: string): Assignment => ({ id, subject: 'Toán rời rạc', title: 'Bài tập', description: '', dueDate: '2026-09-20T10:00:00.000Z', assignedDate: '2026-09-10T10:00:00.000Z', priority: Priority.High, isSubmitted: false, submittedAt: null, createdAt: '2026-09-10T10:00:00.000Z', updatedAt: '2026-09-10T10:00:00.000Z' });
const payload = { subject: 'Lập trình Web', title: 'Báo cáo', description: 'Mô tả', dueDate: '2026-09-20T10:00:00.000Z', priority: Priority.Medium };

describe('assignmentsSlice', () => {
  it('addAssignment tạo item đúng', () => { const state = reducer(undefined, addAssignment(payload)); expect(state.items).toHaveLength(1); expect(state.items[0]).toMatchObject({ ...payload, isSubmitted: false, submittedAt: null }); });
  it('deleteAssignment xoá đúng', () => { const state = reducer({ items: [item('1'), item('2')], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, deleteAssignment('1')); expect(state.items.map((entry) => entry.id)).toEqual(['2']); });
  it('toggleSubmitted đánh dấu khi chưa nộp', () => { const state = reducer({ items: [item('1')], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, toggleSubmitted('1')); expect(state.items[0].isSubmitted).toBe(true); expect(state.items[0].submittedAt).not.toBeNull(); });
  it('toggleSubmitted bỏ đánh dấu khi đã nộp', () => { const submitted = { ...item('1'), isSubmitted: true, submittedAt: '2026-09-12T10:00:00.000Z' }; const state = reducer({ items: [submitted], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, toggleSubmitted('1')); expect(state.items[0]).toMatchObject({ isSubmitted: false, submittedAt: null }); });
  it('giữ vị trí item sau khi toggle', () => { const state = reducer({ items: [item('1'), item('2')], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, toggleSubmitted('1')); expect(state.items.map((entry) => entry.id)).toEqual(['1', '2']); });
  it('bulkAdd thay danh sách hiện tại bằng payload mới', () => { const state = reducer({ items: [item('old')], status: 'idle', error: null, filters: reducer(undefined, { type: 'init' }).filters }, bulkAdd([item('new')])); expect(state.items.map((entry) => entry.id)).toEqual(['new']); });
  it('generateStressData tạo 10.000 Assignment đầy đủ field', () => { const generated = generateStressData(10_000); expect(generated).toHaveLength(10_000); expect(generated[0]).toMatchObject({ id: 'stress-0', subject: 'Lập trình Web', title: 'Bài tập mẫu 1', isSubmitted: true, priority: Priority.High }); expect(generated[0].assignedDate).toEqual(expect.any(String)); expect(generated[0].updatedAt).toEqual(expect.any(String)); expect(generated[1].submittedAt).toBeNull(); });
  it('xóa bài vừa tạo theo id', () => {
    const stateWithItem = reducer(undefined, addAssignment(payload));
    const addedId = stateWithItem.items[0].id;
    const state = reducer(stateWithItem, deleteAssignment(addedId));

    expect(state.items).toHaveLength(0);
  });
  it('bulkAdd thay toàn bộ items cũ bằng danh sách mới', () => {
    const current = { ...reducer(undefined, { type: 'init' }), items: [item('old')] };
    const replacement = [item('x1'), item('x2')];
    const state = reducer(current, bulkAdd(replacement));

    expect(state.items.map((entry) => entry.id)).toEqual(['x1', 'x2']);
  });
});
