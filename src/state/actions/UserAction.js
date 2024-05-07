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
  sessionStorage.clear();
  return {
    type: 'SET_USER_LOGOUT',
  };
};  

export const setSidebarRefresh = (val) => {
  return {
    type: 'SET_SIDEBAR_REFRESH',
    payload : val
  };
};  
export const setManagerList = (val) => {
  return {
    type: 'SET_MANAGER_LIST',
    payload : val
  };
};  
