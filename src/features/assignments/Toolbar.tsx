import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Priority, SortBy } from '../../types';
import { setFilters } from './assignmentsSlice';

export default function Toolbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.assignments);
  return <div className="toolbar"><label className="search-field">⌕<input value={filters.search} placeholder="Tìm theo môn hoặc tên bài..." onChange={(event) => dispatch(setFilters({ search: event.target.value, page: 1 }))} /></label><select value={filters.priority ?? ''} aria-label="Lọc ưu tiên" onChange={(event) => dispatch(setFilters({ priority: event.target.value ? event.target.value as Priority : null, page: 1 }))}><option value="">Mọi ưu tiên</option><option value={Priority.High}>Cao</option><option value={Priority.Medium}>Trung bình</option><option value={Priority.Low}>Thấp</option></select><select value={filters.sortBy} aria-label="Sắp xếp" onChange={(event) => dispatch(setFilters({ sortBy: event.target.value as SortBy, page: 1 }))}><option value={SortBy.CreatedAtDesc}>Mới nhất</option><option value={SortBy.CreatedAtAsc}>Cũ nhất</option></select></div>;
}
