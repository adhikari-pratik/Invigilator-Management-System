import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate array of page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Always show at least 5 pages if available
    if (endPage - startPage + 1 < 5) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 4);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-secondary-800 border-t border-gray-200 dark:border-secondary-700 sm:px-6">
      <div className="flex justify-between sm:hidden w-full">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 dark:bg-secondary-700 dark:text-secondary-400 cursor-not-allowed'
              : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-secondary-700'
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 dark:bg-secondary-700 dark:text-secondary-400 cursor-not-allowed'
              : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-secondary-700'
          }`}
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous page button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-secondary-600 text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 dark:bg-secondary-700 dark:text-secondary-400 cursor-not-allowed'
                  : 'bg-white dark:bg-secondary-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* First page button (only show if not near first page) */}
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700"
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                    ...
                  </span>
                )}
              </>
            )}
            
            {/* Page number buttons */}
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-200'
                    : 'bg-white dark:bg-secondary-800 border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Last page button (only show if not near last page) */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                    ...
                  </span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            {/* Next page button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-secondary-600 text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 dark:bg-secondary-700 dark:text-secondary-400 cursor-not-allowed'
                  : 'bg-white dark:bg-secondary-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
              }`}
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;