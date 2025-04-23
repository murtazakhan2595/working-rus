import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getTerminationReason } from "app/hooks/employeeExitAndClearance";
import { initialState as userInitialState } from './UserSlice';

const baseUrl = userInitialState.baseUrl;

// Define the initial state
const initialState = {
  TerminationReasons: [],
  exitRequests: [],
  apiStatus: "idle",
  loading: false,
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

// Async thunk for fetching employee exit data
export const fetchEmployeeExitRequests = createAsyncThunk(
  'exit_emp/fetchEmployeeExitRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/employeeExit`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      
      if (response.status === 200) {
        const results = response.data.results?.result || [];
        return results;
      } else {
        return rejectWithValue('Failed to fetch exit requests');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Define the slice
const exitEmployeeSlice = createSlice({
  name: "exit_emp",
  initialState,
  reducers: {
    clearExitRequests: (state) => {
      state.exitRequests = [];
    }
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
      })
      // Employee Exit Requests
      .addCase(fetchEmployeeExitRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeExitRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.exitRequests = action.payload;
      })
      .addCase(fetchEmployeeExitRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearExitRequests } = exitEmployeeSlice.actions;
// Export the reducer
export default exitEmployeeSlice.reducer;
