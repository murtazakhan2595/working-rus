import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { setUserLogout } from "state/actions/UserAction";
import { EmployeeListData } from "app/utils/Types/General";

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
    const response = await axios.get(`${baseUrl}/customemp/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const employeeResponse = response.data?.results?.employees ?? [];
      const employeeList = employeeResponse.map((employee) => ({
        value: employee.id,
        label: `${employee.username}`,
        name: `${employee.first_name} ${employee.last_name}`,
        department_name: employee.department_name,
        department_position: employee.department_position,
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

const getProjectsList = async () => {
  const URL = `/project/`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const projectResponse = response.data;
      const projectList = projectResponse.map((project) => ({
        value: project.id,
        label: project.name,
      }));
      return projectList;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getEmployeeCustomList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/customemp/?ordering=id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const employeeDataResponse = response.data.results;
      const employeeData = {
        count: employeeDataResponse.total_count,
        results: employeeDataResponse.employees,
        ActiveEmployee: employeeDataResponse.total_employees,
        TotalEmployee: employeeDataResponse.active_employees,
        TotalManager: employeeDataResponse.total_managers,
      };
      return employeeData;
    } else return EmployeeListData;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return EmployeeListData;
};

const getList = async (URL) => {
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) return response.data;
    else return [];
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getCurrenciesList = async (URL) => {
  try {
    const response = await axios.get(`${baseUrl}/currencies/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const currenciesResponse = response.data;
      const currenciesList = currenciesResponse.map((currencies) => ({
        value: currencies.code,
        label:`${currencies.code} - ${currencies.name}`,
      }));
      return currenciesList;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
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
  getEmployeeCustomList,
  getProjectsList,
  getCurrenciesList
};
