function Pagination({ pagination, onPageChange }) {
  const handleClick = (e, page) => {
    e.preventDefault();
    if (page < 1 || page > pagination.total_pages) return;
    onPageChange(page);
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        {/* 上一頁 */}
        <li className={`page-item ${pagination.has_pre ? "" : "disabled"}`}>
          <a
            className="page-link"
            href="#"
            aria-label="Previous"
            onClick={(e) => handleClick(e, pagination.current_page - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        {/* 頁碼 */}
        {Array.from({ length: pagination.total_pages }, (_, index) => (
          <li
            key={`${index}_page`}
            className={`page-item ${
              pagination.current_page === index + 1 ? "active" : ""
            }`}
          >
            <a
              className="page-link"
              href="#"
              onClick={(e) => handleClick(e, index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}

        {/* 下一頁 */}
        <li className={`page-item ${pagination.has_next ? "" : "disabled"}`}>
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={(e) => handleClick(e, pagination.current_page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
