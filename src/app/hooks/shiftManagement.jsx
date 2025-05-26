import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});


const saveShift = async (payload) => {
  try {
    console.log("payload", payload);
    if(payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/shift/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } else{
      const response = await axios.post(
        `${baseUrl}/shift/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error updating asset request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    throw error;
  }
}

const saveShiftSchedule = async (payload) => {
  try {
    if(payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/shift-schedules/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    }
    else{
      const response = await axios.post(
        `${baseUrl}/shift-schedules/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error updating asset request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}

const getShiftSchedule = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/shift-schedules?ordering=${sortField}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}

export { saveShift, saveShiftSchedule, getShiftSchedule };