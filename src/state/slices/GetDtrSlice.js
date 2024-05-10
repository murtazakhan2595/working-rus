import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    dtr: null,
    apiStatus: 'idle',
    error: null,
};

// Define the thunk to fetch DTR by employee ID
export const fetchDTRByEmployeeId = createAsyncThunk(
    'dtr/fetchDTRByEmployeeId',
    async (employeeId, { getState }) => {
        try {
            const { token, baseUrl } = getState().user;
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            // Modify the URL to include query parameters for employee ID
            const response = await axios.get(`${baseUrl}/dtr/?search={"Employee_id":${employeeId}}`, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Define the slice
const dtrSlice = createSlice({
    name: 'dtr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // When the fetchDTRByEmployeeId thunk is pending
            .addCase(fetchDTRByEmployeeId.pending, (state) => {
                state.apiStatus = 'loading';
            })
            // When the fetchDTRByEmployeeId thunk is fulfilled
            .addCase(fetchDTRByEmployeeId.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.dtr = action.payload;
                console.log('Fetched DTR:', action.payload);
            })
            // When the fetchDTRByEmployeeId thunk is rejected
            .addCase(fetchDTRByEmployeeId.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer and the fetchDTRByEmployeeId thunk
export default dtrSlice.reducer;
