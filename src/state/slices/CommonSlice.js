import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDepartmentList } from "app/hooks/general";
import { getLeaveTypes } from 'app/hooks/leaveManagment';

// Define the initial state
const initialState = {
    departments: [],
    leaveTypes: [],
    apiStatus: 'idle',
    error: null,
};

// Define the thunk to fetch departments
export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments',
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
    'departments/fetchLeaveTypes',
    async () => {
        try {
            const response = await getLeaveTypes();
            return response;
        } catch (error) {
            throw error;
        }
    }
);

// Define the slice
const commonSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        // Any synchronous actions can be added here
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.apiStatus = 'loading';
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.departments = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchLeaveTypes.pending, (state) => {
                state.apiStatus = 'loading';
            })
            .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.leaveTypes = action.payload;
            })
            .addCase(fetchLeaveTypes.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer
export default commonSlice.reducer;
