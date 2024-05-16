import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    teamDtrs: [],
    apiStatus: 'idle',
    error: null,
};

// Define the thunk to fetch DTR by employee ID
export const fetchDTRByManagerId = createAsyncThunk(
    'dtr/fetchDTRByManagerId',
    async (_, { getState }) => {
        try {
            const { token, baseUrl, userProfile } = getState().user;
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            // Modify the URL to include query parameters for employee ID
            const response = await axios.get(`${baseUrl}/dtr/?search={"employee_id":[${userProfile?.id}]}`, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Define the slice
const dtrManagerSlice = createSlice({
    name: 'dtr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // When the fetchDTRByManagerId thunk is pending
            .addCase(fetchDTRByManagerId.pending, (state) => {
                state.apiStatus = 'loading';
            })
            // When the fetchDTRByManagerId thunk is fulfilled
            .addCase(fetchDTRByManagerId.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.dtr = action.payload;
                console.log('Fetched DTR:', action.payload);
            })
            // When the fetchDTRByManagerId thunk is rejected
            .addCase(fetchDTRByManagerId.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer and the fetchDTRByManagerId thunk
export default dtrManagerSlice.reducer;
