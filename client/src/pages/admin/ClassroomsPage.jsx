import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchClassrooms,
	createClassroom,
	updateClassroom,
	deleteClassroom,
	selectClassrooms,
	selectClassroomsPagination,
	selectClassroomsLoading,
} from "../../features/classrooms/classroomSlice";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import ClassroomFormModal from "../../components/classrooms/ClassroomFormModal";
import ClassroomDetailsModal from "../../components/classrooms/ClassroomDetailsModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ClassroomsPage = () => {
	const dispatch = useDispatch();
	const classrooms = useSelector(selectClassrooms);
	const pagination = useSelector(selectClassroomsPagination);
	const loading = useSelector(selectClassroomsLoading);

	const [selectedClassroom, setSelectedClassroom] = useState(null);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [filters, setFilters] = useState({
		search: "",
		isActive: "",
		page: 1,
	});

	useEffect(() => {
		dispatch(fetchClassrooms(filters));
	}, [dispatch, filters]);

	const handlePageChange = (page) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		const updatedFilters = {
			...filters,
			[name]: value,
			page: 1,
		};
		setFilters(updatedFilters);
		dispatch(fetchClassrooms(updatedFilters));
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		dispatch(fetchClassrooms(filters));
	};

	const handleClassroomClick = (classroom) => {
		setSelectedClassroom(classroom);
		setIsDetailsModalOpen(true);
	};

	const handleAddClassroom = () => {
		setIsEditMode(false);
		setSelectedClassroom(null);
		setIsFormModalOpen(true);
	};

	const handleEditClassroom = (classroom) => {
		setIsEditMode(true);
		setSelectedClassroom(classroom);
		setIsFormModalOpen(true);
		setIsDetailsModalOpen(false);
	};

	const handleDeleteClassroom = (classroom) => {
		setSelectedClassroom(classroom);
		setIsConfirmDeleteOpen(true);
		setIsDetailsModalOpen(false);
	};

	const confirmDelete = async () => {
		try {
			await dispatch(deleteClassroom(selectedClassroom.id));
			setIsConfirmDeleteOpen(false);
			dispatch(fetchClassrooms(filters));
		} catch (error) {
			// Error handling is done in the API service
			setIsConfirmDeleteOpen(false);
		}
	};

	const handleClassroomSave = async (classroomData) => {
		if (isEditMode) {
			await dispatch(
				updateClassroom({ id: selectedClassroom.id, classroomData })
			);
		} else {
			await dispatch(createClassroom(classroomData));
		}
		setIsFormModalOpen(false);
		dispatch(fetchClassrooms(filters));
	};

	return (
		<div>
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
						Classrooms
					</h1>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Manage classrooms for exam invigilation.
					</p>
				</div>
				<div className="mt-4 sm:mt-0">
					<button
						onClick={handleAddClassroom}
						className="btn btn-primary flex items-center"
					>
						<PlusIcon className="h-5 w-5 mr-2" />
						Add Classroom
					</button>
				</div>
			</div>

			{/* Search and filters */}
			<div className="card mb-6">
				<div className="card-body">
					<div className="flex justify-between items-center">
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
									placeholder="Search classrooms..."
								/>
							</div>
							<button type="submit" className="ml-3 btn btn-primary">
								Search
							</button>
						</form>

						<div className="ml-4">
							<select
								name="isActive"
								value={filters.isActive}
								onChange={handleFilterChange}
								className="form-input"
							>
								<option value="">All Status</option>
								<option value="true">Active</option>
								<option value="false">Inactive</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Classrooms table */}
			<div className="card">
				<div className="card-body">
					{loading ? (
						<LoadingSpinner />
					) : classrooms.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-500 dark:text-gray-400">
								No classrooms found.
							</p>
						</div>
					) : (
						<div className="table-container">
							<table className="table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Location</th>
										<th>Capacity</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{classrooms.map((classroom) => (
										<tr
											key={classroom.id}
											className="hover:bg-gray-50 dark:hover:bg-secondary-700"
										>
											<td>{classroom.name}</td>
											<td>{classroom.location}</td>
											<td>{classroom.capacity}</td>
											<td>
												<span
													className={`badge ${
														classroom.status === "active"
															? "badge-success"
															: "badge-danger"
													}`}
												>
													{classroom.status === "active"
														? "Active"
														: "Inactive"}
												</span>
											</td>
											<td>
												<button
													onClick={() => handleClassroomClick(classroom)}
													className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
												>
													View Details
												</button>
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

			{/* Classroom Details Modal */}
			{selectedClassroom && (
				<ClassroomDetailsModal
					isOpen={isDetailsModalOpen}
					onClose={() => setIsDetailsModalOpen(false)}
					classroom={selectedClassroom}
					onEdit={handleEditClassroom}
					onDelete={handleDeleteClassroom}
				/>
			)}

			{/* Classroom Form Modal */}
			<ClassroomFormModal
				isOpen={isFormModalOpen}
				onClose={() => setIsFormModalOpen(false)}
				onSave={handleClassroomSave}
				classroom={isEditMode ? selectedClassroom : null}
				isEditMode={isEditMode}
			/>

			{/* Confirmation Modal */}
			<ConfirmationModal
				isOpen={isConfirmDeleteOpen}
				onClose={() => setIsConfirmDeleteOpen(false)}
				onConfirm={confirmDelete}
				title="Delete Classroom"
				message={`Are you sure you want to delete the classroom "${selectedClassroom?.name}"? This action cannot be undone.`}
				confirmButtonText="Delete"
				confirmButtonClass="btn-danger"
			/>
		</div>
	);
};

export default ClassroomsPage;
