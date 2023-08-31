export const SET_BASE_URL =  (window.location.href.indexOf("https") === -1) ? "http://127.0.0.1:8000/api" : "https://f1-api.tecbrix.cloud/api/v1/";


export const setUserProfile = (profileData) => {
  return {
    type: 'SET_USER_PROFILE',
    payload: profileData,
  };
};  

export const setToken = (token) => {
  return {
    type: 'SET_TOKEN',
    payload: token,
  };
};  

export const setUserLogout = () => {
  console.log("first")
  return {
    type: 'SET_USER_LOGOUT',
  };
};  
