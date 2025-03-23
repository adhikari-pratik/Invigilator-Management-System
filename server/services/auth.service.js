const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/auth");

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
	return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
		expiresIn: config.jwtExpiration,
	});
};

/**
 * Register a new user
 */
const register = async (userData) => {
	// If first user, make them admin automatically
	console.log(
		"this is the register funtion in the suth.service.js the user value returns from here is successful"
	);
	const userCount = await User.count();
	if (userCount === 0) {
		userData.role = "admin";
		userData.status = "approved";
	} else if (userData.role === "admin") {
		throw new Error("Admin users can only be created by existing admins.");
	}

	// Hash password
	const salt = await bcrypt.genSalt(config.saltRounds);
	const hashedPassword = await bcrypt.hash(userData.password, salt);

	// Create user
	const user = await User.create({
		...userData,
		password: hashedPassword,
	});

	return user;
};

/**
 * Login a user
 */
const login = async (username, password) => {
	const user = await User.findOne({ where: { username } });

	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		throw new Error("Invalid credentials");
	}

	if (user.status !== "approved") {
		throw new Error("Your account is still pending approval");
	}

	return {
		id: user.id,
		username: user.username,
		email: user.email,
		fullName: user.fullName,
		role: user.role,
		status: user.status,
		token: generateToken(user),
	};
};

/**
 * Change user password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
	const user = await User.findByPk(userId);

	if (!user) {
		throw new Error("User not found");
	}

	const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

	if (!isPasswordValid) {
		throw new Error("Current password is incorrect");
	}

	// Hash new password
	const salt = await bcrypt.genSalt(config.saltRounds);
	const hashedPassword = await bcrypt.hash(newPassword, salt);

	// Update password
	user.password = hashedPassword;
	await user.save();

	return { message: "Password changed successfully" };
};

/**
 * Update user profile
 */
const updateProfile = async (userId, profileData) => {
	const user = await User.findByPk(userId);

	if (!user) {
		throw new Error("User not found");
	}

	// Update user profile
	await user.update({
		fullName: profileData.fullName,
		email: profileData.email,
		phoneNumber: profileData.phoneNumber,
		address: profileData.address,
		department: profileData.department,
		designation: profileData.designation,
		experience_years: profileData.experience_years,
		specialization: profileData.specialization,
		dateOfBirth: profileData.dateOfBirth,
	});

	return user;
};

module.exports = {
	register,
	login,
	changePassword,
	generateToken,
	updateProfile,
};
