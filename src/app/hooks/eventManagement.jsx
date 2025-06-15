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


export const saveEvent = async (payload) => {
  try {
    if (payload?.id) {
      // If there's an ID, use PATCH to update the existing asset request
      const response = await axios.patch(
        `${baseUrl}/dashboard-events/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      // If no ID, use POST to create a new asset request
      const response = await axios.post(
        `${baseUrl}/dashboard-events/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
    return false;
  } catch (error) {
    console.error("Error updating asset request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getEventList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/dashboard-events?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      response.data.results = response.data.results.map((item) => ({
        id: item.id,
        name: item.name,
        start_date: item.event_time?.start ?? null,
        end_date: item.event_time?.end ?? null,
        event_location: item.event_location ?? null,
      }));
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching events list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/dashboard-events/${id}/`, {
      headers: headers(),
    });
    if (response.status === 204) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}