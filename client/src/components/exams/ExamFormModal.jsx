import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
	Formik,
	Form,
	Field,
	ErrorMessage,
	FieldArray,
	useFormikContext,
} from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchActiveClassrooms,
	selectActiveClassrooms,
} from "../../features/classrooms/classroomSlice";

const examSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	description: Yup.string(),
	date: Yup.date().required("Date is required"),
	startTime: Yup.string().required("Start time is required"),
	endTime: Yup.string()
		.required("End time is required")
		.test(
			"is-greater",
			"End time must be greater than start time",
			function (value) {
				const { startTime } = this.parent;
				if (!startTime || !value) return true;
				return value > startTime;
			}
		),
	duration: Yup.number()
		.required("Duration is required")
		.positive("Duration must be positive"),
	status: Yup.string()
		.oneOf(["scheduled", "ongoing", "completed", "cancelled"], "Invalid status")
		.required("Status is required"),
	classrooms: Yup.array().of(
		Yup.object().shape({
			classroomId: Yup.string().required("Classroom is required"),
			requiredInvigilators: Yup.number()
				.required("Required number of invigilators is required")
				.min(1, "At least one invigilator is required")
				.integer("Number of invigilators must be a whole number"),
			notes: Yup.string(),
		})
	),
});

const TimeFields = () => {
	const { setFieldValue, values } = useFormikContext();

	const calculateDuration = (startTime, endTime) => {
		if (!startTime || !endTime) return 0;

		const [startHours, startMinutes] = startTime.split(":").map(Number);
		const [endHours, endMinutes] = endTime.split(":").map(Number);

		const startDate = new Date(2000, 0, 1, startHours, startMinutes);
		const endDate = new Date(2000, 0, 1, endHours, endMinutes);

		// Handle case where end time is on the next day
		if (endDate < startDate) {
			endDate.setDate(endDate.getDate() + 1);
		}

		const diffInMinutes = Math.round((endDate - startDate) / (1000 * 60));
		return diffInMinutes;
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div>
				<label htmlFor="startTime" className="form-label">
					Start Time
				</label>
				<Field
					type="time"
					id="startTime"
					name="startTime"
					className="form-input"
					onChange={(e) => {
						setFieldValue("startTime", e.target.value);
						if (values.endTime) {
							setFieldValue(
								"duration",
								calculateDuration(e.target.value, values.endTime)
							);
						}
					}}
				/>
				<ErrorMessage name="startTime" component="div" className="form-error" />
			</div>

			<div>
				<label htmlFor="endTime" className="form-label">
					End Time
				</label>
				<Field
					type="time"
					id="endTime"
					name="endTime"
					className="form-input"
					onChange={(e) => {
						setFieldValue("endTime", e.target.value);
						if (values.startTime) {
							setFieldValue(
								"duration",
								calculateDuration(values.startTime, e.target.value)
							);
						}
					}}
				/>
				<ErrorMessage name="endTime" component="div" className="form-error" />
			</div>

			<div>
				<label htmlFor="duration" className="form-label">
					Duration (minutes)
				</label>
				<Field
					type="number"
					id="duration"
					name="duration"
					className="form-input"
					readOnly
				/>
				<ErrorMessage name="duration" component="div" className="form-error" />
			</div>
		</div>
	);
};

const ExamFormModal = ({
	isOpen,
	onClose,
	onSave,
	exam,
	isEditMode = false,
}) => {
	const dispatch = useDispatch();
	const activeClassrooms = useSelector(selectActiveClassrooms);

	useEffect(() => {
		dispatch(fetchActiveClassrooms());
	}, [dispatch]);

	const initialValues = {
		title: exam?.title || "",
		description: exam?.description || "",
		date: exam?.date || "",
		startTime: exam?.startTime || "",
		endTime: exam?.endTime || "",
		duration: exam?.duration || 120,
		status: exam?.status || "scheduled",
		classrooms: exam?.classrooms
			? exam.classrooms.map((classroom) => ({
					classroomId: classroom.id,
					requiredInvigilators:
						classroom.ExamClassroom?.requiredInvigilators || 1,
					notes: classroom.ExamClassroom?.notes || "",
			  }))
			: [{ classroomId: "", requiredInvigilators: 1, notes: "" }],
	};

	const handleSubmit = (values) => {
		onSave(values);
	};

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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-secondary-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
								<div className="flex justify-between items-center">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
									>
										{isEditMode ? "Edit Exam" : "Create New Exam"}
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
									<Formik
										initialValues={initialValues}
										validationSchema={examSchema}
										onSubmit={handleSubmit}
									>
										{({ values, isSubmitting, errors, touched }) => (
											<Form className="space-y-4">
												<div>
													<label htmlFor="title" className="form-label">
														Exam Title
													</label>
													<Field
														type="text"
														id="title"
														name="title"
														className="form-input"
													/>
													<ErrorMessage
														name="title"
														component="div"
														className="form-error"
													/>
												</div>

												<div>
													<label htmlFor="description" className="form-label">
														Description
													</label>
													<Field
														as="textarea"
														id="description"
														name="description"
														rows={3}
														className="form-input"
													/>
													<ErrorMessage
														name="description"
														component="div"
														className="form-error"
													/>
												</div>

												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<div>
														<label htmlFor="date" className="form-label">
															Date
														</label>
														<Field
															type="date"
															id="date"
															name="date"
															className="form-input"
														/>
														<ErrorMessage
															name="date"
															component="div"
															className="form-error"
														/>
													</div>

													<div>
														<label htmlFor="status" className="form-label">
															Status
														</label>
														<Field
															as="select"
															id="status"
															name="status"
															className="form-input"
														>
															<option value="scheduled">Scheduled</option>
															<option value="ongoing">Ongoing</option>
															<option value="completed">Completed</option>
															<option value="cancelled">Cancelled</option>
														</Field>
														<ErrorMessage
															name="status"
															component="div"
															className="form-error"
														/>
													</div>
												</div>

												<TimeFields />

												<div>
													<label className="form-label">Classrooms</label>
													<FieldArray name="classrooms">
														{({ push, remove }) => (
															<div className="space-y-4">
																{values.classrooms.map((_, index) => (
																	<div
																		key={index}
																		className="flex items-start space-x-4"
																	>
																		<div className="flex-grow">
																			<Field
																				as="select"
																				name={`classrooms.${index}.classroomId`}
																				className="form-input"
																			>
																				<option value="">
																					Select a classroom
																				</option>
																				{activeClassrooms.map((classroom) => (
																					<option
																						key={classroom.id}
																						value={classroom.id}
																					>
																						{classroom.name}
																					</option>
																				))}
																			</Field>
																			<ErrorMessage
																				name={`classrooms.${index}.classroomId`}
																				component="div"
																				className="form-error"
																			/>
																		</div>
																		<div className="w-32">
																			<Field
																				type="number"
																				name={`classrooms.${index}.requiredInvigilators`}
																				className="form-input"
																				min="1"
																			/>
																			<ErrorMessage
																				name={`classrooms.${index}.requiredInvigilators`}
																				component="div"
																				className="form-error"
																			/>
																		</div>
																		<div className="flex-shrink-0">
																			<button
																				type="button"
																				onClick={() => remove(index)}
																				className="btn btn-danger btn-sm"
																			>
																				<TrashIcon className="h-5 w-5" />
																			</button>
																		</div>
																	</div>
																))}
																<button
																	type="button"
																	onClick={() =>
																		push({
																			classroomId: "",
																			requiredInvigilators: 1,
																			notes: "",
																		})
																	}
																	className="btn btn-outline btn-sm flex items-center"
																>
																	<PlusIcon className="h-5 w-5 mr-2" />
																	Add Classroom
																</button>
															</div>
														)}
													</FieldArray>
												</div>

												<div className="mt-5 sm:mt-6">
													<button
														type="submit"
														disabled={isSubmitting}
														className="btn btn-primary w-full"
													>
														{isSubmitting ? "Saving..." : "Save Exam"}
													</button>
												</div>
											</Form>
										)}
									</Formik>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default ExamFormModal;
