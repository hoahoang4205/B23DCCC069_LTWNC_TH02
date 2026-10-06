import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List, type ListImperativeAPI, type RowComponentProps } from 'react-window';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useFilteredAssignments } from '../../hooks/useFilteredAssignments';
import { Assignment } from '../../types';
import { usePinStore } from '../../stores/pinStore';
import { generateStressData } from '../../utils/stressTest';
import Pagination from '../../components/Pagination';
import AssignmentCard from './AssignmentCard';
import DeleteModal from './DeleteModal';
import { bulkAdd, setFilters, toggleSubmitted } from './assignmentsSlice';
import Modal from '../../components/Modal';
import CountdownCompact from '../../components/Countdown/CountdownCompact';
import { formatDateTime } from '../../utils/date';
import { useCountdown } from '../../hooks/useCountdown';

interface AssignmentListProps { onCompleted?: (isCompleted: boolean) => void; onDeleted?: () => void; }
const VIRTUALIZATION_THRESHOLD = 30;
const VIRTUAL_ROW_HEIGHT = 124;

interface AssignmentRowProps {
  assignments: Assignment[];
  pinnedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (assignment: Assignment) => void;
  onDetails: (assignment: Assignment) => void;
  onCompleted?: (isCompleted: boolean) => void;
}

function AssignmentVirtualRow({ ariaAttributes, index, style, ...rowProps }: RowComponentProps<AssignmentRowProps>): JSX.Element | null {
  const assignment = rowProps.assignments[index];
  if (!assignment) return null;

  return (
    <div style={{ ...style, paddingBottom: 10 }} {...ariaAttributes}>
      <AssignmentCard
        assignment={assignment}
        isPinned={rowProps.pinnedIds.has(assignment.id)}
        onPin={rowProps.onPin}
        onToggle={rowProps.onToggle}
        onDelete={rowProps.onDelete}
        onDetails={rowProps.onDetails}
        onCompleted={rowProps.onCompleted}
      />
    </div>
  );
}

function assignmentRowKey(index: number, data: AssignmentRowProps): string | number {
  return data.assignments[index]?.id ?? index;
}

function AssignmentDetails({ assignment, onClose, onCompleted }: { assignment: Assignment; onClose: () => void; onCompleted?: (isCompleted: boolean) => void }): JSX.Element {
  const dispatch = useAppDispatch();
  const countdown = useCountdown(assignment.dueDate, assignment.isSubmitted);
  const completeAndClose = (): void => { dispatch(toggleSubmitted(assignment.id)); onCompleted?.(!assignment.isSubmitted); onClose(); };
  return <Modal title={assignment.subject} onClose={onClose}><div className="assignment-details"><div className="deadline-banner"><span className="info-icon" aria-hidden="true">i</span><span>Thời gian còn lại để nộp: <strong className="deadline-countdown"><CountdownCompact countdown={countdown} /></strong> <strong>({formatDateTime(assignment.dueDate)})</strong></span></div><div className="details-heading">Chi tiết bài tập</div><div className="details-meta"><p><span>Hạn nộp</span><strong>{formatDateTime(assignment.dueDate)}</strong></p><p><span>Thời gian khởi tạo</span><strong>{formatDateTime(assignment.assignedDate)}</strong></p></div><h3>{assignment.title}</h3><div className="details-section"><h4>Mô tả</h4><p className="full-description">{assignment.description || 'Chưa có mô tả.'}</p></div><div className="details-actions"><button className="complete-button" onClick={completeAndClose}>{assignment.isSubmitted ? '↩ Bỏ đánh dấu hoàn thành' : '✓ Đánh dấu đã hoàn thành'}</button><button className="details-cancel" onClick={onClose}>Thoát</button></div></div></Modal>;
}

export default function AssignmentList({ onCompleted, onDeleted }: AssignmentListProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { items, filters, status, error } = useAppSelector((state) => state.assignments);
  const pinnedIds = usePinStore((state) => state.pinnedIds);
  const togglePin = usePinStore((state) => state.togglePin);
  const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const [onlyPinned, setOnlyPinned] = useState(false);
  const result = useFilteredAssignments(items, filters, pinnedIds, onlyPinned);
  const [deleting, setDeleting] = useState<Assignment | null>(null);
  const [details, setDetails] = useState<Assignment | null>(null);
  const handleToggle = useCallback((id: string) => dispatch(toggleSubmitted(id)), [dispatch]);
  const handleDelete = useCallback((assignment: Assignment) => setDeleting(assignment), []);
  const handleDetails = useCallback((assignment: Assignment) => setDetails(assignment), []);
  const handlePin = useCallback((id: string) => togglePin(id), [togglePin]);
  const handleStressTest = useCallback(() => {
    dispatch(bulkAdd(generateStressData(10_000)));
    dispatch(setFilters({ itemsPerPage: Math.max(filters.itemsPerPage, 10_000), page: 1 }));
    setOnlyPinned(false);
  }, [dispatch, filters.itemsPerPage]);
  const listRef = useRef<ListImperativeAPI>(null);
  const rowProps = useMemo<AssignmentRowProps>(() => ({
    assignments: result.paginated,
    pinnedIds: pinnedSet,
    onToggle: handleToggle,
    onPin: handlePin,
    onDelete: handleDelete,
    onDetails: handleDetails,
    onCompleted,
  }), [result.paginated, pinnedSet, handleToggle, handlePin, handleDelete, handleDetails, onCompleted]);

  useEffect(() => {
    listRef.current?.scrollToRow({ index: 0 });
  }, [filters.page, filters.search, filters.status, filters.priority, filters.sortBy, pinnedIds, onlyPinned]);

  if (status === 'loading') return <div className="state-box">Đang tải bài tập...</div>;
  if (status === 'failed') return <div className="state-box error">{error}</div>;
  return <>
    <div className="assignment-tools">
      <label className="pinned-filter"><input type="checkbox" checked={onlyPinned} onChange={(event) => setOnlyPinned(event.currentTarget.checked)} /> Chỉ hiện bài đã ghim</label>
      <button className="btn-stress" type="button" onClick={handleStressTest}>🧪 Tạo 10.000 bài tập mẫu</button>
    </div>
    <Pagination page={filters.page} totalPages={result.totalPages} onChange={(page) => dispatch(setFilters({ page }))} />
    {result.paginated.length ? (
      result.filteredCount > VIRTUALIZATION_THRESHOLD ? (
        <List
          className="assignment-virtual-list"
          listRef={listRef}
          rowComponent={AssignmentVirtualRow}
          rowCount={result.paginated.length}
          rowHeight={VIRTUAL_ROW_HEIGHT}
          rowProps={rowProps}
          rowKey={assignmentRowKey}
          defaultHeight={600}
          overscanCount={3}
          style={{ height: 600, width: '100%' }}
        />
      ) : (
        <div className="assignment-list">{result.paginated.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} isPinned={pinnedSet.has(assignment.id)} onPin={handlePin} onToggle={handleToggle} onDelete={handleDelete} onDetails={handleDetails} onCompleted={onCompleted} />)}</div>
      )
    ) : <div className="state-box">Không tìm thấy bài tập phù hợp.</div>}
    {details && <AssignmentDetails assignment={details} onClose={() => setDetails(null)} onCompleted={onCompleted} />}
    {deleting && <DeleteModal assignment={deleting} onClose={() => setDeleting(null)} onDeleted={onDeleted} />}
  </>;
}
