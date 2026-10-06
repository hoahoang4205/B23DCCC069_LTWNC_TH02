import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useDebounce } from '../../hooks/useDebounce';
import { Priority, SortBy } from '../../types';
import { setFilters } from './assignmentsSlice';

export default function Toolbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.assignments);
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilters({ search: debouncedSearch, page: 1 }));
    }
  }, [debouncedSearch, dispatch, filters.search]);

  return <div className="toolbar"><label className="search-field">⌕<input value={search} placeholder="Tìm theo môn hoặc tên bài..." onChange={(event) => setSearch(event.currentTarget.value)} /></label><select value={filters.priority ?? ''} aria-label="Lọc ưu tiên" onChange={(event) => dispatch(setFilters({ priority: event.target.value ? event.target.value as Priority : null, page: 1 }))}><option value="">Mọi ưu tiên</option><option value={Priority.High}>Cao</option><option value={Priority.Medium}>Trung bình</option><option value={Priority.Low}>Thấp</option></select><select value={filters.sortBy} aria-label="Sắp xếp" onChange={(event) => dispatch(setFilters({ sortBy: event.target.value as SortBy, page: 1 }))}><option value={SortBy.CreatedAtDesc}>Mới nhất</option><option value={SortBy.CreatedAtAsc}>Cũ nhất</option></select></div>;
}
