import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getTerminationReason } from "app/hooks/employeeExitAndClearance";

// Define the initial state
const initialState = {
  TerminationReasons: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch task labels
export const fetchTerminationReasons = createAsyncThunk(
  "exit_emp/fetchTerminationReasons",
  async () => {
    try {
      const response = await getTerminationReason();
      return response.results;
    } catch (error) {
      throw error;
    }
  }
);

// Define the slice
const exitEmployeeSlice = createSlice({
  name: "exit_emp",
  initialState,
  reducers: {
    // Any synchronous actions can be added here
  },
  extraReducers: (builder) => {
    // Task Labels
    builder
      .addCase(fetchTerminationReasons.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchTerminationReasons.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.TerminationReasons = action.payload;
      })
      .addCase(fetchTerminationReasons.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default exitEmployeeSlice.reducer;
