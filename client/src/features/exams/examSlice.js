import {
	createSlice,
	createAsyncThunk,
	createSelector,
} from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const fetchExams = createAsyncThunk(
	"exams/fetchExams",
	async (params = {}, { rejectWithValue }) => {
		try {
			const response = await api.get("/exams", { params });
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch exams"
			);
		}
	}
);

export const fetchExamById = createAsyncThunk(
	"exams/fetchExamById",
	async (examId, { rejectWithValue }) => {
		try {
			const response = await api.get(`/exams/${examId}`);
			return response.data.data.exam;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch exam"
			);
		}
	}
);

export const createExam = createAsyncThunk(
	"exams/createExam",
	async (examData, { rejectWithValue }) => {
		try {
			const response = await api.post("/exams", examData);
			toast.success("Exam created successfully");
			return response.data.data.exam;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to create exam"
			);
		}
	}
);

export const updateExam = createAsyncThunk(
	"exams/updateExam",
	async ({ id, examData }, { rejectWithValue }) => {
		try {
			const response = await api.patch(`/exams/${id}`, examData);
			toast.success("Exam updated successfully");
			return response.data.data.exam;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update exam"
			);
		}
	}
);

export const deleteExam = createAsyncThunk(
	"exams/deleteExam",
	async (examId, { rejectWithValue }) => {
		try {
			await api.delete(`/exams/${examId}`);
			toast.success("Exam deleted successfully");
			return examId;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to delete exam"
			);
		}
	}
);

export const updateExamStatus = createAsyncThunk(
	"exams/updateExamStatus",
	async ({ examId, status }, { rejectWithValue }) => {
		try {
			const response = await api.patch(`/exams/${examId}/status`, { status });
			toast.success(`Exam status updated to ${status}`);
			return response.data.data.exam;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update exam status"
			);
		}
	}
);

export const fetchUpcomingExams = createAsyncThunk(
	"exams/fetchUpcomingExams",
	async (params = {}, { rejectWithValue }) => {
		try {
			const queryParams = {
				...params,
				status: "scheduled",
				sortBy: "date",
				sortOrder: "ASC",
			};
			const response = await api.get("/exams", { params: queryParams });
			return response.data.data.exams;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch upcoming exams"
			);
		}
	}
);

export const fetchMonthlyExamStats = createAsyncThunk(
	"exams/fetchMonthlyExamStats",
	async (year, { rejectWithValue }) => {
		try {
			const response = await api.get("/stats/monthly-exams", {
				params: { year },
			});
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch monthly exam stats"
			);
		}
	}
);

// Initial state
const initialState = {
	exams: [],
	exam: null,
	upcomingExams: [],
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalExams: 0,
	},
	monthlyStats: {
		labels: [],
		data: [],
		loading: false,
	},
	loading: false,
	error: null,
};

// Slice
const examSlice = createSlice({
	name: "exams",
	initialState,
	reducers: {
		clearExamError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch exams
			.addCase(fetchExams.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchExams.fulfilled, (state, action) => {
				state.loading = false;
				state.exams = action.payload.exams;
				state.pagination = {
					currentPage: action.payload.currentPage,
					totalPages: action.payload.totalPages,
					totalExams: action.payload.totalExams,
				};
			})
			.addCase(fetchExams.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch exam by ID
			.addCase(fetchExamById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchExamById.fulfilled, (state, action) => {
				state.loading = false;
				state.exam = action.payload;
			})
			.addCase(fetchExamById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Create exam
			.addCase(createExam.fulfilled, (state, action) => {
				state.exams.unshift(action.payload);
				if (state.pagination.totalExams) {
					state.pagination.totalExams += 1;
				}
			})

			// Update exam
			.addCase(updateExam.fulfilled, (state, action) => {
				const index = state.exams.findIndex(
					(exam) => exam.id === action.payload.id
				);
				if (index !== -1) {
					state.exams[index] = action.payload;
				}
				if (state.exam && state.exam.id === action.payload.id) {
					state.exam = action.payload;
				}
			})

			// Delete exam
			.addCase(deleteExam.fulfilled, (state, action) => {
				state.exams = state.exams.filter((exam) => exam.id !== action.payload);
				if (state.pagination.totalExams) {
					state.pagination.totalExams -= 1;
				}
				if (state.exam && state.exam.id === action.payload) {
					state.exam = null;
				}
			})

			// Update exam status
			.addCase(updateExamStatus.fulfilled, (state, action) => {
				const index = state.exams.findIndex(
					(exam) => exam.id === action.payload.id
				);
				if (index !== -1) {
					state.exams[index] = action.payload;
				}
				if (state.exam && state.exam.id === action.payload.id) {
					state.exam = action.payload;
				}
			})

			// Fetch upcoming exams
			.addCase(fetchUpcomingExams.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUpcomingExams.fulfilled, (state, action) => {
				state.loading = false;
				state.upcomingExams = action.payload;
			})
			.addCase(fetchUpcomingExams.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch monthly exam stats
			.addCase(fetchMonthlyExamStats.pending, (state) => {
				state.monthlyStats.loading = true;
			})
			.addCase(fetchMonthlyExamStats.fulfilled, (state, action) => {
				state.monthlyStats.loading = false;
				state.monthlyStats.labels = action.payload.labels;
				state.monthlyStats.data = action.payload.data;
			})
			.addCase(fetchMonthlyExamStats.rejected, (state) => {
				state.monthlyStats.loading = false;
			});
	},
});

// Selectors
export const selectExams = (state) => state.exams.exams;
export const selectExam = (state) => state.exams.exam;
export const selectExamsPagination = (state) => state.exams.pagination;
export const selectExamsLoading = (state) => state.exams.loading;
export const selectExamsError = (state) => state.exams.error;

export const selectUpcomingExams = createSelector(
	[(state) => state.exams.upcomingExams, (state) => state.exams.loading],
	(upcomingExams, loading) => ({
		upcomingExams,
		loading,
	})
);

export const selectMonthlyStats = (state) => state.exams.monthlyStats;

export const { clearExamError } = examSlice.actions;
export default examSlice.reducer;
