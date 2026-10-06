import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { formatDate, formatDateTime, getDeadlineLabel } from './date';
import { Priority, type Assignment } from '../types';

const makeAssignment = (override: Partial<Assignment> = {}): Assignment => {
  const timestamp = new Date().toISOString();
  return {
    id: '1',
    subject: 'Test',
    title: 'Bài tập',
    description: '',
    dueDate: timestamp,
    assignedDate: timestamp,
    priority: Priority.High,
    isSubmitted: false,
    submittedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...override,
  };
};

describe('date utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('formatDateTime định dạng ngày giờ theo giờ địa phương', () => {
    const date = new Date(2024, 5, 15, 12, 34);
    expect(formatDateTime(date.toISOString())).toBe('15/06/2024 12:34');
  });

  it('formatDate chỉ trả về ngày tháng năm', () => {
    const date = new Date(2024, 5, 15, 12, 34);
    expect(formatDate(date.toISOString())).toBe('15/06/2024');
  });

  it('getDeadlineLabel báo trạng thái đã nộp', () => {
    expect(getDeadlineLabel(makeAssignment({ isSubmitted: true }))).toBe('📤 Đã nộp');
  });

  it('getDeadlineLabel hiển thị thời điểm nộp nếu có', () => {
    const submittedAt = new Date('2025-12-31T10:30:00.000Z').toISOString();
    expect(getDeadlineLabel(makeAssignment({ isSubmitted: true, submittedAt }))).toBe(`📤 Nộp lúc ${formatDateTime(submittedAt)}`);
  });

  it('getDeadlineLabel hiển thị số ngày quá hạn', () => {
    const dueDate = new Date(Date.now() - 2 * 86_400_000 - 60_000).toISOString();
    expect(getDeadlineLabel(makeAssignment({ dueDate }))).toBe('⚠️ Quá hạn 2 ngày');
  });

  it('getDeadlineLabel hiển thị giờ quá hạn dưới một ngày', () => {
    const dueDate = new Date(Date.now() - 3 * 3_600_000 - 60_000).toISOString();
    expect(getDeadlineLabel(makeAssignment({ dueDate }))).toBe('⚠️ Quá hạn 3 giờ');
  });

  it('getDeadlineLabel hiển thị số ngày còn lại', () => {
    const dueDate = new Date(Date.now() + 3 * 86_400_000 + 60_000).toISOString();
    expect(getDeadlineLabel(makeAssignment({ dueDate }))).toBe('⏰ Còn 3 ngày');
  });

  it('getDeadlineLabel hiển thị giờ và phút còn lại', () => {
    const dueDate = new Date(Date.now() + 2 * 3_600_000 + 60_000).toISOString();
    expect(getDeadlineLabel(makeAssignment({ dueDate }))).toBe('⏰ Còn 2 giờ 1 phút');
  });

  it('getDeadlineLabel hiển thị phút và giây còn lại', () => {
    const dueDate = new Date(Date.now() + 5 * 60_000 + 10_000).toISOString();
    expect(getDeadlineLabel(makeAssignment({ dueDate }))).toBe('⏰ Còn 5 phút 10 giây');
  });
});