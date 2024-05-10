import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    tasks: [],
    apiStatus: 'idle',
    error: null,
};

// Define the thunk to post multiple tasks
export const postTasks = createAsyncThunk(
    'tasks/postTasks',
    async (tasksData, { getState }) => {
        try {
            const { token, baseUrl, userProfile } = getState().user; // Access token and userProfile from user slice
            const { id } = userProfile; // Extract id from userProfile
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Array to store promises for each POST request
            const postPromises = tasksData.map(taskData => {
                return axios.post(`${baseUrl}/dtr/`,
                    {
                        status: taskData.taskStatus,
                        priorty: taskData.priority,
                        date: new Date().toLocaleDateString(),
                        // date: '07/05/2024',
                        task: taskData.title,
                        // employee_id: id,
                        employee_id: taskData.assigne,
                        // assigne: taskData.assigne,
                        assigne: id,
                        // task_start_date: null,
                        task_end_date: null,
                        task_start_date: taskData.startDate,
                        due_date: taskData.dueDate,
                        task_details: taskData.taskDetails,
                        Type: taskData.taskType,
                        total_task_days: 10
                    }
                    , { headers });
            });

            // Use Promise.all to wait for all POST requests to complete
            const responses = await Promise.all(postPromises);

            // Extract data from responses if needed
            const responseData = responses.map(response => response.data);

            // Return the response data
            return responseData;
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
            // When the postTasks thunk is pending
            .addCase(postTasks.pending, (state) => {
                state.apiStatus = 'loading';
            })
            // When the postTasks thunk is fulfilled
            .addCase(postTasks.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.tasks = action.payload;
                console.log('Tasks data:', action.payload);
            })
            // When the postTasks thunk is rejected
            .addCase(postTasks.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer and the postTasks thunk
export default tasksSlice.reducer;
