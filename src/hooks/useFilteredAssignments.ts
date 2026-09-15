import { Assignment, FilterStatus, FilterState, isOverdue } from '../types';

export interface FilteredAssignmentsResult { paginated: Assignment[]; totalPages: number; totalCount: number; filteredCount: number; }

export function useFilteredAssignments(items: Assignment[], filters: FilterState): FilteredAssignmentsResult {
  const filtered = items.filter((item) => {
    const statusMatch = filters.status === FilterStatus.All || (filters.status === FilterStatus.Submitted && item.isSubmitted) || (filters.status === FilterStatus.NotSubmitted && !item.isSubmitted) || (filters.status === FilterStatus.Overdue && isOverdue(item));
    const priorityMatch = !filters.priority || item.priority === filters.priority;
    const subjectMatch = !filters.subject || item.subject === filters.subject;
    const search = filters.search.trim().toLowerCase();
    return statusMatch && priorityMatch && subjectMatch && (!search || `${item.subject} ${item.title}`.toLowerCase().includes(search));
  });
  const sorted = [...filtered].sort((left, right) => filters.sortBy === 'createdAtAsc' ? left.createdAt.localeCompare(right.createdAt) : right.createdAt.localeCompare(left.createdAt));
  const totalPages = Math.max(1, Math.ceil(sorted.length / filters.itemsPerPage));
  const page = Math.min(Math.max(filters.page, 1), totalPages);
  return { paginated: sorted.slice((page - 1) * filters.itemsPerPage, page * filters.itemsPerPage), totalPages, totalCount: items.length, filteredCount: sorted.length };
}
