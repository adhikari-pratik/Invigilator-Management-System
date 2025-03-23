import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

const ClassroomDetailsModal = ({
	isOpen,
	onClose,
	classroom,
	onEdit,
	onDelete,
}) => {
	if (!classroom) return null;

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-secondary-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
								<div className="flex justify-between items-center">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
									>
										Classroom Details
									</Dialog.Title>
									<div className="flex space-x-2">
										<button
											type="button"
											onClick={() => onEdit(classroom)}
											className="bg-white dark:bg-secondary-800 rounded-md text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 focus:outline-none"
										>
											<span className="sr-only">Edit</span>
											<PencilIcon className="h-5 w-5" aria-hidden="true" />
										</button>
										<button
											type="button"
											onClick={() => onDelete(classroom)}
											className="bg-white dark:bg-secondary-800 rounded-md text-red-500 hover:text-red-600 dark:hover:text-red-400 focus:outline-none"
										>
											<span className="sr-only">Delete</span>
											<TrashIcon className="h-5 w-5" aria-hidden="true" />
										</button>
										<button
											type="button"
											className="bg-white dark:bg-secondary-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
											onClick={onClose}
										>
											<span className="sr-only">Close</span>
											<XMarkIcon className="h-5 w-5" aria-hidden="true" />
										</button>
									</div>
								</div>

								<div className="mt-4">
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
												{classroom.name}
											</h2>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													classroom.isActive
														? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
														: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
												}`}
											>
												{classroom.isActive ? "Active" : "Inactive"}
											</span>
										</div>

										<div>
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
												Location
											</h4>
											<p className="mt-1 text-sm text-gray-900 dark:text-white">
												{classroom.location}
											</p>
										</div>

										<div>
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
												Capacity
											</h4>
											<p className="mt-1 text-sm text-gray-900 dark:text-white">
												{classroom.capacity} students
											</p>
										</div>

										<div>
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
												Description
											</h4>
											<p className="mt-1 text-sm text-gray-900 dark:text-white">
												{classroom.description || "No description provided"}
											</p>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div>
												<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Created At
												</h4>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{format(new Date(classroom.createdAt), "MMM d, yyyy")}
												</p>
											</div>
											<div>
												<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Last Updated
												</h4>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{format(new Date(classroom.updatedAt), "MMM d, yyyy")}
												</p>
											</div>
										</div>
									</div>

									<div className="mt-5 sm:mt-6">
										<button
											type="button"
											className="btn btn-outline w-full"
											onClick={onClose}
										>
											Close
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default ClassroomDetailsModal;
