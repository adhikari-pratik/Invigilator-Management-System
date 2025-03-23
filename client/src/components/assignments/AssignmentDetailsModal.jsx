import React from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
// import ConfirmationModal from './common/ConfirmationModal';

const AssignmentDetailsModal = ({
	isOpen,
	onClose,
	assignment,
	onDelete,
	onRespond,
	invigilatorView = false,
}) => {
	if (!assignment) return null;

	// Format status badge
	const getStatusBadge = (status) => {
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
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="mx-auto max-w-2xl rounded bg-white dark:bg-secondary-800 p-6">
					<div className="flex justify-between items-center">
						<Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
							Assignment Details
						</Dialog.Title>
						<div className="flex items-center">
							{!invigilatorView && (
								<button
									type="button"
									onClick={() => onDelete(assignment)}
									className="rounded-md text-red-400 hover:text-red-500 dark:hover:text-red-300 focus:outline-none mr-2"
								>
									<span className="sr-only">Delete</span>
									<TrashIcon className="h-5 w-5" aria-hidden="true" />
								</button>
							)}
							<button
								type="button"
								className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
								onClick={onClose}
							>
								<span className="sr-only">Close</span>
								<XMarkIcon className="h-5 w-5" aria-hidden="true" />
							</button>
						</div>
					</div>

					<div className="mt-4">
						<div className="space-y-6">
							<div>
								<h4 className="text-base font-medium text-gray-900 dark:text-white">
									Exam Information
								</h4>
								<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Title
										</h5>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{assignment.exam?.title || "N/A"}
										</p>
									</div>
									<div>
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Status
										</h5>
										<div className="mt-1">
											{getStatusBadge(assignment.status)}
										</div>
									</div>
									<div>
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Date
										</h5>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{assignment.exam?.date
												? format(new Date(assignment.exam.date), "MMMM d, yyyy")
												: "N/A"}
										</p>
									</div>
									<div>
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Time
										</h5>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{assignment.exam?.startTime &&
											assignment.exam?.endTime ? (
												<>
													{assignment.exam.startTime} -{" "}
													{assignment.exam.endTime} ({assignment.exam.duration}{" "}
													minutes)
												</>
											) : (
												"N/A"
											)}
										</p>
									</div>
									<div>
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Classroom
										</h5>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{assignment.classroom?.name ? (
												<>
													{assignment.classroom.name} (
													{assignment.classroom.location})
												</>
											) : (
												"N/A"
											)}
										</p>
									</div>
									<div>
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Capacity
										</h5>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{assignment.classroom?.capacity
												? `${assignment.classroom.capacity} students`
												: "N/A"}
										</p>
									</div>
								</div>
								<div className="mt-4">
									<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Description
									</h5>
									<p className="mt-1 text-sm text-gray-900 dark:text-white">
										{assignment.exam?.description || "No description provided"}
									</p>
								</div>
							</div>

							<div className="border-t border-gray-200 dark:border-secondary-700 pt-4">
								{invigilatorView ? (
									<h4 className="text-base font-medium text-gray-900 dark:text-white">
										Assignment Notes
									</h4>
								) : (
									<h4 className="text-base font-medium text-gray-900 dark:text-white">
										Invigilator Information
									</h4>
								)}

								<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
									{!invigilatorView && (
										<>
											<div>
												<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Name
												</h5>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{assignment.invigilator?.fullName || "N/A"}
												</p>
											</div>
											<div>
												<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Email
												</h5>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{assignment.invigilator?.email || "N/A"}
												</p>
											</div>
											<div>
												<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Phone
												</h5>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{assignment.invigilator?.phoneNumber ||
														"Not provided"}
												</p>
											</div>
											<div>
												<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Department
												</h5>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{assignment.invigilator?.department ||
														"Not specified"}
												</p>
											</div>
										</>
									)}
									<div className={invigilatorView ? "sm:col-span-2" : ""}>
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Assignment Notes
										</h5>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{assignment.notes || "No notes provided"}
										</p>
									</div>
								</div>
							</div>

							{assignment.responseNote && (
								<div className="border-t border-gray-200 dark:border-secondary-700 pt-4">
									<h4 className="text-base font-medium text-gray-900 dark:text-white">
										Response
									</h4>
									<div className="mt-2">
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Invigilator's Note
										</h5>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{assignment.responseNote}
										</p>
									</div>
									<div className="mt-2">
										<h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Response Time
										</h5>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{assignment.responseTime
												? format(
														new Date(assignment.responseTime),
														"MMMM d, yyyy 'at' h:mm a"
												  )
												: "Not provided"}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="mt-6 flex justify-end space-x-3">
						{invigilatorView && assignment.status === "pending" && (
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => {
									onRespond(assignment);
									onClose();
								}}
							>
								Respond to Assignment
							</button>
						)}
						<button type="button" className="btn btn-outline" onClick={onClose}>
							Close
						</button>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
};

export default AssignmentDetailsModal;
