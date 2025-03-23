import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
	XMarkIcon,
	PencilIcon,
	TrashIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

const ExamDetailsModal = ({
	isOpen,
	onClose,
	exam,
	onEdit,
	onDelete,
	onStatusChange,
	readOnly = false,
}) => {
	if (!exam) return null;

	const statusOptions = [
		{ value: "scheduled", label: "Scheduled", color: "badge-info" },
		{ value: "ongoing", label: "Ongoing", color: "badge-warning" },
		{ value: "completed", label: "Completed", color: "badge-success" },
		{ value: "cancelled", label: "Cancelled", color: "badge-danger" },
	];

	const currentStatus = statusOptions.find(
		(option) => option.value === exam.status
	);

	const handleStatusChange = (e) => {
		onStatusChange(exam.id, e.target.value);
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-10 overflow-y-auto"
				onClose={onClose}
			>
				<div className="min-h-screen px-4 text-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className="inline-block h-screen align-middle"
						aria-hidden="true"
					>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 shadow-xl rounded-2xl">
							<div className="flex justify-between items-center">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
								>
									Exam Details
								</Dialog.Title>
								<button
									type="button"
									className="bg-white dark:bg-secondary-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
									onClick={onClose}
								>
									<span className="sr-only">Close</span>
									<XMarkIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>

							<div className="mt-4">
								<div className="flex justify-between items-start">
									<div>
										<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
											{exam.title}
										</h2>
										<div className="mt-1 flex items-center">
											<span className={`badge ${currentStatus.color}`}>
												{currentStatus.label}
											</span>
											<span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
												<ClockIcon className="inline-block h-4 w-4 mr-1" />
												{exam.duration} minutes
											</span>
										</div>
									</div>

									{!readOnly && (
										<div className="flex space-x-2">
											<button
												type="button"
												onClick={() => onEdit(exam)}
												className="p-1 rounded-full text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900"
											>
												<PencilIcon className="h-5 w-5" />
											</button>
											<button
												type="button"
												onClick={() => onDelete(exam)}
												className="p-1 rounded-full text-danger-600 hover:bg-danger-100 dark:hover:bg-danger-900"
											>
												<TrashIcon className="h-5 w-5" />
											</button>
										</div>
									)}
								</div>

								<div className="mt-4 grid grid-cols-1 gap-4">
									<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
										<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Description
										</h4>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{exam.description || "No description provided"}
										</p>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
												Date
											</h4>
											<p className="mt-1 text-sm text-gray-900 dark:text-white">
												{format(new Date(exam.date), "MMMM d, yyyy")}
											</p>
										</div>

										<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
												Start Time
											</h4>
											<p className="mt-1 text-sm text-gray-900 dark:text-white">
												{exam.startTime}
											</p>
										</div>

										<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
												End Time
											</h4>
											<p className="mt-1 text-sm text-gray-900 dark:text-white">
												{exam.endTime}
											</p>
										</div>
									</div>

									<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
										<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Created By
										</h4>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{exam.creator?.fullName || "Unknown"}
										</p>
									</div>

									<div className="mt-4">
										<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Classrooms
										</h4>
										{exam.classrooms && exam.classrooms.length > 0 ? (
											<div className="overflow-x-auto">
												<table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
													<thead className="bg-gray-50 dark:bg-secondary-700">
														<tr>
															<th
																scope="col"
																className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
															>
																Classroom
															</th>
															<th
																scope="col"
																className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
															>
																Location
															</th>
															<th
																scope="col"
																className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
															>
																Capacity
															</th>
															<th
																scope="col"
																className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
															>
																Invigilators Required
															</th>
														</tr>
													</thead>
													<tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-secondary-700">
														{exam.classrooms.map((classroom) => (
															<tr key={classroom.id}>
																<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
																	{classroom.name}
																</td>
																<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
																	{classroom.location}
																</td>
																<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
																	{classroom.capacity}
																</td>
																<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
																	{classroom.ExamClassroom
																		?.requiredInvigilators || 1}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										) : (
											<p className="text-sm text-gray-500 dark:text-gray-400">
												No classrooms assigned
											</p>
										)}
									</div>

									{!readOnly && (
										<div className="mt-4">
											<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Assigned Invigilators
											</h4>
											{exam.assignments && exam.assignments.length > 0 ? (
												<div className="overflow-x-auto">
													<table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
														<thead className="bg-gray-50 dark:bg-secondary-700">
															<tr>
																<th
																	scope="col"
																	className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
																>
																	Invigilator
																</th>
																<th
																	scope="col"
																	className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
																>
																	Classroom
																</th>
																<th
																	scope="col"
																	className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
																>
																	Status
																</th>
															</tr>
														</thead>
														<tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-secondary-700">
															{exam.assignments.map((assignment) => (
																<tr key={assignment.id}>
																	<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
																		{assignment.invigilator.fullName}
																	</td>
																	<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
																		{assignment.classroom.name}
																	</td>
																	<td className="px-3 py-2 whitespace-nowrap text-sm">
																		<span
																			className={`badge ${
																				assignment.status === "accepted"
																					? "badge-success"
																					: assignment.status === "rejected"
																					? "badge-danger"
																					: assignment.status === "completed"
																					? "badge-secondary"
																					: "badge-warning"
																			} capitalize`}
																		>
																			{assignment.status}
																		</span>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											) : (
												<p className="text-sm text-gray-500 dark:text-gray-400">
													No invigilators assigned
												</p>
											)}
										</div>
									)}

									{!readOnly && (
										<div className="mt-6 border-t border-gray-200 dark:border-secondary-700 pt-4">
											<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Change Exam Status
											</h4>
											<div className="mt-2 flex items-center">
												<select
													className="form-input mr-3"
													value={exam.status}
													onChange={handleStatusChange}
												>
													{statusOptions.map((option) => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</select>
											</div>
										</div>
									)}
								</div>

								<div className="mt-6 flex justify-end">
									<button
										type="button"
										className="btn btn-outline"
										onClick={onClose}
									>
										Close
									</button>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};

export default ExamDetailsModal;
