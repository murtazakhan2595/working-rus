import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocumentCategoryList } from "app/hooks/hrDocuments";

// Define the initial state
const initialState = {
  category: [],
  apiStatus: "idle",
  error: null,
};

// Define the thunk to fetch User
export const fetchDocumentCategory = createAsyncThunk(
  "category/fetchDocumentCategory",
  async () => {
    try {
      const response = await getDocumentCategoryList();
      return response.results||[];
    } catch (error) {
      throw error;
    }
  }
);

// Define the slice
const HRDocumentsSlice = createSlice({
  name: "doc_category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the fetchDocumentCategory thunk is pending
      .addCase(fetchDocumentCategory.pending, (state) => {
        state.apiStatus = "loading";
      })
      // When the fetchDocumentCategory thunk is fulfilled
      .addCase(fetchDocumentCategory.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.category = action.payload;
      })
      // When the fetchDocumentCategory thunk is rejected
      .addCase(fetchDocumentCategory.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer and the fetchEmployees thunk
export default HRDocumentsSlice.reducer;
