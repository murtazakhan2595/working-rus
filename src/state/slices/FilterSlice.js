import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: false,
  department: false,
  date: false,
  priority: false,
  status: false,
  type: false,
  assignes: false,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleFilter: (state, action) => {
      const { filterName, value } = action.payload;
      state[filterName] = value;
    },
  },
});

export const { toggleFilter } = filterSlice.actions;

export default filterSlice.reducer;
