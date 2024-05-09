// modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  isEmpDropdownOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: state => {
      state.isModalOpen = true;
    },
    closeModal: state => {
      state.isModalOpen = false;
    },
    openEmpDropdown: state => {
      state.isEmpDropdownOpen = !state.isEmpDropdownOpen;
    },
    closeEmpDropdown: state => {
      state.isEmpDropdownOpen = false;
    },
  },
});

export const { openModal, closeModal, openEmpDropdown, closeEmpDropdown } = modalSlice.actions;
export default modalSlice.reducer;
