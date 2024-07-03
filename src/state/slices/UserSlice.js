import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  userProfile: {
    id: 0,
    username: null,
    is_filled: null,
    role: null,
  },
  isLogin: null,
  sidebarRefresh: false,
  token: "",
  baseUrl: window.location.href.startsWith("https://hrms.tecbrix.cloud")
    ? "https://hrms.tecbrix.cloud:8080/api"
    : window.location.href.startsWith("http://localhost")
    ? "https://staging-hrms-be.tecbrix.cloud/api"
    : "https://staging-hrms-be.tecbrix.cloud/api",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.isLogin = true;
      state.userProfile = {
        id: action.payload.id,
        username: action.payload.username,
        is_filled: action.payload.is_filled,
        role: action.payload.user_role,
      };
    },
    setUserLogout(state) {
      state.isLogin = false;
      state.token = "";
      state.userProfile = {
        id: 0,
        username: null,
        is_filled: null,
        role: null,
      };
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setSidebarRefresh(state, action) {
      state.sidebarRefresh = action.payload;
    },
  },
});

export const { setUserProfile, setUserLogout, setToken, setSidebarRefresh } =
  userSlice.actions;
export default userSlice.reducer;
