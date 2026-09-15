import { FormEvent, useRef, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { CreateAssignmentDto, Priority } from '../../types';
import { addAssignment } from './assignmentsSlice';

const subjects = ['Lập trình Web', 'Triết học', 'Toán rời rạc', 'Cơ sở dữ liệu', 'Hệ điều hành'];
type AddFormState = Omit<CreateAssignmentDto, 'dueDate'> & { dueDate: string };
const initialForm: AddFormState = { subject: subjects[0], title: '', description: '', dueDate: '', priority: Priority.Medium };
interface AddFormProps { onAdded?: () => void; }

export default function AddForm({ onAdded }: AddFormProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<AddFormState>(initialForm);
  const titleRef = useRef<HTMLInputElement>(null);
  const update = (field: keyof CreateAssignmentDto, value: string): void => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event: FormEvent<HTMLFormElement>): void => { event.preventDefault(); if (!form.title.trim() || !form.dueDate) return; dispatch(addAssignment({ ...form, dueDate: new Date(form.dueDate).toISOString(), title: form.title.trim() })); setForm(initialForm); titleRef.current?.focus(); onAdded?.(); };
  const minimumDueDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  return <form className="add-form" onSubmit={submit}><div className="form-title"><span>＋</span><h2>Thêm bài tập mới</h2></div><label>Môn học *<select value={form.subject} onChange={(event) => update('subject', event.target.value)}>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label><label>Tên bài tập *<input ref={titleRef} value={form.title} maxLength={120} required onChange={(event) => update('title', event.target.value)} /></label><label>Hạn nộp *<input type="datetime-local" value={form.dueDate} min={minimumDueDate} required onChange={(event) => update('dueDate', event.target.value)} /></label><label>Ưu tiên *<select value={form.priority} onChange={(event) => update('priority', event.target.value)}><option value={Priority.High}>Cao</option><option value={Priority.Medium}>Trung bình</option><option value={Priority.Low}>Thấp</option></select></label><label>Mô tả<textarea maxLength={500} rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} /></label><button className="primary-button" type="submit">＋ Thêm bài tập</button></form>;
}
