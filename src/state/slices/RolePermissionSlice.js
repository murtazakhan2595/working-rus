import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getDesignationList,
  getProjectsList,
  getOrganizationList,
  getBranchList,
} from "app/hooks/general";
import { getModuleList } from "app/hooks/rolesPermisions";

// Define the initial state
const initialState = {
  modules: [],
  projects: [],
  designations: [],
  branches: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch organizations
export const fetchOrganizations = createAsyncThunk(
  "roles_permissions/fetchOrganizations",
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
  "roles_permissions/fetchBranches",
  async () => {
    try {
      const response = await getBranchList();
      return response?.results || [];
    } catch (error) {
      throw error;
    }
  }
);

// Define the thunk to fetch modules
export const fetchModules = createAsyncThunk(
  "roles_permissions/fetchModules",
  async () => {
    try {
      const response = await getModuleList();
      return response?.results || [];
    } catch (error) {
      throw error;
    }
  }
);
// Define the thunk to fetch projects
export const fetchProjects = createAsyncThunk(
  "roles_permissions/fetchProjects",
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
  "roles_permissions/fetchDesignations",
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
const RolePermissionSlice = createSlice({
  name: "roles_permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Modules
      .addCase(fetchModules.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
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

// Export the reducer
export default RolePermissionSlice.reducer;
