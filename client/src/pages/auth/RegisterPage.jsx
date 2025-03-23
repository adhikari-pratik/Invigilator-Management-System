import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
	register,
	selectAuth,
	resetRegistrationSuccess,
} from "../../features/auth/authSlice";

const registerSchema = Yup.object().shape({
	username: Yup.string()
		.min(4, "Username must be at least 4 characters")
		.max(20, "Username must not exceed 20 characters")
		.required("Username is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password"), null], "Passwords must match")
		.required("Confirm password is required"),
	fullName: Yup.string().required("Full name is required"),
	email: Yup.string()
		.email("Invalid email format")
		.required("Email is required"),
	dateOfBirth: Yup.date()
		.required("Date of birth is required")
		.max(new Date(), "Date of birth cannot be in the future")
		.min(new Date(1900, 0, 1), "Invalid date of birth"),
	gender: Yup.string()
		.oneOf(["male", "female", "other"], "Please select a gender")
		.required("Gender is required"),
	department: Yup.string().required("Department is required"),
	address: Yup.string().required("Address is required"),
	phoneNumber: Yup.string().required("Phone number is required"),
	designation: Yup.string().required("Designation is required"),
	experience_years: Yup.number()
		.min(0, "Experience years cannot be negative")
		.required("Years of experience is required"),
	specialization: Yup.string().required("Specialization is required"),
	max_duties_per_day: Yup.number()
		.min(1, "Minimum 1 duty per day")
		.max(4, "Maximum 4 duties per day")
		.required("Maximum duties per day is required"),
	max_duties_per_week: Yup.number()
		.min(1, "Minimum 1 duty per week")
		.max(20, "Maximum 20 duties per week")
		.required("Maximum duties per week is required"),
});

const departments = [
	"Computer Engineering",
	"Civil Engineering",
	"Mechanical Engineering",
	"Electrical Engineering",
	"Electronics Engineering",
	"Architecture",
	"Applied Sciences",
	"Management",
	"Humanities",
	"Other",
];

const designations = [
	"Professor",
	"Associate Professor",
	"Assistant Professor",
	"Lecturer",
	"Senior Lecturer",
	"Teaching Assistant",
	"Research Assistant",
	"Lab Instructor",
	"Technical Officer",
	"Other",
];

const specializations = [
	"Programming & Software Development",
	"Database Management",
	"Computer Networks",
	"Artificial Intelligence",
	"Machine Learning",
	"Data Science",
	"Web Development",
	"Mobile Development",
	"Cybersecurity",
	"Cloud Computing",
	"Computer Architecture",
	"Operating Systems",
	"Digital Electronics",
	"Control Systems",
	"Power Systems",
	"Communication Systems",
	"Signal Processing",
	"VLSI Design",
	"Robotics",
	"Other",
];

const RegisterPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, registrationSuccess } = useSelector(selectAuth);

	React.useEffect(() => {
		// Redirect to login page if registration is successful
		if (registrationSuccess) {
			setTimeout(() => {
				dispatch(resetRegistrationSuccess());
				navigate("/login");
			}, 3000);
		}
	}, [registrationSuccess, navigate, dispatch]);

	const handleSubmit = async (values) => {
		const userData = { ...values, role: "invigilator" };
		delete userData.confirmPassword;
		await dispatch(register(userData));
	};

	return (
		<div>
			<h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
				Create a new account
			</h2>

			{error && (
				<div className="mb-4 p-3 bg-danger-100 text-danger-800 dark:bg-danger-800 dark:text-danger-100 rounded-md">
					{error}
				</div>
			)}

			{registrationSuccess && (
				<div className="mb-4 p-3 bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-100 rounded-md">
					Registration successful! Please wait for admin approval. Redirecting
					to login...
				</div>
			)}

			<Formik
				initialValues={{
					username: "",
					password: "",
					confirmPassword: "",
					fullName: "",
					email: "",
					dateOfBirth: "",
					gender: "",
					department: "",
					address: "",
					phoneNumber: "",
					designation: "",
					experience_years: "",
					specialization: "",
					max_duties_per_day: 2,
					max_duties_per_week: 8,
				}}
				validationSchema={registerSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting }) => (
					<Form className="space-y-4">
						<div>
							<label htmlFor="username" className="form-label">
								Username
							</label>
							<Field
								id="username"
								name="username"
								type="text"
								className="form-input"
							/>
							<ErrorMessage
								name="username"
								component="div"
								className="form-error"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="password" className="form-label">
									Password
								</label>
								<Field
									id="password"
									name="password"
									type="password"
									className="form-input"
								/>
								<ErrorMessage
									name="password"
									component="div"
									className="form-error"
								/>
							</div>

							<div>
								<label htmlFor="confirmPassword" className="form-label">
									Confirm Password
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
								Email
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="gender" className="form-label">
									Gender
								</label>
								<Field
									as="select"
									id="gender"
									name="gender"
									className="form-input"
								>
									<option value="">Select Gender</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="other">Other</option>
								</Field>
								<ErrorMessage
									name="gender"
									component="div"
									className="form-error"
								/>
							</div>

							<div>
								<label htmlFor="department" className="form-label">
									Department
								</label>
								<Field
									as="select"
									id="department"
									name="department"
									className="form-input"
								>
									<option value="">Select Department</option>
									{departments.map((dept) => (
										<option key={dept} value={dept}>
											{dept}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="department"
									component="div"
									className="form-error"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="address" className="form-label">
								Address
							</label>
							<Field
								id="address"
								name="address"
								type="text"
								className="form-input"
							/>
							<ErrorMessage
								name="address"
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="designation" className="form-label">
									Designation
								</label>
								<Field
									as="select"
									id="designation"
									name="designation"
									className="form-input"
								>
									<option value="">Select Designation</option>
									{designations.map((designation) => (
										<option key={designation} value={designation}>
											{designation}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="designation"
									component="div"
									className="form-error"
								/>
							</div>

							<div>
								<label htmlFor="experience_years" className="form-label">
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
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="specialization" className="form-label">
									Specialization
								</label>
								<Field
									as="select"
									id="specialization"
									name="specialization"
									className="form-input"
								>
									<option value="">Select Specialization</option>
									{specializations.map((spec) => (
										<option key={spec} value={spec}>
											{spec}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="specialization"
									component="div"
									className="form-error"
								/>
							</div>

							<div>
								<label htmlFor="max_duties_per_day" className="form-label">
									Max Duties per Day
								</label>
								<Field
									id="max_duties_per_day"
									name="max_duties_per_day"
									type="number"
									min="1"
									max="4"
									className="form-input"
								/>
								<ErrorMessage
									name="max_duties_per_day"
									component="div"
									className="form-error"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="max_duties_per_week" className="form-label">
								Max Duties per Week
							</label>
							<Field
								id="max_duties_per_week"
								name="max_duties_per_week"
								type="number"
								min="1"
								max="20"
								className="form-input"
							/>
							<ErrorMessage
								name="max_duties_per_week"
								component="div"
								className="form-error"
							/>
						</div>

						<div className="pt-2">
							<button
								type="submit"
								disabled={isSubmitting || loading || registrationSuccess}
								className="w-full btn btn-primary"
							>
								{loading ? "Registering..." : "Register"}
							</button>
						</div>
					</Form>
				)}
			</Formik>

			<div className="mt-6 text-center">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-medium text-primary-600 hover:text-primary-500"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default RegisterPage;
