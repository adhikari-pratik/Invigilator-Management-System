import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const classroomSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	room_number: Yup.string().required("Room number is required"),
	building: Yup.string().required("Building is required"),
	capacity: Yup.number()
		.min(1, "Capacity must be at least 1")
		.required("Capacity is required"),
	floor: Yup.number()
		.min(0, "Floor cannot be negative")
		.required("Floor is required"),
	has_projector: Yup.boolean(),
	has_computer: Yup.boolean(),
	has_whiteboard: Yup.boolean(),
	status: Yup.string()
		.oneOf(["active", "inactive"], "Invalid status")
		.required("Status is required"),
	block: Yup.string().required("Block is required"),
	department_id: Yup.number().required("Department is required"),
	department_name: Yup.string().required("Department name is required"),
});

const buildings = [
	"Main Building",
	"Engineering Block",
	"Science Block",
	"Administration Block",
	"Library Block",
	"Computer Center",
	"Other",
];

const blocks = ["A", "B", "C", "D", "E", "F", "G", "H"];

const departments = [
	{ id: 1, name: "Computer Engineering" },
	{ id: 2, name: "Civil Engineering" },
	{ id: 3, name: "Mechanical Engineering" },
	{ id: 4, name: "Electrical Engineering" },
	{ id: 5, name: "Electronics Engineering" },
	{ id: 6, name: "Architecture" },
	{ id: 7, name: "Applied Sciences" },
	{ id: 8, name: "Management" },
	{ id: 9, name: "Humanities" },
];

const ClassroomFormModal = ({
	isOpen,
	onClose,
	onSave,
	classroom,
	isEditMode = false,
}) => {
	const initialValues = {
		name: classroom?.name || "",
		room_number: classroom?.room_number || "",
		building: classroom?.building || "",
		capacity: classroom?.capacity || 30,
		floor: classroom?.floor || 0,
		has_projector: classroom?.has_projector || false,
		has_computer: classroom?.has_computer || false,
		has_whiteboard: classroom?.has_whiteboard || true,
		status: classroom?.status || "active",
		block: classroom?.block || "",
		department_id: classroom?.department_id || 1,
		department_name: classroom?.department_name || "Computer Engineering",
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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-secondary-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
								<div className="flex justify-between items-center">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
									>
										{isEditMode ? "Edit Classroom" : "Create New Classroom"}
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
										validationSchema={classroomSchema}
										onSubmit={handleSubmit}
									>
										{({ isSubmitting, setFieldValue }) => (
											<Form className="space-y-4">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<label htmlFor="name" className="form-label">
															Name
														</label>
														<Field
															id="name"
															name="name"
															type="text"
															className="form-input"
														/>
														<ErrorMessage
															name="name"
															component="div"
															className="form-error"
														/>
													</div>

													<div>
														<label htmlFor="room_number" className="form-label">
															Room Number
														</label>
														<Field
															id="room_number"
															name="room_number"
															type="text"
															className="form-input"
														/>
														<ErrorMessage
															name="room_number"
															component="div"
															className="form-error"
														/>
													</div>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<label htmlFor="building" className="form-label">
															Building
														</label>
														<Field
															as="select"
															id="building"
															name="building"
															className="form-input"
														>
															<option value="">Select Building</option>
															{buildings.map((building) => (
																<option key={building} value={building}>
																	{building}
																</option>
															))}
														</Field>
														<ErrorMessage
															name="building"
															component="div"
															className="form-error"
														/>
													</div>

													<div>
														<label htmlFor="block" className="form-label">
															Block
														</label>
														<Field
															as="select"
															id="block"
															name="block"
															className="form-input"
														>
															<option value="">Select Block</option>
															{blocks.map((block) => (
																<option key={block} value={block}>
																	{block}
																</option>
															))}
														</Field>
														<ErrorMessage
															name="block"
															component="div"
															className="form-error"
														/>
													</div>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<label htmlFor="capacity" className="form-label">
															Capacity
														</label>
														<Field
															id="capacity"
															name="capacity"
															type="number"
															min="1"
															className="form-input"
														/>
														<ErrorMessage
															name="capacity"
															component="div"
															className="form-error"
														/>
													</div>

													<div>
														<label htmlFor="floor" className="form-label">
															Floor
														</label>
														<Field
															id="floor"
															name="floor"
															type="number"
															min="0"
															className="form-input"
														/>
														<ErrorMessage
															name="floor"
															component="div"
															className="form-error"
														/>
													</div>
												</div>

												<div>
													<label htmlFor="department_id" className="form-label">
														Department
													</label>
													<Field
														as="select"
														id="department_id"
														name="department_id"
														className="form-input"
														onChange={(e) => {
															const selectedDept = departments.find(
																(dept) => dept.id === parseInt(e.target.value)
															);
															setFieldValue("department_id", e.target.value);
															setFieldValue(
																"department_name",
																selectedDept.name
															);
														}}
													>
														<option value="">Select Department</option>
														{departments.map((dept) => (
															<option key={dept.id} value={dept.id}>
																{dept.name}
															</option>
														))}
													</Field>
													<ErrorMessage
														name="department_id"
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
														<option value="active">Active</option>
														<option value="inactive">Inactive</option>
													</Field>
													<ErrorMessage
														name="status"
														component="div"
														className="form-error"
													/>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<div className="flex items-center">
														<Field
															type="checkbox"
															id="has_projector"
															name="has_projector"
															className="form-checkbox"
														/>
														<label
															htmlFor="has_projector"
															className="ml-2 form-label"
														>
															Has Projector
														</label>
													</div>

													<div className="flex items-center">
														<Field
															type="checkbox"
															id="has_computer"
															name="has_computer"
															className="form-checkbox"
														/>
														<label
															htmlFor="has_computer"
															className="ml-2 form-label"
														>
															Has Computer
														</label>
													</div>

													<div className="flex items-center">
														<Field
															type="checkbox"
															id="has_whiteboard"
															name="has_whiteboard"
															className="form-checkbox"
														/>
														<label
															htmlFor="has_whiteboard"
															className="ml-2 form-label"
														>
															Has Whiteboard
														</label>
													</div>
												</div>

												<div className="flex justify-end space-x-4 mt-6">
													<button
														type="button"
														onClick={onClose}
														className="btn btn-secondary"
													>
														Cancel
													</button>
													<button
														type="submit"
														disabled={isSubmitting}
														className="btn btn-primary"
													>
														{isSubmitting ? "Saving..." : "Save"}
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

export default ClassroomFormModal;
