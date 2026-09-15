import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useFilteredAssignments } from '../../hooks/useFilteredAssignments';
import { Assignment } from '../../types';
import Pagination from '../../components/Pagination';
import AssignmentCard from './AssignmentCard';
import DeleteModal from './DeleteModal';
import { setFilters } from './assignmentsSlice';
import Modal from '../../components/Modal';
import CountdownCompact from '../../components/Countdown/CountdownCompact';
import { formatDateTime } from '../../utils/date';
import { useCountdown } from '../../hooks/useCountdown';
import { toggleSubmitted } from './assignmentsSlice';

interface AssignmentListProps { onCompleted?: (isCompleted: boolean) => void; onDeleted?: () => void; }

function AssignmentDetails({ assignment, onClose, onCompleted }: { assignment: Assignment; onClose: () => void; onCompleted?: (isCompleted: boolean) => void }): JSX.Element {
  const dispatch = useAppDispatch();
  const countdown = useCountdown(assignment.dueDate, assignment.isSubmitted);
  const completeAndClose = (): void => { dispatch(toggleSubmitted(assignment.id)); onCompleted?.(!assignment.isSubmitted); onClose(); };
  return <Modal title={assignment.subject} onClose={onClose}><div className="assignment-details"><div className="deadline-banner"><span className="info-icon" aria-hidden="true">i</span><span>Thời gian còn lại để nộp: <strong className="deadline-countdown"><CountdownCompact countdown={countdown} /></strong> <strong>({formatDateTime(assignment.dueDate)})</strong></span></div><div className="details-heading">Chi tiết bài tập</div><div className="details-meta"><p><span>Hạn nộp</span><strong>{formatDateTime(assignment.dueDate)}</strong></p><p><span>Thời gian khởi tạo</span><strong>{formatDateTime(assignment.assignedDate)}</strong></p></div><h3>{assignment.title}</h3><div className="details-section"><h4>Mô tả</h4><p className="full-description">{assignment.description || 'Chưa có mô tả.'}</p></div><div className="details-actions"><button className="complete-button" onClick={completeAndClose}>{assignment.isSubmitted ? '↩ Bỏ đánh dấu hoàn thành' : '✓ Đánh dấu đã hoàn thành'}</button><button className="details-cancel" onClick={onClose}>Thoát</button></div></div></Modal>;
}

export default function AssignmentList({ onCompleted, onDeleted }: AssignmentListProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { items, filters, status, error } = useAppSelector((state) => state.assignments);
  const result = useFilteredAssignments(items, filters);
  const [deleting, setDeleting] = useState<Assignment | null>(null);
  const [details, setDetails] = useState<Assignment | null>(null);
  if (status === 'loading') return <div className="state-box">Đang tải bài tập...</div>;
  if (status === 'failed') return <div className="state-box error">{error}</div>;
  return <><Pagination page={filters.page} totalPages={result.totalPages} onChange={(page) => dispatch(setFilters({ page }))} />{result.paginated.length ? <div className="assignment-list">{result.paginated.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} onDelete={setDeleting} onDetails={setDetails} onCompleted={onCompleted} />)}</div> : <div className="state-box">Không tìm thấy bài tập phù hợp.</div>}{details && <AssignmentDetails assignment={details} onClose={() => setDetails(null)} onCompleted={onCompleted} />}{deleting && <DeleteModal assignment={deleting} onClose={() => setDeleting(null)} onDeleted={onDeleted} />}</>;
}
