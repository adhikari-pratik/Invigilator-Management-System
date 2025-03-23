import {
	createSlice,
	createAsyncThunk,
	createSelector,
} from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchSystemStats = createAsyncThunk(
	"stats/fetchSystemStats",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get("/stats/system");
			return response.data.data.stats;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch system statistics"
			);
		}
	}
);

export const fetchInvigilatorStats = createAsyncThunk(
	"stats/fetchInvigilatorStats",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get("/stats/invigilator");
			return response.data.data.stats;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					"Failed to fetch invigilator statistics"
			);
		}
	}
);

// Initial state
const initialState = {
	systemStats: null,
	invigilatorStats: null,
	loading: false,
	error: null,
};

// Slice
const statsSlice = createSlice({
	name: "stats",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch system stats
			.addCase(fetchSystemStats.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSystemStats.fulfilled, (state, action) => {
				state.loading = false;
				state.systemStats = action.payload;
			})
			.addCase(fetchSystemStats.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch invigilator stats
			.addCase(fetchInvigilatorStats.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchInvigilatorStats.fulfilled, (state, action) => {
				state.loading = false;
				state.invigilatorStats = action.payload;
			})
			.addCase(fetchInvigilatorStats.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

// Selectors
export const selectSystemStats = (state) => state.stats.systemStats;
export const selectInvigilatorStats = (state) => state.stats.invigilatorStats;
export const selectStatsLoading = (state) => state.stats.loading;
export const selectStatsError = (state) => state.stats.error;

export const selectStats = createSelector(
	[
		selectSystemStats,
		selectInvigilatorStats,
		selectStatsLoading,
		selectStatsError,
	],
	(systemStats, invigilatorStats, loading, error) => ({
		systemStats,
		invigilatorStats,
		loading,
		error,
	})
);

export default statsSlice.reducer;
