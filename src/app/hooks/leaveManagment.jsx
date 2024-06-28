import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getLeaveApplications = async (URL) => {
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getEmployeeLeaveTypes = async (filterData) => {
  filterData = filterData ? filterData : {};
  try {
    const response = await axios.get(
      `${baseUrl}/employeeleavetypes?search=${encodeURIComponent(
        JSON.stringify(filterData)
      )}`,
      { headers: headers() }
    );
    if (response.status === 200) {
      const leaveTypeResponse = response.data;
      const employeeLeaveTypes = {
        count: leaveTypeResponse.count,
        results: leaveTypeResponse.results,
      };
      return employeeLeaveTypes;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const addLeaveRequest = async (values) => {
  try {
    const response = await axios.post(`${baseUrl}/leave/`, values, {
      headers: headers(),
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding job:", error);
    return false;
  }
};

const getLeaveTypes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/leavecomponents/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const leaveTypeResponse = response.data;
      const leaveTypesList = leaveTypeResponse.map((type) => ({
        value: type.id,
        label: type.name,
      }));
      return leaveTypesList;
    } else return [];
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching leave types data :", error);
  }
  return [];
};

export {
  getLeaveApplications,
  addLeaveRequest,
  getLeaveTypes,
  getEmployeeLeaveTypes,
};
