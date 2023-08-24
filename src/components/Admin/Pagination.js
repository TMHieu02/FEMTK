
import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <div>
      <button onClick={() => onPageChange(Math.max(currentPage - 1, 1))}>
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            backgroundColor: currentPage === page ? 'lightblue' : 'white',
          }}
        >
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
