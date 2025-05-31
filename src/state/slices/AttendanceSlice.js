import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getShiftById,
  getEmployeeAttendanceDetails,
} from "app/hooks/attendance";

// Define the initial state
const initialState = {
  assignedShiftData: [], // Updated property name
  attendance_details: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch AssignedShiftData
export const fetchShiftById = createAsyncThunk(
  "attendance/fetchShiftById", // Updated action type
  async (shiftID) => {
    try {
      const response = await getShiftById(shiftID);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
// Define the thunk to fetch AssignedShiftData
export const fetchUserAttendanceDetails = createAsyncThunk(
  "attendance/fetchUserAttendanceDetails", // Updated action type
  async (user_id) => {
    try {
      const response = await getEmployeeAttendanceDetails(user_id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the slice
const AttendanceSlice = createSlice({
  name: "attendance", // Updated slice name
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the fetchShiftById thunk is pending
      .addCase(fetchShiftById.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the fetchShiftById thunk is fulfilled
      .addCase(fetchShiftById.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.assignedShiftData = action.payload;
      })
      // When the fetchShiftById thunk is rejected
      .addCase(fetchShiftById.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserAttendanceDetails.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the fetchShiftById thunk is fulfilled
      .addCase(fetchUserAttendanceDetails.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.attendance_details = action.payload;
      })
      // When the fetchShiftById thunk is rejected
      .addCase(fetchUserAttendanceDetails.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer and the fetchShiftById thunk
export default AttendanceSlice.reducer;
