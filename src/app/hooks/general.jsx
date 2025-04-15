import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { setUserLogout } from "state/actions/UserAction";
import { EmployeeListData } from "app/utils/Types/General";
import {
  mapBranchList,
  mapBranchPayloadData,
} from "app/utils/MappingObjects/mapOfficeSettingData";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getDepartmentList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  try {
    const URL = `/department/?ordering=-created_at&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const departmentResponse = response.data;
      const departmentList = await departmentResponse?.results?.map(
        (department) => ({
          value: department.id,
          label: department.name,
          created_at: department.created_at,
          description: department.description,
          id: department.id,
          name: department.name,
          organization: department.organization,
          updated_at: department.updated_at,
          parent_department: department.parent_department,
        })
      );
      return { results: departmentList, count: departmentResponse.count };
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

export const getBranchList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "created_at";
  try {
    const URL = `/branch/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const branchResponse = response.data;
      const branchList = await mapBranchList(branchResponse?.results);
      return { results: branchList, count: branchResponse.count };
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const saveDepartment = async (departmentId, payload) => {
  try {
    if (departmentId) {
      const response = await axios.patch(
        `${baseUrl}/department/${departmentId}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response?.data;
      }
    } else {
      const response = await axios.post(`${baseUrl}/department/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) {
        return response?.data;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return false;
  }
};
export const addUpdateBranch = async (payload, id = null) => {
  try {
    const finalPayload = mapBranchPayloadData(payload);

    const url = id
      ? `${baseUrl}/branch/${id}` // Use id if updating
      : `${baseUrl}/branch/`; // No id means create new

    const method = id ? "PUT" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    // Check response status
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle errors
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding/updating LogTime:", error);
    return false;
  }
};

const saveDesignation = async (designationId, payload) => {
  try {
    if (designationId) {
      const response = await axios.patch(
        `${baseUrl}/designation/${designationId}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response?.data;
      }
    } else {
      const response = await axios.post(`${baseUrl}/designation/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) {
        return response?.data;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return false;
  }
};

const getDesignationList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};

  try {
    const URL = `/designation/?ordering=-created_at&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const designationResponse = response.data;
      const designationList = await designationResponse?.results?.map(
        (designation) => ({
          value: designation.id,
          label: designation.name,
          name: designation.name,
          created_at: designation.created_at,
          description: designation.description,
          id: designation.id,
          organization: designation.organization,
          updated_at: designation.updated_at,
        })
      );
      return { results: designationList, count: designationResponse.count };
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const saveShift = async (shiftId, payload) => {
  try {
    if (shiftId) {
      const response = await axios.patch(
        `${baseUrl}/shift/${shiftId}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response?.data;
      }
    } else {
      const response = await axios.post(`${baseUrl}/shift/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) {
        return response?.data;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return false;
  }
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
        label: `${manager.first_name} ${manager.last_name}`,
        id: manager.id,
        name: `${manager.first_name} ${manager.last_name}`,
        username: manager.username,
      }));
      return managersList;
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getEmployeeList = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData
      ? {
          ...payload?.filterData,
          employee_status: "Active,Probation,Notice Period",
        }
      : { employee_status: "Active,Probation,Notice Period" };
    const URL = `/customemp/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const employeeResponse = response.data?.results?.employees ?? [];
      const employeeList = employeeResponse.map((employee) => ({
        value: employee.id,
        id: employee.id,
        label: `${employee.first_name} ${employee.last_name}`,
        username: `${employee.username}`,
        name: `${employee.first_name} ${employee.last_name}`,
        department_name: employee.department_name,
        department_position: employee.department_position,
        employee_location: employee.employee_location,
        direct_report: employee.direct_report,
        branch_id: employee.branch_id,
        work_email: employee.work_email,
        serial_number: employee.serial_number,
        basic_salary: employee.salary,
        salary_type: employee.salary_type,
        is_eos_applicable: employee.is_eos_applicable,
        is_new: employee.is_new,
        employee_status: employee.employee_status,
        name_initials: `${
          employee?.first_name?.charAt(0)?.toUpperCase() || ""
        }${employee?.last_name?.charAt(0)?.toUpperCase() || ""}`,
      }));
      return { results: employeeList, count: response.data?.count };
    } else return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return { results: [], count: 0 };
};

const getEmployeeListWithDetail = async () => {
  try {
    const response = await axios.get(`${baseUrl}/emp`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const employeeResponse = response.data?.results ?? [];
      const employeeList = employeeResponse.map((employee) => ({
        value: employee.id,
        id: employee.id,
        label: `${employee.first_name} ${employee.last_name}`,
        username: `${employee.username}`,
        name: `${employee.first_name} ${employee.last_name}`,
        first_name: employee.first_name,
        direct_report: employee.direct_report,
        last_name: employee.last_name,
        department_name: employee.department_name,
        department_position: employee.department_position,
        work_email: employee.work_email,
        employee_status: employee.employee_status,
        branch_id: employee.branch_id,
        profile_picture: employee.profile_picture,
        shift_assignment: employee.shift_assignment,
        serial_number: employee.serial_number,
        nationality: employee.nationality,
        name_initials: `${
          employee?.first_name?.charAt(0)?.toUpperCase() || ""
        }${employee?.last_name?.charAt(0)?.toUpperCase() || ""}`,
      }));
      return employeeList;
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getOrganizationList = async (allData = false) => {
  try {
    const response = await axios.get(`${baseUrl}/organization/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const organizationResponse = response.data;
      const organizationList = organizationResponse?.results?.map(
        (organization) => ({
          value: organization.id,
          label: organization.name,
        })
      );
      return allData ? organizationResponse : organizationList;
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getProjectsList = async (userProfile) => {
  const userID = userProfile?.id ?? userProfile;
  const userRole = userProfile?.role;
  const filterData = {
    ...((userRole === 4 || userRole === 2) && userID
      ? { project_members: [userID] }
      : {}),
  };
  const URL = `/project/?ordering=-created_at&search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const projectResponse = response?.data?.results;
      // if (userProfile.role === 4 || userProfile.role === 2) {
      //   const filteredResults = projectResponse.filter(
      //     (project) =>
      //       project.project_members.includes(userProfile.id) ||
      //       project.created_by === userProfile.id
      //   );
      //   const projectList = filteredResults.map((project) => ({
      //     value: project.id,
      //     label: project.name,
      //   }));
      //   return projectList;
      // } else {
      const projectList = projectResponse.map((project) => ({
        value: project.id,
        id: project.id,
        label: project.name,
        name: project.name,
        color: project.color,
        created_at: project.created_at,
        created_by: project.created_by,
        description: project.description,
        end_date: project.end_date,
        joining_request: project.joining_request,
        profile_picture: project.profile_picture,
        project_members: project.project_members,
        start_date: project.start_date,
        status: project.status,
        task_count: project.task_count,
      }));
      return projectList;
      // }
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const getEmployeeCustomList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const ordering = payload?.ordering ?? "-id";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/customemp/?ordering=${ordering}&${
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
      console.log("employeeDataResponse", employeeDataResponse);
      const employeeData = {
        count: employeeDataResponse.total_count,
        results: employeeDataResponse.employees,
        ActiveEmployee: employeeDataResponse.active_employees,
        TotalEmployee: employeeDataResponse.total_employees,
        TotalManager: employeeDataResponse.total_managers,
      };
      return employeeData;
    } else return EmployeeListData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
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
      HandleLogout();
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
        label: `${currencies.code} - ${currencies.name}`,
      }));
      return currenciesList;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
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

const getWorkingHours = async (URL) => {
  try {
    const response = await axios.get(`${baseUrl}/shift/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const workingHours = response.data;
      return workingHours;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Working Hours data :", error);
  }
  return [];
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
function HandleLogout() {
  if (window.localStorage.getItem("token")) {
    window.location.href = "/login";
    toast.error("Session Time Out", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    window.localStorage.setItem("token", "");
    setUserLogout();
  }
}

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
  getCurrenciesList,
  saveDepartment,
  saveDesignation,
  getWorkingHours,
  getEmployeeListWithDetail,
  saveShift,
  HandleLogout,
};
