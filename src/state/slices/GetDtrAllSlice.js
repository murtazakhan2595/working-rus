import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    dtrs: [],
    apiStatus: 'idle',
    error: null,
};

// Define the thunk to fetch dtrs
export const getDTRAll = createAsyncThunk(
    'dtrs/getDTRAll',
    async (_, { getState }) => {
        try {
            const { token } = getState().user;
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            const response = await axios.get('https://hrms-1886226759.eu-west-1.elb.amazonaws.com:8080/api/dtr/', { headers });
             console.log('testing all dtrs', response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Define the slice
const dtrAll = createSlice({
    name: 'dtrAll',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // When the getDTRAll thunk is pending
            .addCase(getDTRAll.pending, (state) => {
                state.apiStatus = 'loading';
            })
            // When the getDTRAll thunk is fulfilled
            .addCase(getDTRAll.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.dtrs = action.payload;
                console.log('Employees data:', action.payload);
            })
            // When the getDTRAll thunk is rejected
            .addCase(getDTRAll.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer and the getDTRAll thunk
export default dtrAll.reducer;
