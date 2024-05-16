import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    tasks: [],
    apiStatus: 'idle',
    error: null,
};

// // Define the thunk to post multiple tasks
// export const postTasks = createAsyncThunk(
//     'tasks/postTasks',
//     async (formData, { getState }) => {
//         try {
//             const { token, baseUrl, userProfile } = getState().user; // Access token and userProfile from user slice
//             const { id } = userProfile; // Extract id from userProfile
//             const headers = {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             };

//             // Array to store promises for each POST request
//             const postPromises = formData.map(formData => {
//                 return axios.post(`${baseUrl}/dtr/`,
//                     {
//                         status: formData.taskStatus,
//                         priorty: formData.priority,
//                         date: new Date().toLocaleDateString(),
//                         // date: '07/05/2024',
//                         task: formData.title,
//                         // employee_id: id,
//                         employee_id: formData.assigne,
//                         // assigne: taskData.assigne,
//                         assigne: id,
//                         // task_start_date: null,
//                         task_end_date: null,
//                         task_start_date: formData.startDate,
//                         due_date: formData.dueDate,
//                         task_details: formData.taskDetails,
//                         Type: formData.taskType,
//                         total_task_days: null,
//                     }
//                     , { headers });
//             });

//             // Use Promise.all to wait for all POST requests to complete
//             const responses = await Promise.all(postPromises);

//             // Extract data from responses if needed
//             const responseData = responses.map(response => response.data);

//             // Return the response data
//             return responseData;
//         } catch (error) {
//             throw error;
//         }
//     }
// );

// // Define the slice
// const tasksSlice = createSlice({
//     name: 'tasks',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             // When the postTasks thunk is pending
//             .addCase(postTasks.pending, (state) => {
//                 state.apiStatus = 'loading';
//             })
//             // When the postTasks thunk is fulfilled
//             .addCase(postTasks.fulfilled, (state, action) => {
//                 state.apiStatus = 'succeeded';
//                 state.tasks = action.payload;
//                 console.log('Tasks data:', action.payload);
//             })
//             // When the postTasks thunk is rejected
//             .addCase(postTasks.rejected, (state, action) => {
//                 state.apiStatus = 'failed';
//                 state.error = action.error.message;
//             });
//     },
// });

// // Export the reducer and the postTasks thunk
// export default tasksSlice.reducer;



// Define the thunk to post a single task
export const postTasks = createAsyncThunk(
    'tasks/postTask',
    async (formData, { getState }) => {
        try {
            const { token, baseUrl, userProfile } = getState().user;
            const { id } = userProfile;
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Post a single task directly
            const response = await axios.post(`${baseUrl}/dtr/`,
                {
                    status: formData.taskStatus,
                    priorty: formData.priorty,
                    date: new Date().toLocaleDateString(),
                    task: formData.title,
                    employee_id: formData.assigne,
                    assigne: id,
                    task_start_date: formData.startDate,
                    due_date: formData.dueDate,
                    task_details: formData.taskDetails,
                    Type: formData.taskType,
                    total_task_days: null,
                }
                , { headers });

            // Extract data from response if needed
            const responseData = response.data;

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
            // When the postTask thunk is pending
            .addCase(postTasks.pending, (state) => {
                state.apiStatus = 'loading';
            })
            // When the postTask thunk is fulfilled
            .addCase(postTasks.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.tasks.push(action.payload); // Push the new task to the tasks array
                console.log('Task data:', action.payload);
            })
            // When the postTask thunk is rejected
            .addCase(postTasks.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer and the postTask thunk
export default tasksSlice.reducer;
