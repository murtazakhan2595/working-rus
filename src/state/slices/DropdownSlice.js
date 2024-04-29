import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDbOpen: false,
  isRecruitmentOpen: false,
  isLeaveOpen: false,
  isProjectOpen: false,
  isProfileOpen: false
};

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {
    toggleDropdown(state, action) {
      const dropdownName = action.payload;
      switch (dropdownName) {
        case 'HRDatabase':
          state.isDbOpen = !state.isDbOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          break;
        case 'Recruitment':
          state.isRecruitmentOpen = !state.isRecruitmentOpen;
          state.isDbOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          break;
        case 'LeaveManagement':
          state.isLeaveOpen = !state.isLeaveOpen;
          state.isDbOpen = false;
          state.isRecruitmentOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          break;
        case 'Projects':
          state.isProjectOpen = !state.isProjectOpen;
          state.isProfileOpen = false;
          state.isDbOpen = false;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          break;
        case 'Profile':
          state.isProfileOpen = !state.isProfileOpen;
          state.isProjectOpen = false;
          state.isDbOpen = false;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          break;
        default:
          break;
      }
    }
  }
});

export const { toggleDropdown, isDbOpen, isRecruitmentOpen, isLeaveOpen, isProjectOpen, isProfileOpen } = dropdownSlice.actions;
export default dropdownSlice.reducer;
