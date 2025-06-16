import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  leave_components: [],
  apiStatus: "idle",
  error: null,
};


// Define the slice
const leaveManagementSlice = createSlice({
  name: "leave_management",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

  },
});

// Export the reducer and the postTask thunk
export default leaveManagementSlice.reducer;
