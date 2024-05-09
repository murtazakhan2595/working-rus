import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    tasks: [],
    apiStatus: 'idle',
    error: null,
};

// Define the thunk to update a single task
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (taskData, { getState }) => {
        try {
            const { token } = getState().user; // Access token from user slice
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Update the task using axios.put
            const response = await axios.put(`https://hrms-1886226759.eu-west-1.elb.amazonaws.com:8080/api/dtr/${taskData.id}`, taskData, { headers });

            // Return the updated task data
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Define the slice
const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // When the updateTask thunk is pending
            .addCase(updateTask.pending, (state) => {
                state.apiStatus = 'loading';
            })
            // When the updateTask thunk is fulfilled
            .addCase(updateTask.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                console.log('Updated task:', action.payload);
            })
            // When the updateTask thunk is rejected
            .addCase(updateTask.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer and the updateTask thunk
export default tasksSlice.reducer;
