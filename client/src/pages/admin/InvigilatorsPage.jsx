import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUsers,
	updateUserStatus,
	selectUsers,
	selectUsersPagination,
	selectUsersLoading,
} from "../../features/users/userSlice";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import UserDetailsModal from "../../components/users/UserDetailsModal";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const InvigilatorsPage = () => {
	const dispatch = useDispatch();
	const users = useSelector(selectUsers);
	const pagination = useSelector(selectUsersPagination);
	const loading = useSelector(selectUsersLoading);

	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filters, setFilters] = useState({
		status: "",
		gender: "",
		search: "",
		role: "invigilator",
		page: 1,
		sortBy: "createdAt",
		sortOrder: "DESC",
	});
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchUsers(filters));
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
		dispatch(fetchUsers(filters));
	};

	const handleUserClick = (user) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleStatusChange = async (userId, status) => {
		await dispatch(updateUserStatus({ userId, status }));
		dispatch(fetchUsers(filters));
		setIsModalOpen(false);
	};

	return (
		<div>
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
						Invigilators
					</h1>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Manage and view all registered invigilators in the system.
					</p>
				</div>
				<div className="mt-4 sm:mt-0">
					<button
						onClick={() => setIsFilterOpen(!isFilterOpen)}
						className="btn btn-outline flex items-center"
					>
						<FunnelIcon className="h-5 w-5 mr-2" />
						Filters
					</button>
				</div>
			</div>

			{/* Search and filters */}
			<div className="card mb-6">
				<div className="card-body">
					<form onSubmit={handleSearchSubmit} className="mb-4">
						<div className="flex">
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
									placeholder="Search by name, username, or email..."
								/>
							</div>
							<button type="submit" className="ml-3 btn btn-primary">
								Search
							</button>
						</div>
					</form>

					{isFilterOpen && (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
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
									<option value="pending">Pending</option>
									<option value="approved">Approved</option>
									<option value="rejected">Rejected</option>
								</select>
							</div>
							<div>
								<label htmlFor="gender" className="form-label">
									Gender
								</label>
								<select
									id="gender"
									name="gender"
									value={filters.gender}
									onChange={handleFilterChange}
									className="form-input"
								>
									<option value="">All Genders</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="other">Other</option>
								</select>
							</div>
							<div>
								<label htmlFor="sortBy" className="form-label">
									Sort By
								</label>
								<select
									id="sortBy"
									name="sortBy"
									value={filters.sortBy}
									onChange={handleFilterChange}
									className="form-input"
								>
									<option value="createdAt">Registration Date</option>
									<option value="fullName">Name</option>
									<option value="address">Address</option>
									<option value="department">Department</option>
								</select>
							</div>
							<div>
								<label htmlFor="sortOrder" className="form-label">
									Sort Order
								</label>
								<select
									id="sortOrder"
									name="sortOrder"
									value={filters.sortOrder}
									onChange={handleFilterChange}
									className="form-input"
								>
									<option value="ASC">Ascending</option>
									<option value="DESC">Descending</option>
								</select>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Users table */}
			<div className="card">
				<div className="card-body">
					{loading ? (
						<LoadingSpinner />
					) : users.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-500 dark:text-gray-400">
								No invigilators found.
							</p>
						</div>
					) : (
						<div className="table-container">
							<table className="table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Username</th>
										<th>Email</th>
										<th>Department</th>
										<th>Address</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr
											key={user.id}
											className="hover:bg-gray-50 dark:hover:bg-secondary-700"
										>
											<td>{user.fullName}</td>
											<td>{user.username}</td>
											<td>{user.email}</td>
											<td>{user.department}</td>
											<td>{user.address || "Not specified"}</td>
											<td>
												<span
													className={`badge ${
														user.status === "approved"
															? "badge-success"
															: user.status === "rejected"
															? "badge-danger"
															: "badge-warning"
													} capitalize`}
												>
													{user.status}
												</span>
											</td>
											<td>
												<button
													onClick={() => handleUserClick(user)}
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

			{/* User Details Modal */}
			{selectedUser && (
				<UserDetailsModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					user={selectedUser}
					onStatusChange={handleStatusChange}
				/>
			)}
		</div>
	);
};

export default InvigilatorsPage;
