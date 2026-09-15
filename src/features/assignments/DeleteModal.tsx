import Modal from '../../components/Modal';
import { Assignment } from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { deleteAssignment } from './assignmentsSlice';

interface DeleteModalProps { assignment: Assignment; onClose: () => void; onDeleted?: () => void; }
export default function DeleteModal({ assignment, onClose, onDeleted }: DeleteModalProps): JSX.Element {
  const dispatch = useAppDispatch();
  const confirm = (): void => { dispatch(deleteAssignment(assignment.id)); onClose(); onDeleted?.(); };
  return <Modal title="Xóa bài tập" onClose={onClose}><div className="delete-content"><p>Bạn có chắc muốn xóa bài tập <strong>{assignment.title}</strong> không?</p><div className="modal-actions"><button onClick={onClose}>Hủy</button><button className="danger-button" onClick={confirm}>Xóa vĩnh viễn</button></div></div></Modal>;
}
