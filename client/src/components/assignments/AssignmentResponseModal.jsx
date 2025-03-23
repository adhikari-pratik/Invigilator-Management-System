import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const responseSchema = Yup.object().shape({
	status: Yup.string()
		.oneOf(["accepted", "rejected"], "Please select a response")
		.required("Please select a response"),
	responseNote: Yup.string().when("status", (status, schema) => {
		return status === "rejected"
			? schema.required("Please provide a reason for rejection")
			: schema;
	}),
});

const AssignmentResponseModal = ({ isOpen, onClose, assignment, onSubmit }) => {
	if (!assignment) return null;

	const initialValues = {
		status: "",
		responseNote: "",
	};

	const handleSubmit = (values) => {
		onSubmit(values.status, values.responseNote);
		onClose();
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="mx-auto max-w-lg rounded bg-white dark:bg-secondary-800 p-6">
					<div className="flex justify-between items-center mb-4">
						<Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
							Respond to Assignment
						</Dialog.Title>
						<button
							type="button"
							className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
							onClick={onClose}
						>
							<span className="sr-only">Close</span>
							<XMarkIcon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>

					<div className="mt-4">
						<div className="mb-4">
							<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Exam: {assignment.exam?.title || "N/A"}
							</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Classroom: {assignment.classroom?.name || "N/A"} (
								{assignment.classroom?.location || "N/A"})
							</p>
						</div>

						<Formik
							initialValues={initialValues}
							validationSchema={responseSchema}
							onSubmit={handleSubmit}
						>
							{({ values, isSubmitting, errors, touched }) => (
								<Form className="space-y-4">
									<div>
										<label className="form-label">Your Response</label>
										<div className="mt-2 grid grid-cols-2 gap-3">
											<label
												className={`
													flex items-center justify-center p-3 border rounded-md cursor-pointer
													${
														values.status === "accepted"
															? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200"
															: "border-gray-200 dark:border-secondary-700"
													}
												`}
											>
												<Field
													type="radio"
													name="status"
													value="accepted"
													className="sr-only"
												/>
												<CheckIcon
													className={`h-5 w-5 mr-2 ${
														values.status === "accepted"
															? "text-green-500"
															: "text-gray-400"
													}`}
												/>
												<span>Accept</span>
											</label>
											<label
												className={`
													flex items-center justify-center p-3 border rounded-md cursor-pointer
													${
														values.status === "rejected"
															? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200"
															: "border-gray-200 dark:border-secondary-700"
													}
												`}
											>
												<Field
													type="radio"
													name="status"
													value="rejected"
													className="sr-only"
												/>
												<XCircleIcon
													className={`h-5 w-5 mr-2 ${
														values.status === "rejected"
															? "text-red-500"
															: "text-gray-400"
													}`}
												/>
												<span>Decline</span>
											</label>
										</div>
										<ErrorMessage
											name="status"
											component="div"
											className="form-error mt-2"
										/>
									</div>

									<div>
										<label htmlFor="responseNote" className="form-label">
											Notes{" "}
											{values.status === "rejected" && (
												<span className="text-red-500">*</span>
											)}
										</label>
										<Field
											as="textarea"
											id="responseNote"
											name="responseNote"
											rows={3}
											className="form-input"
											placeholder={
												values.status === "rejected"
													? "Please provide a reason for declining this assignment"
													: "Add any additional notes or comments (optional)"
											}
										/>
										<ErrorMessage
											name="responseNote"
											component="div"
											className="form-error"
										/>
									</div>

									<div className="mt-6 flex justify-end space-x-3">
										<button
											type="button"
											className="btn btn-outline"
											onClick={onClose}
										>
											Cancel
										</button>
										<button
											type="submit"
											className={`btn ${
												values.status === "accepted"
													? "btn-success"
													: values.status === "rejected"
													? "btn-danger"
													: "btn-primary"
											}`}
											disabled={isSubmitting || Object.keys(errors).length > 0}
										>
											{isSubmitting
												? "Submitting..."
												: values.status === "accepted"
												? "Accept Assignment"
												: values.status === "rejected"
												? "Decline Assignment"
												: "Submit Response"}
										</button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
};

export default AssignmentResponseModal;
