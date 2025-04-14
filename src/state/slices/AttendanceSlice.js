import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getShiftById } from "app/hooks/attendance";

// Define the initial state
const initialState = {
  assignedShiftData: [], // Updated property name
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
        console.log("Team DTR data:", action.payload);
      })
      // When the fetchShiftById thunk is rejected
      .addCase(fetchShiftById.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer and the fetchShiftById thunk
export default AttendanceSlice.reducer;
