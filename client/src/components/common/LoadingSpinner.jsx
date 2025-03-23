import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  let sizeClass = 'h-8 w-8';
  if (size === 'sm') sizeClass = 'h-5 w-5';
  if (size === 'lg') sizeClass = 'h-12 w-12';

  return (
    <div className="flex justify-center py-8">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${sizeClass}`}></div>
    </div>
  );
};

export default LoadingSpinner;