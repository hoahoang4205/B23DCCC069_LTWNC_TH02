import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { calcStats } from '../../utils/stats';

export default function StatsPage(): JSX.Element {
  const items = useAppSelector((state) => state.assignments.items);

  const stats = useMemo(() => calcStats(items), [items]);

  return (
    <section className="stats-page">
      <h1>📊 Thống kê</h1>
      <div className="stats-grid">
        <div className="stat-box"><span>Tổng bài tập</span><strong>{stats.total}</strong></div>
        <div className="stat-box"><span>Đã nộp</span><strong>{stats.done}</strong></div>
        <div className="stat-box"><span>Quá hạn</span><strong>{stats.overdue}</strong></div>
        <div className="stat-box"><span>Chưa nộp</span><strong>{stats.notDone}</strong></div>
      </div>
      <h2>Theo môn học</h2>
      {Object.entries(stats.bySubject).map(([subject, subjectStats]) => (
        <div key={subject} className="subject-row">
          <span>{subject}</span>
          <span>{subjectStats.done}/{subjectStats.total}</span>
        </div>
      ))}
    </section>
  );
}