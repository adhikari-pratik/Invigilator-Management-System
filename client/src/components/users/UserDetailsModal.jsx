import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

const UserDetailsModal = ({ isOpen, onClose, user, onStatusChange }) => {
	const [status, setStatus] = useState(user?.status || "pending");

	const handleStatusChange = () => {
		onStatusChange(user.id, status);
	};

	if (!user) return null;

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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-secondary-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div className="absolute right-0 top-0 pr-4 pt-4">
									<button
										type="button"
										className="rounded-md bg-white dark:bg-secondary-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
										onClick={onClose}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>
								<div>
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
									>
										Invigilator Details
									</Dialog.Title>
									<div className="mt-4">
										<div className="grid grid-cols-1 gap-4">
											<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
												<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Full Name
												</h4>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{user.fullName}
												</p>
											</div>

											<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
												<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Username
												</h4>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{user.username}
												</p>
											</div>

											<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
												<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Email
												</h4>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{user.email}
												</p>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
													<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
														Department
													</h4>
													<p className="mt-1 text-sm text-gray-900 dark:text-white">
														{user.department || "Not specified"}
													</p>
												</div>

												<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
													<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
														Gender
													</h4>
													<p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
														{user.gender || "Not specified"}
													</p>
												</div>
											</div>

											<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
												<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Phone Number
												</h4>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{user.phoneNumber || "Not specified"}
												</p>
											</div>

											<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
												<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Address
												</h4>
												<p className="mt-1 text-sm text-gray-900 dark:text-white">
													{user.address || "Not specified"}
												</p>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
													<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
														Registered On
													</h4>
													<p className="mt-1 text-sm text-gray-900 dark:text-white">
														{format(new Date(user.createdAt), "MMM d, yyyy")}
													</p>
												</div>

												<div className="border-b border-gray-200 dark:border-secondary-700 pb-4">
													<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
														Account Status
													</h4>
													<div className="mt-1">
														<span
															className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
																user.status === "approved"
																	? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
																	: user.status === "rejected"
																	? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
																	: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
															}`}
														>
															{user.status}
														</span>
													</div>
												</div>
											</div>

											{user.role === "invigilator" && (
												<>
													<div className="grid grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
																Distance from Patan Dhoka
															</label>
															<p className="mt-1 text-sm text-gray-900 dark:text-white">
																{user.distance_from_patandhoka
																	? `${user.distance_from_patandhoka} km`
																	: "Not specified"}
															</p>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
																Designation
															</label>
															<p className="mt-1 text-sm text-gray-900 dark:text-white">
																{user.designation || "Not specified"}
															</p>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
																Experience
															</label>
															<p className="mt-1 text-sm text-gray-900 dark:text-white">
																{user.experience_years
																	? `${user.experience_years} years`
																	: "Not specified"}
															</p>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
																Specialization
															</label>
															<p className="mt-1 text-sm text-gray-900 dark:text-white">
																{user.specialization || "Not specified"}
															</p>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
																Max Duties per Day
															</label>
															<p className="mt-1 text-sm text-gray-900 dark:text-white">
																{user.max_duties_per_day || "Not specified"}
															</p>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
																Max Duties per Week
															</label>
															<p className="mt-1 text-sm text-gray-900 dark:text-white">
																{user.max_duties_per_week || "Not specified"}
															</p>
														</div>
													</div>
												</>
											)}
										</div>

										<div className="mt-6">
											<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
												Change Status
											</h4>
											<div className="mt-2 flex items-center">
												<select
													value={status}
													onChange={(e) => setStatus(e.target.value)}
													className="form-input mr-3"
												>
													<option value="pending">Pending</option>
													<option value="approved">Approved</option>
													<option value="rejected">Rejected</option>
												</select>
												<button
													type="button"
													onClick={handleStatusChange}
													className="btn btn-primary"
													disabled={status === user.status}
												>
													Update Status
												</button>
											</div>
										</div>
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

export default UserDetailsModal;
