import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getDepartmentList,
  getDesignationList,
  getProjectsList,
  getOrganizationList,
  getBranchList,
} from "app/hooks/general";

// Define the initial state
const initialState = {
  departments: [],
  projects: [],
  designations: [],
  branches: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch organizations
export const fetchOrganizations = createAsyncThunk(
  "common/fetchOrganizations",
  async () => {
    try {
      const response = await getOrganizationList();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Define the thunk to fetch branches
export const fetchBranches = createAsyncThunk(
  "common/fetchBranches",
  async () => {
    try {
      const response = await getBranchList();
      return response?.results||[];
    } catch (error) {
      throw error;
    }
  }
);

// Define the thunk to fetch departments
export const fetchDepartments = createAsyncThunk(
  "common/fetchDepartments",
  async () => {
    try {
      const response = await getDepartmentList();
      return response?.results || [];
    } catch (error) {
      throw error;
    }
  }
);
// Define the thunk to fetch projects
export const fetchProjects = createAsyncThunk(
  "common/fetchProjects",
  async (userProfile) => {
    try {
      const response = await getProjectsList(userProfile);
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
      return response?.results || [];
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
    // Add a reducer to set departments directly
    setDepartments: (state, action) => {
      state.departments = action.payload;
    }
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
      // Projects
      .addCase(fetchProjects.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
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
    // Organizations
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });

    // Branches
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { setDepartments } = commonSlice.actions;

// Export the reducer
export default commonSlice.reducer;
