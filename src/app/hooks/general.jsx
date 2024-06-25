import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getDepartmentList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/department/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const departmentResponse = response.data;
      const departmentList = await departmentResponse.map((department) => ({
        value: department.id,
        label: department.name,
      }));
      return departmentList;
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

const getOrganizationList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/organization/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const organizationResponse = response.data;
      const organizationList = organizationResponse.map((manager) => ({
        value: manager.id,
        label: manager.name,
      }));
      return organizationList;
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

export {
  getDepartmentList,
  getManagersList,
  getDesignationList,
  getList,
  deleteRecord,
  getOrganizationList,
};
