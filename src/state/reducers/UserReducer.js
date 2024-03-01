const initialState = {
  userProfile: {
    id: 0,
    username: null,
    is_filled: null,
    role: null,
  },
  isLogin: null,
  sidebarRefresh: false,
  token: "",
  baseUrl:
    window.location.href.indexOf("https") === -1
      ? "https://hrms.tecbrix.cloud.com:8080/api"
      : "https://hrms.tecbrix.cloud.com:8080/api",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_PROFILE":
      return {
        ...state,
        isLogin: true,
        userProfile: action.payload,
      };
    case "SET_USER_LOGOUT":
      return {
        ...state,
        isLogin: false,
        token: "",
        userProfile: {  id: 0,
          username: null,
          is_filled: null,
          role: null},
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    case "SET_SIDEBAR_REFRESH":
      return {
        ...state,
        sidebarRefresh: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
