import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
	fetchInvigilatorAssignments,
	updateAssignmentStatus,
	selectInvigilatorAssignments,
	selectAssignmentsPagination,
	selectAssignmentsLoading,
} from "../../features/assignments/assignmentSlice";
import { FunnelIcon } from "@heroicons/react/24/outline";
import AssignmentDetailsModal from "../../components/assignments/AssignmentDetailsModal";
import AssignmentResponseModal from "../../components/assignments/AssignmentResponseModal";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyAssignmentsPage = () => {
	const dispatch = useDispatch();
	const assignments = useSelector(selectInvigilatorAssignments);
	const pagination = useSelector(selectAssignmentsPagination);
	const loading = useSelector(selectAssignmentsLoading);

	const [selectedAssignment, setSelectedAssignment] = useState(null);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
	const [filters, setFilters] = useState({
		status: "",
		page: 1,
	});
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchInvigilatorAssignments(filters));
	}, [dispatch, filters]);

	const handlePageChange = (page) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
			page: 1, // Reset to first page on filter change
		}));
	};

	const handleAssignmentClick = (assignment) => {
		setSelectedAssignment(assignment);
		setIsDetailsModalOpen(true);
	};

	const handleRespondAssignment = (assignment) => {
		setSelectedAssignment(assignment);
		setIsResponseModalOpen(true);
		setIsDetailsModalOpen(false);
	};

	const handleResponseSubmit = async (status, responseNote) => {
		await dispatch(
			updateAssignmentStatus({
				assignmentId: selectedAssignment.id,
				status,
				responseNote,
			})
		);
		setIsResponseModalOpen(false);
		dispatch(fetchInvigilatorAssignments(filters));
	};

	const formatStatus = (status) => {
		switch (status) {
			case "pending":
				return <span className="badge badge-warning">Pending</span>;
			case "accepted":
				return <span className="badge badge-success">Accepted</span>;
			case "rejected":
				return <span className="badge badge-danger">Rejected</span>;
			case "completed":
				return <span className="badge badge-secondary">Completed</span>;
			default:
				return <span className="badge badge-secondary">{status}</span>;
		}
	};

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					My Assignments
				</h1>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					View and manage your exam invigilation assignments.
				</p>
			</div>

			{/* Filters */}
			<div className="card mb-6">
				<div className="card-body">
					<div className="flex justify-between items-center">
						<div className="text-lg font-medium text-gray-900 dark:text-white">
							Assignments
						</div>
						<button
							onClick={() => setIsFilterOpen(!isFilterOpen)}
							className="btn btn-outline flex items-center"
						>
							<FunnelIcon className="h-5 w-5 mr-2" />
							Filters
						</button>
					</div>

					{isFilterOpen && (
						<div className="mt-4">
							<label htmlFor="status" className="form-label">
								Status
							</label>
							<select
								id="status"
								name="status"
								value={filters.status}
								onChange={handleFilterChange}
								className="form-input w-full sm:w-64"
							>
								<option value="">All Statuses</option>
								<option value="pending">Pending</option>
								<option value="accepted">Accepted</option>
								<option value="rejected">Rejected</option>
								<option value="completed">Completed</option>
							</select>
						</div>
					)}
				</div>
			</div>

			{/* Assignments table */}
			<div className="card">
				<div className="card-body">
					{loading ? (
						<LoadingSpinner />
					) : assignments.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-500 dark:text-gray-400">
								No assignments found.
							</p>
						</div>
					) : (
						<div className="table-container">
							<table className="table">
								<thead>
									<tr>
										<th>Exam</th>
										<th>Date</th>
										<th>Time</th>
										<th>Classroom</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{assignments.map((assignment) => (
										<tr
											key={assignment.id}
											className="hover:bg-gray-50 dark:hover:bg-secondary-700"
										>
											<td>{assignment.exam?.title || "N/A"}</td>
											<td>
												{assignment.exam?.date
													? format(
															new Date(assignment.exam.date),
															"MMM d, yyyy"
													  )
													: "N/A"}
											</td>
											<td>
												{assignment.exam?.startTime && assignment.exam?.endTime
													? `${assignment.exam.startTime} - ${assignment.exam.endTime}`
													: "N/A"}
											</td>
											<td>{assignment.classroom?.name || "N/A"}</td>
											<td>{formatStatus(assignment.status)}</td>
											<td>
												<div className="flex space-x-2">
													<button
														onClick={() => handleAssignmentClick(assignment)}
														className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
													>
														View
													</button>
													{assignment.status === "pending" && (
														<button
															onClick={() =>
																handleRespondAssignment(assignment)
															}
															className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
														>
															Respond
														</button>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{/* Pagination */}
							{pagination.totalPages > 1 && (
								<div className="mt-6">
									<Pagination
										currentPage={pagination.currentPage}
										totalPages={pagination.totalPages}
										onPageChange={handlePageChange}
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Assignment Details Modal */}
			{selectedAssignment && (
				<AssignmentDetailsModal
					isOpen={isDetailsModalOpen}
					onClose={() => setIsDetailsModalOpen(false)}
					assignment={selectedAssignment}
					invigilatorView={true}
					onRespond={handleRespondAssignment}
				/>
			)}

			{/* Assignment Response Modal */}
			{selectedAssignment && (
				<AssignmentResponseModal
					isOpen={isResponseModalOpen}
					onClose={() => setIsResponseModalOpen(false)}
					assignment={selectedAssignment}
					onSubmit={handleResponseSubmit}
				/>
			)}
		</div>
	);
};

export default MyAssignmentsPage;
