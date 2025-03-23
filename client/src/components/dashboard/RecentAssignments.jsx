import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { 
  fetchRecentAssignments, 
  fetchInvigilatorAssignments,
  selectRecentAssignments 
} from '../../features/assignments/assignmentSlice';

const AssignmentStatusBadge = ({ status }) => {
  let badgeClass = '';
  
  switch (status) {
    case 'pending':
      badgeClass = 'badge-warning';
      break;
    case 'accepted':
      badgeClass = 'badge-success';
      break;
    case 'rejected':
      badgeClass = 'badge-danger';
      break;
    case 'completed':
      badgeClass = 'badge-secondary';
      break;
    default:
      badgeClass = 'badge-secondary';
  }
  
  return (
    <span className={`badge ${badgeClass} capitalize`}>
      {status}
    </span>
  );
};

const RecentAssignments = ({ invigilatorMode = false, limit = 5 }) => {
  const dispatch = useDispatch();
  const { recentAssignments, loading } = useSelector(selectRecentAssignments);
  
  useEffect(() => {
    if (invigilatorMode) {
      dispatch(fetchInvigilatorAssignments({ page: 1, limit }));
    } else {
      dispatch(fetchRecentAssignments({ page: 1, limit }));
    }
  }, [dispatch, invigilatorMode, limit]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!recentAssignments || recentAssignments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        No assignments found.
      </div>
    );
  }
  
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Exam</th>
            <th>Date</th>
            <th>Time</th>
            <th>{invigilatorMode ? 'Classroom' : 'Invigilator'}</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentAssignments.map((assignment) => (
            <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-secondary-700">
              <td>{assignment.exam.title}</td>
              <td>{format(new Date(assignment.exam.date), 'MMM d, yyyy')}</td>
              <td>{`${assignment.exam.startTime} - ${assignment.exam.endTime}`}</td>
              <td>
                {invigilatorMode 
                  ? assignment.classroom.name
                  : assignment.invigilator.fullName
                }
              </td>
              <td>
                <AssignmentStatusBadge status={assignment.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <Link 
          to={invigilatorMode ? "/my-assignments" : "/assignments"} 
          className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View all assignments
        </Link>
      </div>
    </div>
  );
};

export default RecentAssignments;