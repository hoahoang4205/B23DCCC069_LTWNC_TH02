import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FilterStatus, isOverdue } from '../../types';
import { setFilters } from './assignmentsSlice';

export default function FilterStats(): JSX.Element {
  const dispatch = useAppDispatch();
  const { items, filters } = useAppSelector((state) => state.assignments);
  const stats = [{ label: 'Tất cả', value: items.length, status: FilterStatus.All }, { label: 'Chưa nộp', value: items.filter((item) => !item.isSubmitted).length, status: FilterStatus.NotSubmitted }, { label: 'Quá hạn', value: items.filter(isOverdue).length, status: FilterStatus.Overdue }, { label: 'Đã nộp', value: items.filter((item) => item.isSubmitted).length, status: FilterStatus.Submitted }];
  return <div className="stats-grid">{stats.map((stat) => <button className={`stat-card ${filters.status === stat.status ? 'active' : ''}`} key={stat.status} onClick={() => dispatch(setFilters({ status: stat.status, page: 1 }))}><strong>{stat.value}</strong><span>{stat.label}</span></button>)}</div>;
}
