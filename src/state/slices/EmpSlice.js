import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEmployeeList,getEmployeeListWithDetail,getManagersList } from "app/hooks/general";
import {
  getEmployeeData,
} from "app/hooks/employee";

// Define the initial state
const initialState = {
  employees: [],
  employees_detail: [],
  reportingManagers: [],
  user_details:{},
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch User
export const fetchUser = createAsyncThunk(
  "employees/fetchUser",
  async (userId) => {
    try {
      const response = await getEmployeeData(userId);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
// Define the thunk to fetch employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    try {
      const response = await getEmployeeList();
      return response;
    } catch (error) {
      throw error;
    }
  }
);
// Define the thunk to fetch employees details
export const fetchEmployeesDetail = createAsyncThunk(
  "employees/fetchEmployeesDetail",
  async () => {
    try {
      const response = await getEmployeeListWithDetail();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the thunk to fetch reporting managers
export const fetchReportingManagers = createAsyncThunk(
  "employees/fetchReportingManagers",
  async () => {
    try {
      const response = await getManagersList();
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
      // When the fetchUser thunk is pending
      .addCase(fetchUser.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the fetchUser thunk is fulfilled
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.user_details = action.payload;
      })
      // When the fetchUser thunk is rejected
      .addCase(fetchUser.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      })
      
      // When the fetchEmployeesDetail thunk is pending
      .addCase(fetchEmployeesDetail.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the fetchEmployeesDetail thunk is fulfilled
      .addCase(fetchEmployeesDetail.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.employees_detail = action.payload;
      })
      // When the fetchEmployeesDetail thunk is rejected
      .addCase(fetchEmployeesDetail.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      })
      
      // When the fetchEmployees thunk is pending
      .addCase(fetchEmployees.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the fetchEmployees thunk is fulfilled
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.employees = action.payload;
      })
      // When the fetchEmployees thunk is rejected
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      })
      // Reporting Managers
      .addCase(fetchReportingManagers.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchReportingManagers.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.reportingManagers = action.payload;
      })
      .addCase(fetchReportingManagers.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer and the fetchEmployees thunk
export default employeesSlice.reducer;
