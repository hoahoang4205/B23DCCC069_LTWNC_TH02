import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchAssignments } from './features/assignments/assignmentsSlice';
import { useLocalStorageSync } from './hooks/useLocalStorageSync';
import FilterStats from './features/assignments/FilterStats';
import Toolbar from './features/assignments/Toolbar';
import AssignmentList from './features/assignments/AssignmentList';
import AddForm from './features/assignments/AddForm';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

const StatsPage = lazy(() => import('./features/assignments/StatsPage'));

function AppContent(): JSX.Element {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.assignments);
  const [notice, setNotice] = useState<string | null>(null);
  const handleCompleted = (isCompleted: boolean) => setNotice(isCompleted ? 'Bài tập đã được hoàn thành' : 'Đã bỏ đánh dấu hoàn thành');
  const handleDeleted = () => setNotice('Đã xóa bài tập thành công');
  const handleAdded = () => setNotice('Đã tạo bài tập thành công');
  useEffect(() => { if (status === 'idle') void dispatch(fetchAssignments()); }, [dispatch, status]);
  useEffect(() => { if (!notice) return undefined; const timer = window.setTimeout(() => setNotice(null), 2800); return () => window.clearTimeout(timer); }, [notice]);
  useLocalStorageSync('deadline-tracker:v3', status === 'succeeded' ? items : null);
  return (
    <div className={theme === 'dark' ? 'app app-shell dark' : 'app app-shell'}>
      <header className="app-header">
        <div className="brand"><span className="brand-mark">📚</span><div><h1>Deadline Tracker</h1><p>Quản lý bài tập thật nhẹ nhàng</p></div></div>
        <div className="header-actions">
          <nav className="main-nav" aria-label="Điều hướng chính">
            <Link to="/">Bài tập</Link>
            <Link to="/stats">Thống kê</Link>
          </nav>
          <ThemeToggle />
          <div className="avatar">HH</div>
        </div>
      </header>
      <main className="layout">
        <Suspense fallback={<div className="state-box">Đang tải...</div>}>
          <Routes>
            <Route path="/" element={
              <>
                <section className="content-column">
                  <div className="section-heading"><div><span className="eyebrow">TỔNG QUAN</span><h2>Bài tập của bạn</h2></div><span className="assignment-count">{items.length} bài tập</span></div>
                  <FilterStats />
                  <Toolbar />
                  <AssignmentList onCompleted={handleCompleted} onDeleted={handleDeleted} />
                </section>
                <aside className="sidebar"><AddForm onAdded={handleAdded} /></aside>
              </>
            } />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Suspense>
      </main>
      {notice && <div className="toast" role="status">✓ <span>{notice}</span></div>}
    </div>
  );
}

export default function App(): JSX.Element {
  return <BrowserRouter><ThemeProvider><AppContent /></ThemeProvider></BrowserRouter>;
}
