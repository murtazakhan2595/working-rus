// interviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getApplicantsList,
  getInterviewTypesList,
  getEmailTemplateList,
} from "app/hooks/talentSphere";

import {getEmployeeDropdownList} from "app/hooks/general"

export const fetchInterviewOptions = createAsyncThunk(
  "interview/fetchOptions",
  async () => {
    const [applicantsData, interviewTypesData, panelMembersData, emailTemplatesData] =
      await Promise.all([
        getApplicantsList(),
        getInterviewTypesList(),
        getEmployeeDropdownList(),
        getEmailTemplateList(),
      ]);

    return {
      applicants: applicantsData.results?.map((item) => ({
        label: `${item.first_name} ${item.last_name} - ${item.email}`,
        value: item.id,
      })),

      interviewTypes: interviewTypesData.results?.map((item) => ({
        label: item.name,
        value: item.id,
      })),

      panelMembers: panelMembersData.results?.map((item) => ({
        label: `${item.name} `,
        value: item.id,
      })),

      emailTemplates: emailTemplatesData.results?.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    };
  }
);

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    applicants: [],
    interviewTypes: [],
    panelMembers: [],
    emailTemplates: [],
    isLoading: false,
    isLoaded: false, 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviewOptions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInterviewOptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.applicants = action.payload.applicants;
        state.interviewTypes = action.payload.interviewTypes;
        state.panelMembers = action.payload.panelMembers;
        state.emailTemplates = action.payload.emailTemplates;
      })
      .addCase(fetchInterviewOptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default interviewSlice.reducer;
