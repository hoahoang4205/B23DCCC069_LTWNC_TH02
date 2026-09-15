import { Assignment, isOverdue, isSubmitted } from '../types';

function padNumber(value: number): string {
  return value.toString().padStart(2, '0');
}

function getDateParts(iso: string): [string, string, string, string, string] {
  const date = new Date(iso);

  return [
    padNumber(date.getDate()),
    padNumber(date.getMonth() + 1),
    date.getFullYear().toString(),
    padNumber(date.getHours()),
    padNumber(date.getMinutes()),
  ];
}

export function formatDateTime(iso: string): string {
  const [day, month, year, hours, minutes] = getDateParts(iso);
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatDate(iso: string): string {
  const [day, month, year] = getDateParts(iso);
  return `${day}/${month}/${year}`;
}

export function getDeadlineLabel(assignment: Assignment): string {
  if (isSubmitted(assignment)) {
    return assignment.submittedAt
      ? `📤 Nộp lúc ${formatDateTime(assignment.submittedAt)}`
      : '📤 Đã nộp';
  }

  const differenceInSeconds = Math.floor(
    Math.abs(new Date(assignment.dueDate).getTime() - Date.now()) / 1000,
  );

  if (isOverdue(assignment)) {
    const days = Math.floor(differenceInSeconds / 86_400);
    if (days >= 1) {
      return `⚠️ Quá hạn ${days} ngày`;
    }

    const hours = Math.floor(differenceInSeconds / 3_600);
    return `⚠️ Quá hạn ${hours} giờ`;
  }

  const days = Math.floor(differenceInSeconds / 86_400);
  if (days >= 1) {
    return `⏰ Còn ${days} ngày`;
  }

  const hours = Math.floor(differenceInSeconds / 3_600);
  if (hours >= 1) {
    const minutes = Math.floor((differenceInSeconds % 3_600) / 60);
    return `⏰ Còn ${hours} giờ ${minutes} phút`;
  }

  const minutes = Math.floor(differenceInSeconds / 60);
  const seconds = differenceInSeconds % 60;
  return `⏰ Còn ${minutes} phút ${seconds} giây`;
}
