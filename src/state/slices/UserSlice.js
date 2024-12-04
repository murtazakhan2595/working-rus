import { createSlice } from "@reduxjs/toolkit";

const URLS = [
  {
    Frontend: "https://app.cohrus.com",
    Backend: "https://hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend: "https://staging-hrms.tecbrix.cloud",
    Backend: "https://staging-hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend: "http://localhost:3000",
    Backend: "https://staging-hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend: "https://production-hdfnfucnc9gpcaaw.z02.azurefd.net",
    Backend: "https://hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend:
      "https://hrmsblob-fsc9g0a0b5axcufm.z02.azurefd.net/",
    Backend:
      "https://staging-hrms-be.tecbrix.cloud/api",
  },
];

const getBaseUrl = () => {
  let baseUrl = null;
  URLS.forEach((url) => {
    if (window.location.href.startsWith(url.Frontend)) {
      baseUrl = url.Backend;
    }
  });
  return baseUrl ?? "https://staging-hrms-be.tecbrix.cloud/api";
};

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
  baseUrl: getBaseUrl(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.isLogin = true;
      state.userProfile = action.payload;
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