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
      console.log("Making API request to:", `${baseUrl}/employeeExit`);
      console.log("With headers:", {
        Authorization: `Bearer ${localStorage.getItem("token") ? 'TOKEN_EXISTS' : 'NO_TOKEN'}`,
        "Content-Type": "application/json",
      });
      
      const response = await axios.get(`${baseUrl}/employeeExit`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      
      console.log("API Response status:", response.status);
      console.log("API Response data:", response.data);
      
      // Detailed logging of the results
      if (response.data && response.data.results) {
        console.log("---------------------------------------------");
        console.log("📊 EMPLOYEE EXIT API RESULTS SUMMARY 📊");
        console.log("---------------------------------------------");
        console.log("Total count:", response.data.count || 'Not available');
        
        if (response.data.results.result) {
          const results = response.data.results.result;
          console.log("Total results:", results.length);
          console.log("First result:", results[0]);
          
          // Count by status
          const statusCounts = results.reduce((acc, item) => {
            const status = item.status_resignation || item.status_termination || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          
          console.log("Results by status:", statusCounts);
        } else {
          console.log("No results array found in the response");
        }
        console.log("---------------------------------------------");
      }
      
      console.log("API Response structure:", {
        hasResults: !!response.data.results,
        hasResultsArray: Array.isArray(response.data.results?.result),
        resultCount: response.data.results?.result?.length || 0
      });
      
      if (response.status === 200) {
        const results = response.data.results?.result || [];
        console.log("Parsed results (first 2 items):", results.slice(0, 2));
        return results;
      } else {
        console.error("API returned non-200 status:", response.status);
        return rejectWithValue('Failed to fetch exit requests');
      }
    } catch (error) {
      console.error("Error fetching employee exit data:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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
