import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserIcon } from "@heroicons/react/24/outline";
import {
	selectUser,
	updateProfile,
	changePassword,
} from "../features/auth/authSlice";
import toast from "react-hot-toast";

const profileSchema = Yup.object().shape({
	fullName: Yup.string().required("Full name is required"),
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	phoneNumber: Yup.string().required("Phone number is required"),
	address: Yup.string().required("Address is required"),
	department: Yup.string().required("Department is required"),
	designation: Yup.string().required("Designation is required"),
	experience_years: Yup.number()
		.min(0, "Experience years cannot be negative")
		.required("Years of experience is required"),
	specialization: Yup.string().required("Specialization is required"),
	dateOfBirth: Yup.date().required("Date of birth is required"),
});

const passwordSchema = Yup.object().shape({
	currentPassword: Yup.string().required("Current password is required"),
	newPassword: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("New password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("newPassword"), null], "Passwords must match")
		.required("Confirm password is required"),
});

const ProfilePage = () => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const [activeTab, setActiveTab] = useState("profile");

	console.log("Current user data:", user);

	const handleProfileSubmit = async (values, { setSubmitting }) => {
		try {
			await dispatch(updateProfile(values)).unwrap();
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error("Failed to update profile");
		} finally {
			setSubmitting(false);
		}
	};

	const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
		try {
			await dispatch(
				changePassword({
					currentPassword: values.currentPassword,
					newPassword: values.newPassword,
				})
			).unwrap();
			toast.success("Password changed successfully");
			resetForm();
		} catch (error) {
			toast.error("Failed to change password");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Profile
				</h1>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Manage your account settings and preferences.
				</p>
			</div>

			<div className="card">
				<div className="card-header">
					<nav className="flex space-x-4" aria-label="Tabs">
						<button
							className={`px-3 py-2 text-sm font-medium rounded-md ${
								activeTab === "profile"
									? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
									: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
							}`}
							onClick={() => setActiveTab("profile")}
						>
							Profile Information
						</button>
						<button
							className={`px-3 py-2 text-sm font-medium rounded-md ${
								activeTab === "password"
									? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
									: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
							}`}
							onClick={() => setActiveTab("password")}
						>
							Change Password
						</button>
					</nav>
				</div>
				<div className="card-body">
					{activeTab === "profile" ? (
						<div className="max-w-3xl">
							<div className="flex items-center mb-6">
								<div className="mr-4">
									{user.profileImage ? (
										<img
											src={user.profileImage}
											alt={user.fullName}
											className="h-16 w-16 rounded-full"
										/>
									) : (
										<div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
											<UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
										</div>
									)}
								</div>
								<div>
									<h2 className="text-lg font-medium text-gray-900 dark:text-white">
										{user.fullName}
									</h2>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{user.role === "admin" ? "Administrator" : "Invigilator"}
									</p>
								</div>
							</div>

							<Formik
								initialValues={{
									fullName: user.fullName || "",
									email: user.email || "",
									phoneNumber: user.phoneNumber || "",
									address: user.address || "",
									department: user.department || "",
									designation: user.designation || "",
									experience_years: user.experience_years || 0,
									specialization: user.specialization || "",
									dateOfBirth: user.dateOfBirth || "",
								}}
								validationSchema={profileSchema}
								onSubmit={handleProfileSubmit}
							>
								{({ isSubmitting }) => (
									<Form>
										<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
											<div>
												<label htmlFor="fullName" className="form-label">
													Full Name
												</label>
												<Field
													id="fullName"
													name="fullName"
													type="text"
													className="form-input"
												/>
												<ErrorMessage
													name="fullName"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label htmlFor="email" className="form-label">
													Email Address
												</label>
												<Field
													id="email"
													name="email"
													type="email"
													className="form-input"
												/>
												<ErrorMessage
													name="email"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label htmlFor="phoneNumber" className="form-label">
													Phone Number
												</label>
												<Field
													id="phoneNumber"
													name="phoneNumber"
													type="text"
													className="form-input"
												/>
												<ErrorMessage
													name="phoneNumber"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label htmlFor="department" className="form-label">
													Department
												</label>
												<Field
													id="department"
													name="department"
													type="text"
													className="form-input"
												/>
												<ErrorMessage
													name="department"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label htmlFor="designation" className="form-label">
													Designation
												</label>
												<Field
													id="designation"
													name="designation"
													type="text"
													className="form-input"
												/>
												<ErrorMessage
													name="designation"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label
													htmlFor="experience_years"
													className="form-label"
												>
													Years of Experience
												</label>
												<Field
													id="experience_years"
													name="experience_years"
													type="number"
													min="0"
													className="form-input"
												/>
												<ErrorMessage
													name="experience_years"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label htmlFor="specialization" className="form-label">
													Specialization
												</label>
												<Field
													id="specialization"
													name="specialization"
													type="text"
													className="form-input"
												/>
												<ErrorMessage
													name="specialization"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label htmlFor="dateOfBirth" className="form-label">
													Date of Birth
												</label>
												<Field
													id="dateOfBirth"
													name="dateOfBirth"
													type="date"
													className="form-input"
												/>
												<ErrorMessage
													name="dateOfBirth"
													component="div"
													className="form-error"
												/>
											</div>

											<div className="sm:col-span-2">
												<label htmlFor="address" className="form-label">
													Address
												</label>
												<Field
													id="address"
													name="address"
													as="textarea"
													rows={3}
													className="form-input"
												/>
												<ErrorMessage
													name="address"
													component="div"
													className="form-error"
												/>
											</div>
										</div>

										<div className="mt-6">
											<button
												type="submit"
												disabled={isSubmitting}
												className="btn btn-primary"
											>
												{isSubmitting ? "Saving..." : "Save Changes"}
											</button>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					) : (
						<div className="max-w-md">
							<p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
								Ensure your password is strong and not used elsewhere. We
								recommend using a combination of letters, numbers, and special
								characters.
							</p>

							<Formik
								initialValues={{
									currentPassword: "",
									newPassword: "",
									confirmPassword: "",
								}}
								validationSchema={passwordSchema}
								onSubmit={handlePasswordSubmit}
							>
								{({ isSubmitting }) => (
									<Form>
										<div className="space-y-4">
											<div>
												<label htmlFor="currentPassword" className="form-label">
													Current Password
												</label>
												<Field
													id="currentPassword"
													name="currentPassword"
													type="password"
													className="form-input"
												/>
												<ErrorMessage
													name="currentPassword"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label htmlFor="newPassword" className="form-label">
													New Password
												</label>
												<Field
													id="newPassword"
													name="newPassword"
													type="password"
													className="form-input"
												/>
												<ErrorMessage
													name="newPassword"
													component="div"
													className="form-error"
												/>
											</div>

											<div>
												<label htmlFor="confirmPassword" className="form-label">
													Confirm New Password
												</label>
												<Field
													id="confirmPassword"
													name="confirmPassword"
													type="password"
													className="form-input"
												/>
												<ErrorMessage
													name="confirmPassword"
													component="div"
													className="form-error"
												/>
											</div>
										</div>

										<div className="mt-6">
											<button
												type="submit"
												disabled={isSubmitting}
												className="btn btn-primary"
											>
												{isSubmitting
													? "Changing Password..."
													: "Change Password"}
											</button>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
