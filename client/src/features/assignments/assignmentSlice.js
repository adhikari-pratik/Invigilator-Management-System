import {
	createSlice,
	createAsyncThunk,
	createSelector,
} from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const fetchAssignments = createAsyncThunk(
	"assignments/fetchAssignments",
	async (params = {}, { rejectWithValue }) => {
		try {
			const response = await api.get("/assignments", { params });
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch assignments"
			);
		}
	}
);

export const fetchAssignmentById = createAsyncThunk(
	"assignments/fetchAssignmentById",
	async (assignmentId, { rejectWithValue }) => {
		try {
			const response = await api.get(`/assignments/${assignmentId}`);
			return response.data.data.assignment;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch assignment"
			);
		}
	}
);

export const createAssignment = createAsyncThunk(
	"assignments/createAssignment",
	async (assignmentData, { rejectWithValue }) => {
		try {
			const response = await api.post("/assignments", assignmentData);
			toast.success("Assignment created successfully");
			return response.data.data.assignment;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to create assignment"
			);
		}
	}
);

export const updateAssignmentStatus = createAsyncThunk(
	"assignments/updateAssignmentStatus",
	async ({ assignmentId, status, responseNote }, { rejectWithValue }) => {
		try {
			const response = await api.patch(`/assignments/${assignmentId}/status`, {
				status,
				responseNote,
			});
			toast.success(`Assignment ${status} successfully`);
			return response.data.data.assignment;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update assignment status"
			);
		}
	}
);

export const deleteAssignment = createAsyncThunk(
	"assignments/deleteAssignment",
	async (assignmentId, { rejectWithValue }) => {
		try {
			await api.delete(`/assignments/${assignmentId}`);
			toast.success("Assignment deleted successfully");
			return assignmentId;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to delete assignment"
			);
		}
	}
);

export const fetchInvigilatorAssignments = createAsyncThunk(
	"assignments/fetchInvigilatorAssignments",
	async (params = {}, { rejectWithValue }) => {
		try {
			const response = await api.get("/assignments/my-assignments", { params });
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch assignments"
			);
		}
	}
);

export const fetchRecentAssignments = createAsyncThunk(
	"assignments/fetchRecentAssignments",
	async (params = {}, { rejectWithValue }) => {
		try {
			const response = await api.get("/assignments", { params });
			return response.data.data.assignments;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch recent assignments"
			);
		}
	}
);

// Initial state
const initialState = {
	assignments: [],
	invigilatorAssignments: [],
	assignment: null,
	recentAssignments: [],
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalAssignments: 0,
	},
	loading: false,
	error: null,
};

// Slice
const assignmentSlice = createSlice({
	name: "assignments",
	initialState,
	reducers: {
		clearAssignmentError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch assignments
			.addCase(fetchAssignments.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAssignments.fulfilled, (state, action) => {
				state.loading = false;
				state.assignments = action.payload.assignments;
				state.pagination = {
					currentPage: action.payload.currentPage,
					totalPages: action.payload.totalPages,
					totalAssignments: action.payload.totalAssignments,
				};
			})
			.addCase(fetchAssignments.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch assignment by ID
			.addCase(fetchAssignmentById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAssignmentById.fulfilled, (state, action) => {
				state.loading = false;
				state.assignment = action.payload;
			})
			.addCase(fetchAssignmentById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Create assignment
			.addCase(createAssignment.fulfilled, (state, action) => {
				state.assignments.unshift(action.payload);
				if (state.pagination.totalAssignments) {
					state.pagination.totalAssignments += 1;
				}
			})

			// Update assignment status
			.addCase(updateAssignmentStatus.fulfilled, (state, action) => {
				// Update in assignments list
				const index = state.assignments.findIndex(
					(assignment) => assignment.id === action.payload.id
				);
				if (index !== -1) {
					state.assignments[index] = action.payload;
				}

				// Update in invigilator assignments list
				const invigilatorIndex = state.invigilatorAssignments.findIndex(
					(assignment) => assignment.id === action.payload.id
				);
				if (invigilatorIndex !== -1) {
					state.invigilatorAssignments[invigilatorIndex] = action.payload;
				}

				// Update current assignment if it's the one being updated
				if (state.assignment && state.assignment.id === action.payload.id) {
					state.assignment = action.payload;
				}

				// Update in recent assignments list
				const recentIndex = state.recentAssignments.findIndex(
					(assignment) => assignment.id === action.payload.id
				);
				if (recentIndex !== -1) {
					state.recentAssignments[recentIndex] = action.payload;
				}
			})

			// Delete assignment
			.addCase(deleteAssignment.fulfilled, (state, action) => {
				state.assignments = state.assignments.filter(
					(assignment) => assignment.id !== action.payload
				);
				if (state.pagination.totalAssignments) {
					state.pagination.totalAssignments -= 1;
				}
				if (state.assignment && state.assignment.id === action.payload) {
					state.assignment = null;
				}
				state.recentAssignments = state.recentAssignments.filter(
					(assignment) => assignment.id !== action.payload
				);
			})

			// Fetch invigilator assignments
			.addCase(fetchInvigilatorAssignments.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchInvigilatorAssignments.fulfilled, (state, action) => {
				state.loading = false;
				state.invigilatorAssignments = action.payload.assignments;
				state.pagination = {
					currentPage: action.payload.currentPage,
					totalPages: action.payload.totalPages,
					totalAssignments: action.payload.totalAssignments,
				};
				state.recentAssignments = action.payload.assignments.slice(0, 5);
			})
			.addCase(fetchInvigilatorAssignments.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch recent assignments
			.addCase(fetchRecentAssignments.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchRecentAssignments.fulfilled, (state, action) => {
				state.loading = false;
				state.recentAssignments = action.payload;
			})
			.addCase(fetchRecentAssignments.rejected, (state) => {
				state.loading = false;
			});
	},
});

// Selectors
export const selectAssignments = (state) => state.assignments.assignments;
export const selectInvigilatorAssignments = (state) =>
	state.assignments.invigilatorAssignments;
export const selectAssignment = (state) => state.assignments.assignment;
export const selectAssignmentsPagination = (state) =>
	state.assignments.pagination;
export const selectAssignmentsLoading = (state) => state.assignments.loading;
export const selectAssignmentsError = (state) => state.assignments.error;

export const selectRecentAssignments = createSelector(
	[
		(state) => state.assignments.recentAssignments,
		(state) => state.assignments.loading,
	],
	(recentAssignments, loading) => ({
		recentAssignments,
		loading,
	})
);

export const { clearAssignmentError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
