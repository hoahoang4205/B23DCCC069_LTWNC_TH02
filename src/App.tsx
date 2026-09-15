import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchAssignments } from './features/assignments/assignmentsSlice';
import { useLocalStorageSync } from './hooks/useLocalStorageSync';
import FilterStats from './features/assignments/FilterStats';
import Toolbar from './features/assignments/Toolbar';
import AssignmentList from './features/assignments/AssignmentList';
import AddForm from './features/assignments/AddForm';
import './App.css';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.assignments);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => { if (status === 'idle') void dispatch(fetchAssignments()); }, [dispatch, status]);
  useEffect(() => { if (!notice) return undefined; const timer = window.setTimeout(() => setNotice(null), 2800); return () => window.clearTimeout(timer); }, [notice]);
  useLocalStorageSync('deadline-tracker:v3', status === 'succeeded' ? items : null);
  return <div className="app-shell"><header className="app-header"><div className="brand"><span className="brand-mark">📚</span><div><h1>Deadline Tracker</h1><p>Quản lý bài tập thật nhẹ nhàng</p></div></div><div className="avatar">HH</div></header><main className="layout"><section className="content-column"><div className="section-heading"><div><span className="eyebrow">TỔNG QUAN</span><h2>Bài tập của bạn</h2></div><span className="assignment-count">{items.length} bài tập</span></div><FilterStats /><Toolbar /><AssignmentList onCompleted={(isCompleted) => setNotice(isCompleted ? 'Bài tập đã được hoàn thành' : 'Đã bỏ đánh dấu hoàn thành')} onDeleted={() => setNotice('Đã xóa bài tập thành công')} /></section><aside className="sidebar"><AddForm onAdded={() => setNotice('Đã tạo bài tập thành công')} /></aside></main>{notice && <div className="toast" role="status">✓ <span>{notice}</span></div>}</div>;
}
