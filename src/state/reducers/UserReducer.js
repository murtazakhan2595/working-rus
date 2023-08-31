const initialState = {
  userProfile: {},
  isLogin : null ,
  token : "",
  baseUrl:
    window.location.href.indexOf("https") === -1
      ? "http://127.0.0.1:8000/api"
      : "https://f1-api.tecbrix.cloud/api/v1/",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_PROFILE":
      return {
        ...state,
        isLogin : true,
        userProfile: action.payload,
      };
    case "SET_USER_LOGOUT":
      return {
        ...state,
        isLogin : false,
        token : "" ,
        userProfile: {},
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
