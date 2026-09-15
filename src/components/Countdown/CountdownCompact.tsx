import { CountdownState } from '../../types';

export default function CountdownCompact({ countdown }: { countdown: CountdownState }): JSX.Element {
  if (countdown.kind === 'submitted') return <span className="countdown submitted-label">📤 Đã nộp</span>;
  const prefix = countdown.kind === 'overdue' ? '⚠️ Quá hạn' : '⏰ Còn';
  return <span className={`countdown ${countdown.kind}`}>{prefix} {countdown.days} ngày {countdown.hours} giờ {countdown.minutes} phút {countdown.seconds} giây</span>;
}
