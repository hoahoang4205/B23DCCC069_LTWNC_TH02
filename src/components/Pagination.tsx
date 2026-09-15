interface PaginationProps { page: number; totalPages: number; onChange: (page: number) => void; }

export default function Pagination({ page, totalPages, onChange }: PaginationProps): JSX.Element | null {
  if (totalPages <= 1) return null;
  return <nav className="pagination" aria-label="Phân trang"><button disabled={page === 1} onClick={() => onChange(page - 1)}>←</button><div className="page-numbers">{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button className={pageNumber === page ? 'active' : ''} key={pageNumber} aria-current={pageNumber === page ? 'page' : undefined} onClick={() => onChange(pageNumber)}>{pageNumber}</button>)}</div><button disabled={page === totalPages} onClick={() => onChange(page + 1)}>→</button></nav>;
}
