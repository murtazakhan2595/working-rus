import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLeaveComponents } from "app/hooks/leaveTracker";

// Define the initial state
const initialState = {
  leave_components: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch Leave Components
export const fetchLeaveComponents = createAsyncThunk(
  "leave_management/fetchLeaveComponents",
  async () => {
    try {
      const response = await getLeaveComponents({
        filterData: { status: true },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the slice
const leaveManagementSlice = createSlice({
  name: "leave_management",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the postTask thunk is pending
      .addCase(fetchLeaveComponents.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the postTask thunk is fulfilled
      .addCase(fetchLeaveComponents.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.leave_components = action.payload;
      })
      // When the postTask thunk is rejected
      .addCase(fetchLeaveComponents.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer and the postTask thunk
export default leaveManagementSlice.reducer;
