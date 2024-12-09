import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { getEmployeeCustomList, handleLogout } from "./general";
import moment from "moment";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});


const saveOrganization = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/organization/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/organization/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving organization:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};

const deleteOrganization = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/organization/${id}`, {
      headers: headers(),
    });
    if (response.status === 200 || response.status === 204) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting organization:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
}

const getOrganizationCountryList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/countries/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting country list:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
}

export { saveOrganization, deleteOrganization, getOrganizationCountryList };