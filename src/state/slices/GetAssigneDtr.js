import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    assigneDtr: null,
    apiStatus: 'idle',
    error: null,
};

// Define the thunk to fetch DTR by employee ID
export const GetAssigneDtr = createAsyncThunk(
    'assigneDtr/GetAssigneDtr',
    async (assigneId, status, { getState }) => {
        try {
            const { token, baseUrl } = getState().user;
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            // Modify the URL to include query parameters for employee ID
            const response = await axios.get(`${baseUrl}/dtr/?search={"assigne": [${assigneId}], "status": "${status}"}`, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Define the slice
const dtrSlice = createSlice({
    name: 'assigneDtr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // When the GetAssigneDtr thunk is pending
            .addCase(GetAssigneDtr.pending, (state) => {
                state.apiStatus = 'loading';
            })
            // When the GetAssigneDtr thunk is fulfilled
            .addCase(GetAssigneDtr.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.assigneDtr = action.payload;
                console.log('Fetched DTR:', action.payload);
            })
            // When the GetAssigneDtr thunk is rejected
            .addCase(GetAssigneDtr.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer and the GetAssigneDtr thunk
export default dtrSlice.reducer;
