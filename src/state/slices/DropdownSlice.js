import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDbOpen: false,
  isRecruitmentOpen: false,
  isLeaveOpen: false,
  isProjectOpen: false,
  isProfileOpen: false,
  isDtrOpen: false,
  isTransferOpen: false,
  isLetterRequestOpen: false,
  isTodoOpen: false,
  isDevelopmentPlanOpen: false,
  isSettingsOpen: false,
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    toggleDropdown(state, action) {
      const dropdownName = action.payload;
      switch (dropdownName) {
        case "HRDatabase":
          state.isDbOpen = !state.isDbOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isServiceHubOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          break;
        case "serviceHub":
          state.isServiceHubOpen = !state.isServiceHubOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          break;
        case "Recruitment":
          state.isRecruitmentOpen = !state.isRecruitmentOpen;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          break;
        case "performance":
          state.isPerformanceOpen = !state.isPerformanceOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          state.isServiceHubOpen = false;
          break;
        case "payrollAndAttendance":
          state.isPayrollOpen = !state.isPayrollOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isDbOpen = false;
          state.isServiceHubOpen = false;
          break;
        case "personalDevelopment":
          state.isPersonalDevelopmentOpen = !state.isPersonalDevelopmentOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          state.isServiceHubOpen = false;
          break;
        case "peopleEngagement":
          state.isPeopleEngagementOpen = !state.isPeopleEngagementOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          state.isServiceHubOpen = false;
          break;
        case "LeaveManagement":
          state.isLeaveOpen = !state.isLeaveOpen;
          state.isRecruitmentOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          state.isServiceHubOpen = false;
          break;
        case "dtr":
          state.isDtrOpen = !state.isDtrOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isProfileOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          break;
        case "Projects":
          state.isProjectOpen = !state.isProjectOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          break;
        case "transfer":
          state.isTransferOpen = !state.isTransferOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          break;
        case "letterRequest":
          state.isLetterRequestOpen = !state.isLetterRequestOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          break;
        case "todo":
          state.isTodoOpen = !state.isTodoOpen;
          state.isLeaveOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          break;
        case "developmentPlan":
          state.isDevelopmentPlanOpen = !state.isDevelopmentPlanOpen;
          state.isLeaveOpen = false;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPayrollOpen = false;
          break;
        case "settings":
          state.isSettingsOpen = !state.isSettingsOpen;
          state.isProfileOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPayrollOpen = false;
          break;
        case "Profile":
          state.isProfileOpen = !state.isProfileOpen;
          state.isRecruitmentOpen = false;
          state.isLeaveOpen = false;
          state.isProjectOpen = false;
          state.isDtrOpen = false;
          state.isPerformanceOpen = false;
          state.isPeopleEngagementOpen = false;
          state.isPersonalDevelopmentOpen = false;
          state.isPayrollOpen = false;
          state.isDbOpen = false;
          break;
        default:
          break;
      }
    },
  },
});

export const {
  toggleDropdown,
  isDbOpen,
  isRecruitmentOpen,
  isLeaveOpen,
  isDtrOpen,
  isProjectOpen,
  isProfileOpen,
} = dropdownSlice.actions;
export default dropdownSlice.reducer;
