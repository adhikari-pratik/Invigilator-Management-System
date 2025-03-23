import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
	fetchExams,
	createExam,
	updateExam,
	deleteExam,
	updateExamStatus,
	selectExams,
	selectExamsPagination,
	selectExamsLoading,
} from "../../features/exams/examSlice";
import {
	MagnifyingGlassIcon,
	FunnelIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import ExamFormModal from "../../components/exams/ExamFormModal";
import ExamDetailsModal from "../../components/exams/ExamDetailsModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ExamsPage = ({ readOnly = false }) => {
	const dispatch = useDispatch();
	const exams = useSelector(selectExams);
	const pagination = useSelector(selectExamsPagination);
	const loading = useSelector(selectExamsLoading);

	const [selectedExam, setSelectedExam] = useState(null);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [filters, setFilters] = useState({
		status: "",
		date: "",
		search: "",
		page: 1,
	});
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchExams(filters));
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

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		dispatch(fetchExams(filters));
	};

	const handleExamClick = (exam) => {
		setSelectedExam(exam);
		setIsDetailsModalOpen(true);
	};

	const handleAddExam = () => {
		setIsEditMode(false);
		setSelectedExam(null);
		setIsFormModalOpen(true);
	};

	const handleEditExam = (exam) => {
		setIsEditMode(true);
		setSelectedExam(exam);
		setIsFormModalOpen(true);
		setIsDetailsModalOpen(false);
	};

	const handleDeleteExam = (exam) => {
		setSelectedExam(exam);
		setIsConfirmDeleteOpen(true);
		setIsDetailsModalOpen(false);
	};

	const confirmDelete = async () => {
		await dispatch(deleteExam(selectedExam.id));
		setIsConfirmDeleteOpen(false);
		dispatch(fetchExams(filters));
	};

	const handleExamSave = async (examData) => {
		if (isEditMode) {
			await dispatch(updateExam({ id: selectedExam.id, examData }));
		} else {
			await dispatch(createExam(examData));
		}
		setIsFormModalOpen(false);
		dispatch(fetchExams(filters));
	};

	const handleStatusChange = async (examId, status) => {
		await dispatch(updateExamStatus({ examId, status }));
		dispatch(fetchExams(filters));
		setIsDetailsModalOpen(false);
	};

	const formatStatus = (status) => {
		switch (status) {
			case "scheduled":
				return <span className="badge badge-info">Scheduled</span>;
			case "ongoing":
				return <span className="badge badge-warning">Ongoing</span>;
			case "completed":
				return <span className="badge badge-success">Completed</span>;
			case "cancelled":
				return <span className="badge badge-danger">Cancelled</span>;
			default:
				return <span className="badge badge-secondary">{status}</span>;
		}
	};

	return (
		<div>
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
						Exams
					</h1>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						{readOnly
							? "View all scheduled exams."
							: "Manage and schedule exams in the system."}
					</p>
				</div>
				{!readOnly && (
					<div className="mt-4 sm:mt-0">
						<button
							onClick={handleAddExam}
							className="btn btn-primary flex items-center"
						>
							<PlusIcon className="h-5 w-5 mr-2" />
							Add Exam
						</button>
					</div>
				)}
			</div>

			{/* Search and filters */}
			<div className="card mb-6">
				<div className="card-body">
					<div className="flex justify-between items-center mb-4">
						<form onSubmit={handleSearchSubmit} className="flex flex-grow">
							<div className="relative flex-grow">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="text"
									name="search"
									value={filters.search}
									onChange={handleFilterChange}
									className="form-input pl-10 w-full"
									placeholder="Search exams..."
								/>
							</div>
							<button type="submit" className="ml-3 btn btn-primary">
								Search
							</button>
						</form>

						<button
							onClick={() => setIsFilterOpen(!isFilterOpen)}
							className="btn btn-outline flex items-center ml-3"
						>
							<FunnelIcon className="h-5 w-5 mr-2" />
							Filters
						</button>
					</div>

					{isFilterOpen && (
						<div className="grid gap-4 sm:grid-cols-2 mt-4">
							<div>
								<label htmlFor="status" className="form-label">
									Status
								</label>
								<select
									id="status"
									name="status"
									value={filters.status}
									onChange={handleFilterChange}
									className="form-input"
								>
									<option value="">All Statuses</option>
									<option value="scheduled">Scheduled</option>
									<option value="ongoing">Ongoing</option>
									<option value="completed">Completed</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</div>
							<div>
								<label htmlFor="date" className="form-label">
									Date
								</label>
								<input
									type="date"
									id="date"
									name="date"
									value={filters.date}
									onChange={handleFilterChange}
									className="form-input"
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Exams table */}
			<div className="card">
				<div className="card-body">
					{loading ? (
						<LoadingSpinner />
					) : exams.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-500 dark:text-gray-400">
								No exams found.
							</p>
						</div>
					) : (
						<div className="table-container">
							<table className="table">
								<thead>
									<tr>
										<th>Title</th>
										<th>Date</th>
										<th>Time</th>
										<th>Status</th>
										<th>Classrooms</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{exams.map((exam) => (
										<tr
											key={exam.id}
											className="cursor-pointer hover:bg-gray-50 dark:hover:bg-secondary-700"
											onClick={() => handleExamClick(exam)}
										>
											<td>{exam.title}</td>
											<td>{format(new Date(exam.date), "PPP")}</td>
											<td>
												{format(new Date(`2000-01-01T${exam.startTime}`), "p")}{" "}
												- {format(new Date(`2000-01-01T${exam.endTime}`), "p")}
											</td>
											<td>{formatStatus(exam.status)}</td>
											<td>{exam.classrooms?.map((c) => c.name).join(", ")}</td>
											<td>
												<div className="flex space-x-2">
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleEditExam(exam);
														}}
														className="btn btn-sm btn-outline"
													>
														Edit
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteExam(exam);
														}}
														className="btn btn-sm btn-danger"
													>
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{/* Exams Details Modal */}
			{selectedExam && (
				<ExamDetailsModal
					isOpen={isDetailsModalOpen}
					onClose={() => setIsDetailsModalOpen(false)}
					exam={selectedExam}
					onEdit={handleEditExam}
					onDelete={handleDeleteExam}
					onStatusChange={handleStatusChange}
				/>
			)}

			{/* Exam Form Modal */}
			{!readOnly && (
				<ExamFormModal
					isOpen={isFormModalOpen}
					onClose={() => setIsFormModalOpen(false)}
					onSave={handleExamSave}
					exam={selectedExam}
					isEditMode={isEditMode}
				/>
			)}

			{/* Confirmation Modal */}
			<ConfirmationModal
				isOpen={isConfirmDeleteOpen}
				onClose={() => setIsConfirmDeleteOpen(false)}
				onConfirm={confirmDelete}
				title="Delete Exam"
				message="Are you sure you want to delete this exam? This action cannot be undone."
			/>

			{/* Pagination */}
			{pagination && (
				<div className="mt-4">
					<Pagination
						currentPage={pagination.currentPage}
						totalPages={pagination.totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};

export default ExamsPage;
