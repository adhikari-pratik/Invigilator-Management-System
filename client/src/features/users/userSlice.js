import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const fetchUsers = createAsyncThunk(
	"users/fetchUsers",
	async (params = {}, { rejectWithValue }) => {
		try {
			const response = await api.get("/users", { params });
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch users"
			);
		}
	}
);

export const fetchUserById = createAsyncThunk(
	"users/fetchUserById",
	async (userId, { rejectWithValue }) => {
		try {
			const response = await api.get(`/users/${userId}`);
			return response.data.data.user;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch user"
			);
		}
	}
);

export const updateUserStatus = createAsyncThunk(
	"users/updateUserStatus",
	async ({ userId, status }, { rejectWithValue }) => {
		try {
			const response = await api.patch(`/users/${userId}/status`, { status });
			toast.success(`User status updated to ${status}`);
			return {
				userId,
				user: response.data.data.user,
			};
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update user status"
			);
		}
	}
);

export const updateUser = createAsyncThunk(
	"users/updateUser",
	async ({ userId, userData }, { rejectWithValue }) => {
		try {
			const response = await api.patch(`/users/${userId}`, userData);
			toast.success("User updated successfully");
			return response.data.data.user;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update user"
			);
		}
	}
);

// Initial state
const initialState = {
	users: [],
	user: null,
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalUsers: 0,
	},
	loading: false,
	error: null,
};

// Slice
const userSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		clearUserError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch users
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload.users;
				state.pagination = {
					currentPage: action.payload.currentPage,
					totalPages: action.payload.totalPages,
					totalUsers: action.payload.totalUsers,
				};
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch user by ID
			.addCase(fetchUserById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserById.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(fetchUserById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update user status
			.addCase(updateUserStatus.fulfilled, (state, action) => {
				const index = state.users.findIndex(
					(user) => user.id === action.payload.userId
				);
				if (index !== -1) {
					state.users[index] = action.payload.user;
				}
				if (state.user && state.user.id === action.payload.userId) {
					state.user = action.payload.user;
				}
			})

			// Update user
			.addCase(updateUser.fulfilled, (state, action) => {
				const index = state.users.findIndex(
					(user) => user.id === action.payload.id
				);
				if (index !== -1) {
					state.users[index] = action.payload;
				}
				if (state.user && state.user.id === action.payload.id) {
					state.user = action.payload;
				}
			});
	},
});

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectUser = (state) => state.users.user;
export const selectUsersPagination = (state) => state.users.pagination;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
