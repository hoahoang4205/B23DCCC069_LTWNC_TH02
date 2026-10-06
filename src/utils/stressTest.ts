import { Assignment, Priority } from '../types';

const SUBJECTS = [
  'Lập trình Web',
  'Cơ sở dữ liệu',
  'Toán rời rạc',
  'Mạng máy tính',
  'Trí tuệ nhân tạo',
];

const PRIORITIES = [Priority.High, Priority.Medium, Priority.Low] as const;

export function generateStressData(count: number): Assignment[] {
  const now = new Date();
  const timestamp = now.toISOString();

  return Array.from({ length: count }, (_, index) => {
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + ((index % 30) - 10));
    const isSubmitted = index % 3 === 0;

    return {
      id: `stress-${index}`,
      subject: SUBJECTS[index % SUBJECTS.length],
      title: `Bài tập mẫu ${index + 1}`,
      description: '',
      dueDate: dueDate.toISOString(),
      assignedDate: timestamp,
      priority: PRIORITIES[index % PRIORITIES.length],
      isSubmitted,
      submittedAt: isSubmitted ? timestamp : null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}