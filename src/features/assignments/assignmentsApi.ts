import { Assignment, ApiResponse, Priority } from '../../types';

const day = 86_400_000;
const now = Date.now();

export const mockAssignments: Assignment[] = [
  { id: 'sample-1', subject: 'Lập trình Web', title: 'Báo cáo giữa kỳ', description: 'Xây dựng báo cáo phân tích một ứng dụng web hiện đại.', dueDate: new Date(now + 4 * 60 * 60 * 1000).toISOString(), assignedDate: new Date(now - day * 5).toISOString(), priority: Priority.High, isSubmitted: false, submittedAt: null, createdAt: new Date(now - day * 5).toISOString(), updatedAt: new Date(now - day * 5).toISOString() },
  { id: 'sample-2', subject: 'Triết học', title: 'Bài thu hoạch tuần 2', description: 'Tóm tắt nội dung và phân tích vấn đề triết học trong chương học.', dueDate: new Date(now - day * 2).toISOString(), assignedDate: new Date(now - day * 10).toISOString(), priority: Priority.Medium, isSubmitted: false, submittedAt: null, createdAt: new Date(now - day * 10).toISOString(), updatedAt: new Date(now - day * 10).toISOString() },
  { id: 'sample-3', subject: 'Toán rời rạc', title: 'Bài tập đồ thị', description: 'Giải các bài toán đường đi ngắn nhất.', dueDate: new Date(now + day * 1.5).toISOString(), assignedDate: new Date(now - day * 2).toISOString(), priority: Priority.High, isSubmitted: false, submittedAt: null, createdAt: new Date(now - day * 2).toISOString(), updatedAt: new Date(now - day * 2).toISOString() },
  { id: 'sample-4', subject: 'Cơ sở dữ liệu', title: 'Thiết kế ERD', description: 'Thiết kế mô hình dữ liệu cho hệ thống thư viện.', dueDate: new Date(now + day * 3).toISOString(), assignedDate: new Date(now - day * 3).toISOString(), priority: Priority.Low, isSubmitted: true, submittedAt: new Date(now - 3_600_000).toISOString(), createdAt: new Date(now - day * 3).toISOString(), updatedAt: new Date(now - 3_600_000).toISOString() },
  { id: 'sample-5', subject: 'Lập trình Web', title: 'Thực hành React Hooks', description: 'Ứng dụng useEffect và custom hooks vào một trang dashboard.', dueDate: new Date(now + day * 5).toISOString(), assignedDate: new Date(now - day).toISOString(), priority: Priority.Medium, isSubmitted: false, submittedAt: null, createdAt: new Date(now - day).toISOString(), updatedAt: new Date(now - day).toISOString() },
  { id: 'sample-6', subject: 'Hệ điều hành', title: 'Bài lab tiến trình', description: 'Thực hành đồng bộ hóa tiến trình trong Linux.', dueDate: new Date(now + day * 7).toISOString(), assignedDate: new Date(now - day * 4).toISOString(), priority: Priority.Low, isSubmitted: false, submittedAt: null, createdAt: new Date(now - day * 4).toISOString(), updatedAt: new Date(now - day * 4).toISOString() },
  { id: 'sample-7', subject: 'Triết học', title: 'Quiz chương 3', description: 'Ôn tập các trường phái và khái niệm triết học chính.', dueDate: new Date(now + day * 10).toISOString(), assignedDate: new Date(now - day * 2).toISOString(), priority: Priority.Low, isSubmitted: true, submittedAt: new Date(now - day).toISOString(), createdAt: new Date(now - day * 2).toISOString(), updatedAt: new Date(now - day).toISOString() },
  { id: 'sample-8', subject: 'Toán rời rạc', title: 'Tiểu luận logic', description: 'Viết tiểu luận ngắn về logic mệnh đề.', dueDate: new Date(now + day * 14).toISOString(), assignedDate: new Date(now).toISOString(), priority: Priority.Medium, isSubmitted: false, submittedAt: null, createdAt: new Date(now).toISOString(), updatedAt: new Date(now).toISOString() },
];

export async function fetchMockAssignments(): Promise<ApiResponse<Assignment[]>> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 800));
  return { statusCode: 200, message: 'Mock assignments loaded', data: mockAssignments };
}
