import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAllLabels } from "app/hooks/taskManagment";

// Define the initial state
const initialState = {
  task_labels: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch task labels
export const fetchTaskLabels = createAsyncThunk(
  "task_managment/fetchTaskLabels",
   async (projectId) => {
    try {
      const response = await getAllLabels(projectId);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the slice
const taskManagmentSlice = createSlice({
  name: "task_managment",
  initialState,
  reducers: {
    // Any synchronous actions can be added here
  },
  extraReducers: (builder) => {
    // Task Labels
    builder
      .addCase(fetchTaskLabels.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchTaskLabels.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.task_labels = action.payload;
      })
      .addCase(fetchTaskLabels.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default taskManagmentSlice.reducer;
