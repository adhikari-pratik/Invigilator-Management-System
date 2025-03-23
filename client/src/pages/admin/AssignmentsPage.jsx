import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
	fetchAssignments,
	createAssignment,
	deleteAssignment,
	selectAssignments,
	selectAssignmentsPagination,
	selectAssignmentsLoading,
	selectAssignmentsError,
} from "../../features/assignments/assignmentSlice";
import {
	MagnifyingGlassIcon,
	FunnelIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import AssignmentFormModal from "../../components/assignments/AssignmentFormModal";
import AssignmentDetailsModal from "../../components/assignments/AssignmentDetailsModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";

const AssignmentsPage = () => {
	const dispatch = useDispatch();
	const assignments = useSelector(selectAssignments);
	const pagination = useSelector(selectAssignmentsPagination);
	const loading = useSelector(selectAssignmentsLoading);
	const error = useSelector(selectAssignmentsError);

	const [selectedAssignment, setSelectedAssignment] = useState(null);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [filters, setFilters] = useState({
		status: "pending,accepted",
		page: 1,
		limit: 10,
		search: "",
	});
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchAssignments(filters));
	}, [dispatch, filters]);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
			page: 1,
		}));
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setFilters((prev) => ({
			...prev,
			search: e.target.search.value,
			page: 1,
		}));
	};

	const handlePageChange = (page) => {
		setFilters((prev) => ({
			...prev,
			page,
		}));
	};

	const handleAssignmentClick = (assignment) => {
		setSelectedAssignment(assignment);
		setIsDetailsModalOpen(true);
	};

	const handleAddAssignment = () => {
		setIsFormModalOpen(true);
	};

	const handleDelete = async (assignment) => {
		try {
			await dispatch(deleteAssignment(assignment.id)).unwrap();
			toast.success("Assignment deleted successfully");
			setIsDeleteModalOpen(false);
		} catch (error) {
			toast.error(error.message || "Failed to delete assignment");
		}
	};

	const handleAssignmentSave = async (assignmentData) => {
		await dispatch(createAssignment(assignmentData));
		setIsFormModalOpen(false);
		dispatch(fetchAssignments(filters));
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		toast.error(error);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Assignments
				</h1>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => setIsFormModalOpen(true)}
				>
					Create Assignment
				</button>
			</div>

			<div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6 mb-6">
				<form onSubmit={handleSearch} className="flex gap-4">
					<div className="flex-1">
						<input
							type="text"
							name="search"
							placeholder="Search by invigilator name or exam title..."
							className="form-input w-full"
							defaultValue={filters.search}
						/>
					</div>
					<button type="submit" className="btn btn-primary">
						Search
					</button>
				</form>
			</div>

			<div className="bg-white dark:bg-secondary-800 rounded-lg shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
						<thead className="bg-gray-50 dark:bg-secondary-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Exam
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Invigilator
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Classroom
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Date
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-secondary-700">
							{assignments.map((assignment) => (
								<tr key={assignment.id}>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{assignment.exam?.title || "N/A"}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{assignment.exam?.startTime} - {assignment.exam?.endTime}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900 dark:text-white">
											{assignment.invigilator?.fullName || "N/A"}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{assignment.invigilator?.email || "N/A"}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900 dark:text-white">
											{assignment.classroom?.name || "N/A"}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{assignment.classroom?.location || "N/A"}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900 dark:text-white">
											{assignment.exam?.date
												? format(new Date(assignment.exam.date), "MMMM d, yyyy")
												: "N/A"}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												assignment.status === "pending"
													? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
													: assignment.status === "accepted"
													? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
													: assignment.status === "rejected"
													? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
													: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
											}`}
										>
											{assignment.status.charAt(0).toUpperCase() +
												assignment.status.slice(1)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											type="button"
											className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
											onClick={() => {
												setSelectedAssignment(assignment);
												setIsDetailsModalOpen(true);
											}}
										>
											View
										</button>
										<button
											type="button"
											className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
											onClick={() => {
												setSelectedAssignment(assignment);
												setIsDeleteModalOpen(true);
											}}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{assignments.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500 dark:text-gray-400">
						No assignments found
					</p>
				</div>
			)}

			{assignments.length > 0 && (
				<div className="mt-4 flex justify-center">
					<Pagination
						currentPage={pagination.currentPage}
						totalPages={pagination.totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			)}

			{/* Modals */}
			<AssignmentDetailsModal
				isOpen={isDetailsModalOpen}
				onClose={() => setIsDetailsModalOpen(false)}
				assignment={selectedAssignment}
				onDelete={() => {
					setIsDetailsModalOpen(false);
					setIsDeleteModalOpen(true);
				}}
			/>

			<AssignmentFormModal
				isOpen={isFormModalOpen}
				onClose={() => setIsFormModalOpen(false)}
				onSave={handleAssignmentSave}
			/>

			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={() => handleDelete(selectedAssignment)}
				title="Delete Assignment"
				message="Are you sure you want to delete this assignment? This action cannot be undone."
			/>
		</div>
	);
};

export default AssignmentsPage;
