import { renderHook } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { FilterStatus, Priority, SortBy, type Assignment, type FilterState } from '../types';
import { useFilteredAssignments } from './useFilteredAssignments';

const timestamp = new Date().toISOString();
const items: Assignment[] = [
  { id: 'new', subject: 'Web', title: 'React hooks', description: '', dueDate: new Date(Date.now() + 86_400_000).toISOString(), assignedDate: timestamp, priority: Priority.High, isSubmitted: false, submittedAt: null, createdAt: '2026-02-02', updatedAt: timestamp },
  { id: 'old', subject: 'Web', title: 'Redux', description: '', dueDate: new Date(Date.now() - 86_400_000).toISOString(), assignedDate: timestamp, priority: Priority.Medium, isSubmitted: false, submittedAt: null, createdAt: '2026-02-01', updatedAt: timestamp },
  { id: 'done', subject: 'CSDL', title: 'SQL', description: '', dueDate: new Date(Date.now() - 86_400_000).toISOString(), assignedDate: timestamp, priority: Priority.Low, isSubmitted: true, submittedAt: timestamp, createdAt: '2026-02-03', updatedAt: timestamp },
];

const makeFilters = (override: Partial<FilterState> = {}): FilterState => ({ status: FilterStatus.All, priority: null, subject: null, search: '', sortBy: SortBy.CreatedAtDesc, page: 1, itemsPerPage: 2, ...override });

describe('useFilteredAssignments', () => {
  it('lọc tìm kiếm, môn học, mức ưu tiên và chỉ bài ghim', () => {
    const { result, rerender } = renderHook(({ filters, pins, onlyPinned }) => useFilteredAssignments(items, filters, pins, onlyPinned), {
      initialProps: { filters: makeFilters({ search: 'react' }), pins: ['new'], onlyPinned: false },
    });
    expect(result.current.filteredCount).toBe(1);

    rerender({ filters: makeFilters({ subject: 'CSDL' }), pins: ['new'], onlyPinned: false });
    expect(result.current.paginated.map((item) => item.id)).toEqual(['done']);

    rerender({ filters: makeFilters({ priority: Priority.High }), pins: ['new'], onlyPinned: false });
    expect(result.current.paginated.map((item) => item.id)).toEqual(['new']);

    rerender({ filters: makeFilters(), pins: ['new'], onlyPinned: true });
    expect(result.current.paginated.map((item) => item.id)).toEqual(['new']);
  });

  it('lọc theo trạng thái và ngày quá hạn', () => {
    const { result, rerender } = renderHook(({ filters }) => useFilteredAssignments(items, filters), {
      initialProps: { filters: makeFilters({ status: FilterStatus.NotSubmitted }) },
    });
    expect(result.current.filteredCount).toBe(2);

    rerender({ filters: makeFilters({ status: FilterStatus.Overdue }) });
    expect(result.current.paginated.map((item) => item.id)).toEqual(['old']);

    rerender({ filters: makeFilters({ status: FilterStatus.Submitted }) });
    expect(result.current.paginated.map((item) => item.id)).toEqual(['done']);
  });

  it('sắp xếp hai chiều và giới hạn trang', () => {
    const { result, rerender } = renderHook(({ filters }) => useFilteredAssignments(items, filters), {
      initialProps: { filters: makeFilters({ sortBy: SortBy.CreatedAtAsc, itemsPerPage: 1 }) },
    });
    expect(result.current.paginated[0].id).toBe('old');
    expect(result.current.totalPages).toBe(3);

    rerender({ filters: makeFilters({ sortBy: SortBy.CreatedAtDesc, page: 1, itemsPerPage: 1 }) });
    expect(result.current.paginated[0].id).toBe('done');

    rerender({ filters: makeFilters({ sortBy: SortBy.CreatedAtDesc, page: 99, itemsPerPage: 1 }) });
    expect(result.current.paginated[0].id).toBe('old');
  });
});