import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEmployeeTransferList,
  getEmployeeListWithDetail,
  getManagersList,
} from "app/hooks/employeeTransfer";

// Define the initial state
const initialState = {
  employees_pending_tranfer: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch User
export const fetchEmployeeTransfers = createAsyncThunk(
  "emp_tranfers/fetchEmployeeTransfers",
  async (userId) => {
    try {
      const response = await getEmployeeTransferList({filterData:{status:"ACCEPTED BY MANAGER,PENDING"}});
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the slice
const employeesTranferSlice = createSlice({
  name: "emp_tranfers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the fetchEmployeeTransfers thunk is pending
      .addCase(fetchEmployeeTransfers.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the fetchEmployeeTransfers thunk is fulfilled
      .addCase(fetchEmployeeTransfers.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.employees_pending_tranfer = action.payload;
      })
      // When the fetchEmployeeTransfers thunk is rejected
      .addCase(fetchEmployeeTransfers.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      })

  },
});

// Export the reducer and the fetchEmployees thunk
export default employeesTranferSlice.reducer;
