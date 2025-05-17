import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getOrganizationList } from "app/hooks/general";
import {
  getModuleList,
  getUserRoleList,
  getMyEffectivePermissions,
} from "app/hooks/rolesPermisions";
import {
  FilterTreeBySelectedLeafs,
  ExtractFieldValueFromList,
} from "utils/Lists";

// Define the initial state
const initialState = {
  modules: [],
  user_roles: [],
  my_permissions: [],
  user_permitted_modules: [],
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

// Define the thunk to fetch user_permitted_modules
export const fetchUserPermittedModules = createAsyncThunk(
  "roles_permissions/fetchUserPermittedModules",
  async ({ modules, permissions }) => {
    try {
      const UserPermittedModules = FilterTreeBySelectedLeafs(
        { code_name: null, childrens: modules },
        permissions,
        "code_name"
      );
      return UserPermittedModules?.childrens || [];
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
      const ModulesList = response?.results || [];
      const ModuleTree = ModulesList.map((module) => ({
        id: module.id,
        name: module.name,
        code_name: module.code_name,
        childrens: (module.submodules || []).map((submodule) => ({
          id: submodule.id,
          name: submodule.name,
          code_name: submodule.code_name,
          childrens: (submodule.features || []).map((feature) => ({
            ...feature,
          })),
        })),
      }));
      return ModuleTree || [];
    } catch (error) {
      throw error;
    }
  }
);
// Define the thunk to fetch user_roles
export const fetchUserRoles = createAsyncThunk(
  "roles_permissions/fetchUserRoles",
  async () => {
    try {
      const response = await getUserRoleList({
        filterData: { status: "active" },
      });
      const UserRoles = response.results;
      return UserRoles || [];
    } catch (error) {
      throw error;
    }
  }
);

// Define the thunk to fetch my_permissions
export const fetchMyPermissions = createAsyncThunk(
  "roles_permissions/fetchMyPermissions",
  async () => {
    try {
      const response = await getMyEffectivePermissions();
      const Permissions = response?.results || [];
      const MyPermissionsList = ExtractFieldValueFromList(
        Permissions,
        "code_name"
      );
      return MyPermissionsList || [];
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
      .addCase(fetchUserRoles.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.user_roles = action.payload;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchMyPermissions.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchMyPermissions.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.my_permissions = action.payload;
      })
      .addCase(fetchMyPermissions.rejected, (state, action) => {
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
      .addCase(fetchUserPermittedModules.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchUserPermittedModules.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.user_permitted_modules = action.payload;
      })
      .addCase(fetchUserPermittedModules.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default RolePermissionSlice.reducer;
