import { useMemo } from 'react';
import { Assignment, FilterStatus, FilterState, isOverdue } from '../types';

export interface FilteredAssignmentsResult { paginated: Assignment[]; totalPages: number; totalCount: number; filteredCount: number; }

export function useFilteredAssignments(items: Assignment[], filters: FilterState, pinnedIds: string[] = [], onlyPinned = false): FilteredAssignmentsResult {
  const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const search = filters.search.trim().toLowerCase();
  const filtered = useMemo(() => items.filter((item) => {
      const statusMatch = filters.status === FilterStatus.All || (filters.status === FilterStatus.Submitted && item.isSubmitted) || (filters.status === FilterStatus.NotSubmitted && !item.isSubmitted) || (filters.status === FilterStatus.Overdue && isOverdue(item));
      const priorityMatch = !filters.priority || item.priority === filters.priority;
      const subjectMatch = !filters.subject || item.subject === filters.subject;
      const pinnedMatch = !onlyPinned || pinnedSet.has(item.id);
      return statusMatch && priorityMatch && subjectMatch && pinnedMatch && (!search || `${item.subject} ${item.title}`.toLowerCase().includes(search));
    }), [items, filters.status, filters.priority, filters.subject, search, onlyPinned, pinnedSet]);
  const sorted = useMemo(() => [...filtered].sort((left, right) => {
    const pinOrder = Number(pinnedSet.has(right.id)) - Number(pinnedSet.has(left.id));
    if (pinOrder !== 0) return pinOrder;
    return filters.sortBy === 'createdAtAsc' ? left.createdAt.localeCompare(right.createdAt) : right.createdAt.localeCompare(left.createdAt);
  }), [filtered, filters.sortBy, pinnedSet]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / filters.itemsPerPage));
  const page = Math.min(Math.max(filters.page, 1), totalPages);
  const paginated = useMemo(() => sorted.slice((page - 1) * filters.itemsPerPage, page * filters.itemsPerPage), [sorted, page, filters.itemsPerPage]);
  return { paginated, totalPages, totalCount: items.length, filteredCount: sorted.length };
}
