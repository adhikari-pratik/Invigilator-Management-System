const { User } = require("../models");
const { Op } = require("sequelize");
const { createNotification } = require("./notification.service");

/**
 * Get all users with filtering and pagination
 */
const getAllUsers = async (query = {}) => {
	const {
		page = 1,
		limit = 10,
		role,
		status,
		gender,
		search,
		sortBy = "createdAt",
		sortOrder = "DESC",
	} = query;

	const offset = (page - 1) * limit;

	const whereConditions = {};

	if (role) {
		whereConditions.role = role;
	}

	if (status) {
		whereConditions.status = status;
	}

	if (gender) {
		whereConditions.gender = gender;
	}

	if (search) {
		whereConditions[Op.or] = [
			{ fullName: { [Op.like]: `%${search}%` } },
			{ username: { [Op.like]: `%${search}%` } },
			{ email: { [Op.like]: `%${search}%` } },
			{ department: { [Op.like]: `%${search}%` } },
			{ address: { [Op.like]: `%${search}%` } },
		];
	}

	const { count, rows } = await User.findAndCountAll({
		where: whereConditions,
		attributes: { exclude: ["password"] },
		limit: parseInt(limit),
		offset,
		order: [
			[sortBy === "address" ? "address" : sortBy, sortOrder],
			["createdAt", "DESC"], // Secondary sort by creation date
		],
	});

	return {
		users: rows,
		totalUsers: count,
		totalPages: Math.ceil(count / limit),
		currentPage: parseInt(page),
	};
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
	const user = await User.findByPk(userId, {
		attributes: { exclude: ["password"] },
	});

	if (!user) {
		throw new Error("User not found");
	}

	return user;
};

/**
 * Update user status
 */
const updateUserStatus = async (userId, status, adminId) => {
	const user = await User.findByPk(userId);

	if (!user) {
		throw new Error("User not found");
	}

	user.status = status;
	await user.save();

	// Create notification
	await createNotification({
		userId: user.id,
		title: "Account Status Updated",
		message: `Your account status has been updated to ${status}.`,
		type: "status_change",
	});

	return user;
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, userData) => {
	const user = await User.findByPk(userId);

	if (!user) {
		throw new Error("User not found");
	}

	// Prevent updating sensitive fields
	delete userData.password;
	delete userData.role;
	delete userData.status;

	// Update user data
	Object.assign(user, userData);
	await user.save();

	return {
		...user.toJSON(),
		password: undefined,
	};
};

module.exports = {
	getAllUsers,
	getUserById,
	updateUserStatus,
	updateUserProfile,
};
