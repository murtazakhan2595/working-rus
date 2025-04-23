import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { initialState as userInitialState } from './UserSlice';

const baseUrl = userInitialState.baseUrl;

// Async thunk for fetching employee exit data
export const fetchEmployeeExitRequests = createAsyncThunk(
  'exitAndClearance/fetchEmployeeExitRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/employeeExit`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      
      if (response.status === 200) {
        return response.data.results?.result || [];
      } else {
        return rejectWithValue('Failed to fetch exit requests');
      }
    } catch (error) {
      console.error("Error fetching employee exit data:", error);
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const exitAndClearanceSlice = createSlice({
  name: 'exitAndClearance',
  initialState: {
    exitRequests: [],
    loading: false,
    error: null
  },
  reducers: {
    clearExitRequests: (state) => {
      state.exitRequests = [];
    }
  },
  extraReducers: (builder) => {
    builder
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
  }
});

export const { clearExitRequests } = exitAndClearanceSlice.actions;
export default exitAndClearanceSlice.reducer; 