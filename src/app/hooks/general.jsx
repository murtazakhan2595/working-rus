import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { setUserLogout } from "state/actions/UserAction";

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
      const designationResponse = response.data;
      const designationList = await designationResponse.map((designation) => ({
        value: designation.id,
        label: designation.name,
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

const getEmployeeList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/emp/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const employeeResponse = response.data;
      const employeeList = employeeResponse.map((employee) => ({
        value: employee.id,
        label: `${employee.first_name} ${employee.last_name}`,
      }));
      return employeeList;
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
      const organizationList = organizationResponse.map((organization) => ({
        value: organization.id,
        label: organization.name,
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

const handleLogout = () => {
  if (window.localStorage.getItem("token")) {
    window.location.href = "/login";
    toast.error("Session Time Out", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    window.localStorage.setItem("token", "");
    setUserLogout();
  }
};

export {
  getDepartmentList,
  getManagersList,
  getDesignationList,
  getList,
  deleteRecord,
  getOrganizationList,
  getEmployeeList,
  handleLogout,
};
