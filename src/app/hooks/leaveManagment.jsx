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
const getDesignationList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/designation/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const departmentResponse = response.data;
      const designationList = await departmentResponse.map((department) => ({
        value: department.id,
        label: department.name,
      }));
      return designationList;
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getManagersList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/emplistofmanager/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const managerResponse = response.data;
      const managersList = managerResponse.map((manager) => ({
        value: manager.id,
        label: manager.username,
      }));
      return managersList;
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getList = async (URL) => {
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) return response.data;
    else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const deleteRecord = async (URL, recordName) => {
  try {
    const response = await axios.delete(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 204) {
      toast.success(`${recordName} deleted successfully`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } else {
      toast.error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    toast.error(error.message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  } finally {
    return true;
  }
};

const addLeaveRequest = async (baseUrl, values, token) => {
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
  getManagersList,
  getDesignationList,
  getList,
  deleteRecord,
  addLeaveRequest,
  getLeaveTypes,
};
