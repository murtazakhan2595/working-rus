import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getTerminationReason } from "app/hooks/employeeExitAndClearance";
import { initialState as userInitialState } from './UserSlice';

const baseUrl = userInitialState.baseUrl;

// Define the initial state
const initialState = {
  TerminationReasons: [],
  exitRequests: [],
  count: 0, // Add count for pagination
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

// Helper function to build query string from filters
const buildQueryString = (options, filterData, ordering) => {
  const params = new URLSearchParams();

  // Add pagination parameters
  if (options) {
    params.append('page', options.page);
    params.append('page_size', options.sizePerPage);
  }

  // Add ordering
  if (ordering) {
    console.log("Adding ordering parameter:", ordering);
    params.append('ordering', ordering);
  }

  // Add filter parameters
  if (filterData) {
    Object.entries(filterData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        console.log(`Adding filter parameter: ${key}=${value}`);
        params.append(key, value);
      }
    });
  }

  const queryString = params.toString();
  console.log("Final query string:", queryString);
  return queryString;
};

// Async thunk for fetching employee exit data
export const fetchEmployeeExitRequests = createAsyncThunk(
  'exit_emp/fetchEmployeeExitRequests',
  async ({ options, filterData, ordering } = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(options, filterData, ordering);
      const url = `${baseUrl}/employeeExit${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching URL:', url); // For debugging
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      
      if (response.status === 200) {
        // Assuming the API returns { count: number, results: array }
        return {
          results: response.data.results?.result || [],
          count: response.data.count || 0
        };
      } else {
        return rejectWithValue('Failed to fetch exit requests');
      }
    } catch (error) {
      console.error('API Error details:', error.response || error);
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
      state.count = 0;
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
        state.exitRequests = action.payload.results;
        state.count = action.payload.count;
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
