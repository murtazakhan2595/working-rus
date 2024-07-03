import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    teamDtr: [], // Updated property name
    apiStatus: 'idle',
    error: null,
};

// Define the thunk to fetch teamDtr
export const fetchTeamDtr = createAsyncThunk(
    'dtrs/fetchTeamDtr', // Updated action type
    async (_, { getState }) => {
        try {
            const { token, baseUrl, userProfile } = getState().user;
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            const response = await axios.get(`${baseUrl}/dtr/?search={"assigne":[${userProfile?.id}]}`, { headers });
             console.log('testing team dtrs', response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Define the slice
const teamDtrSlice = createSlice({
    name: 'teamDtr', // Updated slice name
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // When the fetchTeamDtr thunk is pending
            .addCase(fetchTeamDtr.pending, (state) => {
                state.apiStatus = 'loading';
            })
            // When the fetchTeamDtr thunk is fulfilled
            .addCase(fetchTeamDtr.fulfilled, (state, action) => {
                state.apiStatus = 'succeeded';
                state.teamDtr = action.payload;
                console.log('Team DTR data:', action.payload);
            })
            // When the fetchTeamDtr thunk is rejected
            .addCase(fetchTeamDtr.rejected, (state, action) => {
                state.apiStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer and the fetchTeamDtr thunk
export default teamDtrSlice.reducer;
