export enum Priority {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export enum FilterStatus {
  All = 'all',
  NotSubmitted = 'notSubmitted',
  Overdue = 'overdue',
  Submitted = 'submitted',
}

export enum SortBy {
  CreatedAtDesc = 'createdAtDesc',
  CreatedAtAsc = 'createdAtAsc',
}

export interface HasId {
  id: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface Assignment extends HasId {
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  priority: Priority;
  isSubmitted: boolean;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateAssignmentDto = Omit<
  Assignment,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'isSubmitted'
  | 'submittedAt'
  | 'assignedDate'
>;

export type AssignmentPreview = Pick<
  Assignment,
  'id' | 'subject' | 'title' | 'dueDate' | 'priority' | 'isSubmitted'
>;

export interface FilterState {
  status: FilterStatus;
  priority: Priority | null;
  subject: string | null;
  search: string;
  sortBy: SortBy;
  page: number;
  itemsPerPage: number;
}

export type CountdownState =
  | {
      kind: 'overdue';
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }
  | {
      kind: 'urgent';
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }
  | {
      kind: 'warning';
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }
  | {
      kind: 'normal';
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }
  | { kind: 'submitted' };

export function isOverdue(assignment: Assignment): boolean {
  return !assignment.isSubmitted && new Date(assignment.dueDate).getTime() < Date.now();
}

export function isSubmitted(assignment: Assignment): boolean {
  return assignment.isSubmitted;
}
