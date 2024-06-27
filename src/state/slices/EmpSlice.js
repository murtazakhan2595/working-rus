import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEmployeeList } from "app/hooks/general";
import axios from "axios";

// Define the initial state
const initialState = {
  employees: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, {  }) => {
    try {
      const response = await getEmployeeList();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the slice
const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the fetchEmployees thunk is pending
      .addCase(fetchEmployees.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the fetchEmployees thunk is fulfilled
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.employees = action.payload;
        console.log("Employees data:", action.payload);
      })
      // When the fetchEmployees thunk is rejected
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer and the fetchEmployees thunk
export default employeesSlice.reducer;
