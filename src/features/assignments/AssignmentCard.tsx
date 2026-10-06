import { memo } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { Assignment, isOverdue, Priority } from '../../types';
import { formatDateTime } from '../../utils/date';
import { toggleSubmitted } from './assignmentsSlice';
import CountdownCompact from '../../components/Countdown/CountdownCompact';
import { useCountdown } from '../../hooks/useCountdown';

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (assignment: Assignment) => void;
  onDetails: (assignment: Assignment) => void;
  onCompleted?: (isCompleted: boolean) => void;
  isPinned?: boolean;
  onPin?: (id: string) => void;
  onToggle?: (id: string) => void;
}
const priorityLabel: Record<Priority, string> = { [Priority.High]: 'Cao', [Priority.Medium]: 'Trung bình', [Priority.Low]: 'Thấp' };

const AssignmentCard = memo(function AssignmentCard({ assignment, onDelete, onDetails, onCompleted, isPinned = false, onPin, onToggle }: AssignmentCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const countdown = useCountdown(assignment.dueDate, assignment.isSubmitted);
  const overdue = isOverdue(assignment);
  const toggleAssignment = (): void => {
    if (onToggle) onToggle(assignment.id);
    else dispatch(toggleSubmitted(assignment.id));
  };
  return <article className={`assignment-card ${overdue ? 'overdue' : ''} ${assignment.isSubmitted ? 'completed' : ''}`}>
    <div className="card-main">
      <input className="assignment-checkbox" type="checkbox" checked={assignment.isSubmitted} aria-label={assignment.isSubmitted ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu hoàn thành'} onChange={toggleAssignment} />
      <div className="assignment-content">
      <div className="card-top"><div className="title-block"><h3 style={{ textDecoration: assignment.isSubmitted ? 'line-through' : undefined }}>{assignment.title}</h3><span className="subject-tag">{assignment.subject}</span></div><div className="card-status">{assignment.isSubmitted ? <span className="submitted-badge"><span aria-hidden="true">✓</span> Đã hoàn thành</span> : <span className={`priority-tag ${assignment.priority}`}>{priorityLabel[assignment.priority]}</span>}{onPin && <button className={`pin-btn${isPinned ? ' active' : ''}`} type="button" aria-label={isPinned ? 'Bỏ ghim' : 'Ghim bài tập'} aria-pressed={isPinned} title={isPinned ? 'Bỏ ghim' : 'Ghim bài tập'} onClick={() => onPin(assignment.id)}>{isPinned ? '📌' : '☆'}</button>}<button className="delete-icon" aria-label={`Xóa ${assignment.title}`} title="Xóa nhiệm vụ" onClick={() => onDelete(assignment)}>×</button></div></div>
        <p className="card-description">{assignment.description || 'Chưa có mô tả.'}</p>
        <div className="meta"><div className="meta-info"><span>📅 {formatDateTime(assignment.dueDate)}</span><span>·</span><CountdownCompact countdown={countdown} /></div><div className="card-actions"><button className={`complete-button ${assignment.isSubmitted ? 'completed-button' : ''}`} onClick={() => { toggleAssignment(); onCompleted?.(!assignment.isSubmitted); }}>{assignment.isSubmitted ? '↩ Bỏ đánh dấu hoàn thành' : '✓ Đánh dấu đã hoàn thành'}</button><button onClick={() => onDetails(assignment)}>Xem chi tiết</button></div></div>
      </div>
    </div>
  </article>;
});

export default AssignmentCard;
