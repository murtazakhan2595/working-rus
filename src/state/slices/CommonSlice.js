import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getDepartmentList,
  getDesignationList,
} from "app/hooks/general";

import { getLeaveTypes } from "app/hooks/leaveManagment";

// Define the initial state
const initialState = {
  departments: [],
  leaveTypes: [],
  designations: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch departments
export const fetchDepartments = createAsyncThunk(
  "common/fetchDepartments",
  async () => {
    try {
      const response = await getDepartmentList();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the thunk to fetch leave types
export const fetchLeaveTypes = createAsyncThunk(
  "common/fetchLeaveTypes",
  async () => {
    try {
      const response = await getLeaveTypes();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the thunk to fetch designations
export const fetchDesignations = createAsyncThunk(
  "common/fetchDesignations",
  async () => {
    try {
      const response = await getDesignationList();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the slice
const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    // Any synchronous actions can be added here
  },
  extraReducers: (builder) => {
    builder
      // Departments
      .addCase(fetchDepartments.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      })
      // Leave Types
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.leaveTypes = action.payload;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchDesignations.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.designations = action.payload;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default commonSlice.reducer;
