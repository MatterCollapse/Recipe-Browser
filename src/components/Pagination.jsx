export default function Pagination({ page, lastPage, total, onChange }) {
  if (!lastPage || lastPage <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="btn btn-small"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>
      <span>
        Page {page} of {lastPage} {typeof total === 'number' ? `(${total} recipes)` : ''}
      </span>
      <button
        className="btn btn-small"
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
