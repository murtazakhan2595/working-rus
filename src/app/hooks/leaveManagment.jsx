import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "../../state/slices/UserSlice";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getLeaveApplications = async (filterData) => {
  filterData = filterData ?? {};
  try {
    const response = await axios.get(
      `${baseUrl}/leave?ordering=date&search=${encodeURIComponent(
        JSON.stringify(filterData)
      )}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (error) {
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
    console.error("Error adding job:", error);
    throw error;
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
    console.error("Error fetching leave types data :", error);
  }
  return [];
};

export {
  getLeaveApplications,
  addLeaveRequest,
  getLeaveTypes,
};
