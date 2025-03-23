import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
// import { decode } from 'jwt-decode';
import api from "../../services/api";

// Helper function to check if token is expired
const isTokenExpired = (token) => {
	if (!token) return true;

	try {
		const decoded = jwtDecode(token);
		return decoded.exp * 1000 < Date.now();
	} catch (error) {
		return true;
	}
};

// Async thunks
export const login = createAsyncThunk(
	"auth/login",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await api.post("/auth/login", credentials);
			const { token, ...user } = response.data.data.user;

			// Save token and user to localStorage
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));

			return { token, user };
		} catch (error) {
			return rejectWithValue(error.response?.data?.message || "Login failed");
		}
	}
);

export const register = createAsyncThunk(
	"auth/register",
	async (userData, { rejectWithValue }) => {
		try {
			const response = await api.post("/auth/register", userData);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Registration failed"
			);
		}
	}
);

export const loadUser = createAsyncThunk(
	"auth/loadUser",
	async (_, { rejectWithValue }) => {
		const token = localStorage.getItem("token");
		const storedUser = JSON.parse(localStorage.getItem("user") || "null");

		// Check if token is expired
		if (isTokenExpired(token)) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			return rejectWithValue("Token expired");
		}

		try {
			// Fetch fresh user data
			const response = await api.get("/auth/me");
			const user = response.data.data.user;

			// Update stored user data
			localStorage.setItem("user", JSON.stringify(user));

			return { token, user };
		} catch (error) {
			// If API call fails but we have stored user data, use that
			if (storedUser && token) {
				return { token, user: storedUser };
			}

			localStorage.removeItem("token");
			localStorage.removeItem("user");
			return rejectWithValue(
				error.response?.data?.message || "Failed to load user"
			);
		}
	}
);

export const logout = createAsyncThunk("auth/logout", async () => {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
	return null;
});

export const changePassword = createAsyncThunk(
	"auth/changePassword",
	async (passwordData, { rejectWithValue }) => {
		try {
			const response = await api.post("/auth/change-password", passwordData);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to change password"
			);
		}
	}
);

export const updateProfile = createAsyncThunk(
	"auth/updateProfile",
	async (profileData, { rejectWithValue }) => {
		try {
			const response = await api.patch("/users/update-profile", profileData);
			const updatedUser = response.data.data.user;

			// Update stored user data
			const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
			localStorage.setItem(
				"user",
				JSON.stringify({ ...storedUser, ...updatedUser })
			);

			return updatedUser;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update profile"
			);
		}
	}
);

// Initial state
const initialState = {
	token: localStorage.getItem("token") || null,
	user: JSON.parse(localStorage.getItem("user") || "null"),
	isAuthenticated:
		!!localStorage.getItem("token") &&
		!isTokenExpired(localStorage.getItem("token")),
	loading: false,
	error: null,
	registrationSuccess: false,
};

// Slice
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		resetRegistrationSuccess: (state) => {
			state.registrationSuccess = false;
		},
	},
	extraReducers: (builder) => {
		builder
			// Login
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.token = action.payload.token;
				state.user = action.payload.user;
				state.isAuthenticated = true;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Register
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.registrationSuccess = false;
			})
			.addCase(register.fulfilled, (state) => {
				state.loading = false;
				state.registrationSuccess = true;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.registrationSuccess = false;
			})

			// Load user
			.addCase(loadUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loadUser.fulfilled, (state, action) => {
				state.loading = false;
				state.token = action.payload.token;
				state.user = action.payload.user;
				state.isAuthenticated = true;
			})
			.addCase(loadUser.rejected, (state) => {
				state.loading = false;
				state.token = null;
				state.user = null;
				state.isAuthenticated = false;
			})

			// Logout
			.addCase(logout.fulfilled, (state) => {
				state.token = null;
				state.user = null;
				state.isAuthenticated = false;
			})

			// Update profile
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.user = { ...state.user, ...action.payload };
			});
	},
});

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectIsInvigilator = (state) =>
	state.auth.user?.role === "invigilator";

export const { clearError, resetRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;
