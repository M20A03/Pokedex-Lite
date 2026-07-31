import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, totalCount, itemsPerPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, totalCount);

  // Build page numbers to show
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.info}>
        Showing {start}–{end} of {totalCount.toLocaleString()}
      </span>

      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.navBtn}`}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          id="pagination-prev"
        >
          ‹ PREV
        </button>

        {getVisiblePages().map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className={styles.dots}>···</span>
          ) : (
            <button
              key={p}
              className={`${styles.btn} ${styles.pageBtn} ${p === page ? styles.active : ''}`}
              onClick={() => onPageChange(p)}
              id={`pagination-page-${p}`}
            >
              {p}
            </button>
          )
        )}

        <button
          className={`${styles.btn} ${styles.navBtn}`}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          id="pagination-next"
        >
          NEXT ›
        </button>
      </div>
    </div>
  );
}
