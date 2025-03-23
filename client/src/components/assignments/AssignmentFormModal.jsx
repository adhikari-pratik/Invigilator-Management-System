import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchExams } from "../../features/exams/examSlice";
import { fetchUsers } from "../../features/users/userSlice";
import {
	fetchActiveClassrooms,
	selectActiveClassrooms,
} from "../../features/classrooms/classroomSlice";

const assignmentSchema = Yup.object().shape({
	invigilatorId: Yup.string().required("Invigilator is required"),
	examId: Yup.string().required("Exam is required"),
	classroomId: Yup.string().required("Classroom is required"),
	notes: Yup.string(),
});

const AssignmentFormModal = ({ isOpen, onClose, onSave }) => {
	const dispatch = useDispatch();
	const activeClassrooms = useSelector(selectActiveClassrooms);
	const [exams, setExams] = useState([]);
	const [invigilators, setInvigilators] = useState([]);
	const [selectedExam, setSelectedExam] = useState(null);
	const [examClassrooms, setExamClassrooms] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		dispatch(fetchActiveClassrooms());

		// Fetch scheduled exams
		dispatch(
			fetchExams({ status: "scheduled", sortBy: "date", sortOrder: "ASC" })
		)
			.unwrap()
			.then((data) => {
				setExams(data.exams);
			});

		// Fetch approved invigilators
		dispatch(fetchUsers({ role: "invigilator", status: "approved" }))
			.unwrap()
			.then((data) => {
				setInvigilators(data.users);
			});
	}, [dispatch]);

	const handleExamChange = (e, setFieldValue) => {
		const examId = e.target.value;
		setFieldValue("examId", examId);
		setFieldValue("classroomId", "");

		if (examId) {
			const exam = exams.find((exam) => exam.id === examId);
			setSelectedExam(exam);
			if (exam && exam.classrooms) {
				setExamClassrooms(exam.classrooms);
			} else {
				setExamClassrooms([]);
			}
		} else {
			setSelectedExam(null);
			setExamClassrooms([]);
		}
	};

	const initialValues = {
		invigilatorId: "",
		examId: "",
		classroomId: "",
		notes: "",
	};

	const handleSubmit = async (values, { setSubmitting, resetForm }) => {
		setSubmitting(true);
		try {
			await onSave(values);
			resetForm();
			setSelectedExam(null);
			setExamClassrooms([]);
			onClose();
		} catch (error) {
			console.error("Error saving assignment:", error);
		}
		setSubmitting(false);
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
										Create Assignment
									</Dialog.Title>
									<div className="mt-4">
										<Formik
											initialValues={initialValues}
											validationSchema={assignmentSchema}
											onSubmit={handleSubmit}
										>
											{({
												setFieldValue,
												values,
												isSubmitting,
												errors,
												touched,
											}) => (
												<Form className="space-y-4">
													<div>
														<label
															htmlFor="invigilatorId"
															className="form-label"
														>
															Invigilator
														</label>
														<Field
															as="select"
															id="invigilatorId"
															name="invigilatorId"
															className="form-input"
														>
															<option value="">Select Invigilator</option>
															{invigilators.map((invigilator) => (
																<option
																	key={invigilator.id}
																	value={invigilator.id}
																>
																	{invigilator.fullName} -{" "}
																	{invigilator.department || "No Department"}
																</option>
															))}
														</Field>
														<ErrorMessage
															name="invigilatorId"
															component="div"
															className="form-error"
														/>
													</div>

													<div>
														<label htmlFor="examId" className="form-label">
															Exam
														</label>
														<Field
															as="select"
															id="examId"
															name="examId"
															className="form-input"
															onChange={(e) =>
																handleExamChange(e, setFieldValue)
															}
														>
															<option value="">Select Exam</option>
															{exams.map((exam) => (
																<option key={exam.id} value={exam.id}>
																	{exam.title} -{" "}
																	{new Date(exam.date).toLocaleDateString()}
																</option>
															))}
														</Field>
														<ErrorMessage
															name="examId"
															component="div"
															className="form-error"
														/>
													</div>

													<div>
														<label htmlFor="classroomId" className="form-label">
															Classroom
														</label>
														<Field
															as="select"
															id="classroomId"
															name="classroomId"
															className="form-input"
															disabled={!values.examId}
														>
															<option value="">Select Classroom</option>
															{examClassrooms.map((classroom) => (
																<option key={classroom.id} value={classroom.id}>
																	{classroom.name} ({classroom.location})
																</option>
															))}
														</Field>
														<ErrorMessage
															name="classroomId"
															component="div"
															className="form-error"
														/>
													</div>

													<div>
														<label htmlFor="notes" className="form-label">
															Notes
														</label>
														<Field
															as="textarea"
															id="notes"
															name="notes"
															rows={3}
															className="form-input"
															placeholder="Add any instructions or notes for the invigilator"
														/>
														<ErrorMessage
															name="notes"
															component="div"
															className="form-error"
														/>
													</div>

													<div className="mt-5 sm:mt-6">
														<button
															type="submit"
															disabled={isSubmitting}
															className="btn btn-primary w-full"
														>
															{isSubmitting
																? "Creating..."
																: "Create Assignment"}
														</button>
													</div>
												</Form>
											)}
										</Formik>
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

export default AssignmentFormModal;
