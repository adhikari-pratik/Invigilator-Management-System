import React from 'react';

const StatCard = ({ title, value, icon, loading = false }) => {
  return (
    <div className="dashboard-card">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 w-24 rounded"></div>
          <div className="mt-1 h-8 bg-gray-300 dark:bg-gray-600 w-16 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="dashboard-card-title">{title}</div>
            <div className="flex-shrink-0">{icon}</div>
          </div>
          <div className="dashboard-card-value">{value}</div>
        </>
      )}
    </div>
  );
};

export default StatCard;