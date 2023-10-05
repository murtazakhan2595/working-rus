const initialState = {
  userProfile: {},
  isLogin: null,
  token: "",
  baseUrl:
    window.location.href.indexOf("https") === -1
      ? "http://hrms-1886226759.eu-west-1.elb.amazonaws.com:8080/api"
      : "http://hrms-1886226759.eu-west-1.elb.amazonaws.com:8080/api",
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
        userProfile: {},
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
