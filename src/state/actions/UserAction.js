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
  return {
    type: 'SET_USER_LOGOUT',
  };
};  
