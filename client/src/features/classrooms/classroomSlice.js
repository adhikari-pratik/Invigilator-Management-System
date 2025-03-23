import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const fetchClassrooms = createAsyncThunk(
	"classrooms/fetchClassrooms",
	async (params = {}, { rejectWithValue }) => {
		try {
			// Convert isActive string to boolean if it exists
			const queryParams = {
				...params,
				status:
					params.isActive === "true"
						? "active"
						: params.isActive === "false"
						? "inactive"
						: undefined,
			};
			delete queryParams.isActive; // Remove the isActive param as we've converted it to status

			const response = await api.get("/classrooms", { params: queryParams });
			return {
				classrooms: response.data.classrooms || [],
				currentPage: response.data.page || 1,
				totalPages: response.data.totalPages || 1,
				totalClassrooms: response.data.total || 0,
			};
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch classrooms"
			);
		}
	}
);

export const fetchClassroomById = createAsyncThunk(
	"classrooms/fetchClassroomById",
	async (classroomId, { rejectWithValue }) => {
		try {
			const response = await api.get(`/classrooms/${classroomId}`);
			return response.data.data.classroom;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch classroom"
			);
		}
	}
);

export const createClassroom = createAsyncThunk(
	"classrooms/createClassroom",
	async (classroomData, { rejectWithValue }) => {
		try {
			const response = await api.post("/classrooms", classroomData);
			toast.success("Classroom created successfully");
			return response.data.data.classroom;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to create classroom"
			);
		}
	}
);

export const updateClassroom = createAsyncThunk(
	"classrooms/updateClassroom",
	async ({ id, classroomData }, { rejectWithValue }) => {
		try {
			const response = await api.patch(`/classrooms/${id}`, classroomData);
			toast.success("Classroom updated successfully");
			return response.data.data.classroom;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update classroom"
			);
		}
	}
);

export const deleteClassroom = createAsyncThunk(
	"classrooms/deleteClassroom",
	async (classroomId, { rejectWithValue }) => {
		try {
			await api.delete(`/classrooms/${classroomId}`);
			toast.success("Classroom deleted successfully");
			return classroomId;
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to delete classroom"
			);
			return rejectWithValue(
				error.response?.data?.message || "Failed to delete classroom"
			);
		}
	}
);

export const fetchActiveClassrooms = createAsyncThunk(
	"classrooms/fetchActiveClassrooms",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get("/classrooms", {
				params: { status: "active", limit: 100 },
			});
			return response.data.classrooms || [];
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch active classrooms"
			);
		}
	}
);

// Initial state
const initialState = {
	classrooms: [],
	classroom: null,
	activeClassrooms: [],
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalClassrooms: 0,
	},
	loading: false,
	error: null,
};

// Slice
const classroomSlice = createSlice({
	name: "classrooms",
	initialState,
	reducers: {
		clearClassroomError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch classrooms
			.addCase(fetchClassrooms.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClassrooms.fulfilled, (state, action) => {
				state.loading = false;
				state.classrooms = action.payload.classrooms || [];
				state.pagination = {
					currentPage: action.payload.currentPage || 1,
					totalPages: action.payload.totalPages || 1,
					totalClassrooms: action.payload.totalClassrooms || 0,
				};
			})
			.addCase(fetchClassrooms.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch classroom by ID
			.addCase(fetchClassroomById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClassroomById.fulfilled, (state, action) => {
				state.loading = false;
				state.classroom = action.payload;
			})
			.addCase(fetchClassroomById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Create classroom
			.addCase(createClassroom.fulfilled, (state, action) => {
				state.classrooms.unshift(action.payload);
				if (state.pagination.totalClassrooms) {
					state.pagination.totalClassrooms += 1;
				}
			})

			// Update classroom
			.addCase(updateClassroom.fulfilled, (state, action) => {
				const index = state.classrooms.findIndex(
					(classroom) => classroom.id === action.payload.id
				);
				if (index !== -1) {
					state.classrooms[index] = action.payload;
				}
				if (state.classroom && state.classroom.id === action.payload.id) {
					state.classroom = action.payload;
				}
			})

			// Delete classroom
			.addCase(deleteClassroom.fulfilled, (state, action) => {
				state.classrooms = state.classrooms.filter(
					(classroom) => classroom.id !== action.payload
				);
				if (state.pagination.totalClassrooms) {
					state.pagination.totalClassrooms -= 1;
				}
				if (state.classroom && state.classroom.id === action.payload) {
					state.classroom = null;
				}
			})

			// Fetch active classrooms
			.addCase(fetchActiveClassrooms.fulfilled, (state, action) => {
				state.activeClassrooms = action.payload;
			});
	},
});

// Selectors
export const selectClassrooms = (state) => state.classrooms.classrooms;
export const selectClassroom = (state) => state.classrooms.classroom;
export const selectActiveClassrooms = (state) =>
	state.classrooms.activeClassrooms;
export const selectClassroomsPagination = (state) =>
	state.classrooms.pagination;
export const selectClassroomsLoading = (state) => state.classrooms.loading;
export const selectClassroomsError = (state) => state.classrooms.error;

export const { clearClassroomError } = classroomSlice.actions;
export default classroomSlice.reducer;
