const authService = require("../services/auth.service");

/**
 * Register a new user
 */
exports.register = async (req, res, next) => {
	try {
		const user = await authService.register(req.body);
		console.log(user);
		res.status(201).json({
			status: "success",
			message:
				user.role === "admin"
					? "Admin registered successfully"
					: "Registration successful. Please wait for admin approval.",
			data: {
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					fullName: user.fullName,
					role: user.role,
					status: user.status,
				},
			},
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				status: "fail",
				message: "Please provide username and password",
			});
		}

		const userData = await authService.login(username, password);

		res.status(200).json({
			status: "success",
			message: "Login successful",
			data: {
				user: userData,
			},
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Change user's password
 */
exports.changePassword = async (req, res, next) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				status: "fail",
				message: "Please provide current and new password",
			});
		}

		const result = await authService.changePassword(
			req.user.id,
			currentPassword,
			newPassword
		);

		res.status(200).json({
			status: "success",
			message: result.message,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Get current logged in user
 */
exports.getMe = (req, res) => {
	res.status(200).json({
		status: "success",
		data: {
			user: {
				id: req.user.id,
				username: req.user.username,
				email: req.user.email,
				fullName: req.user.fullName,
				role: req.user.role,
				status: req.user.status,
				gender: req.user.gender,
				address: req.user.address,
				phoneNumber: req.user.phoneNumber,
				department: req.user.department,
				profileImage: req.user.profileImage,
				designation: req.user.designation,
				experience_years: req.user.experience_years,
				specialization: req.user.specialization,
				max_duties_per_day: req.user.max_duties_per_day,
				max_duties_per_week: req.user.max_duties_per_week,
				dateOfBirth: req.user.dateOfBirth,
				createdAt: req.user.createdAt,
				updatedAt: req.user.updatedAt,
			},
		},
	});
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res, next) => {
	try {
		const user = await authService.updateProfile(req.user.id, req.body);
		res.status(200).json({
			status: "success",
			message: "Profile updated successfully",
			data: {
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					fullName: user.fullName,
					role: user.role,
					status: user.status,
					gender: user.gender,
					address: user.address,
					phoneNumber: user.phoneNumber,
					department: user.department,
					profileImage: user.profileImage,
					designation: user.designation,
					experience_years: user.experience_years,
					specialization: user.specialization,
					max_duties_per_day: user.max_duties_per_day,
					max_duties_per_week: user.max_duties_per_week,
					dateOfBirth: user.dateOfBirth,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				},
			},
		});
	} catch (error) {
		next(error);
	}
};
