import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";
import moment from "moment";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});


const getNotifications = async () => {
  try {
    const response = await axios.get(`${baseUrl}/Notificationsystem/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/Notificationsystem/${notificationId}/read/`,
        {},
        { headers: headers() }
      );
      if (response.status === 200) {
        return true
       
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      if (error?.response?.status === 401) {
        HandleLogout();
      }
    }
  };

const markAllNotificationsAsRead = async (unreadNotifications) => {
  try {
    const response = await axios.post(
      `${baseUrl}/Notificationsystem/read-all/`,
      {},
      { headers: headers() }
    );
    if (response.status === 200) {
      return true
     
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
  }
};


export { getNotifications, markAsRead , markAllNotificationsAsRead };