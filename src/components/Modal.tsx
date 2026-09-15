import { ReactNode, useEffect } from 'react';

interface ModalProps { title: string; children: ReactNode; onClose: () => void; }

export default function Modal({ title, children, onClose }: ModalProps): JSX.Element {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent): void => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><div className="modal-box" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="Đóng" onClick={onClose}>×</button></div>{children}</div></div>;
}
