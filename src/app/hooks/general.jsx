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
import { renderErrorMessages } from "utils/renderErrors";
import { fetchDepartments } from "state/slices/CommonSlice";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getDepartmentList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "name";
  try {
    const URL = `/department/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const departmentResponse = response.data;
      // const departmentList = await mapDepartmentList(departmentResponse?.results);
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
      } else {
        return false;
      }
    } else {
      const response = await axios.post(`${baseUrl}/department/`, payload, {
        headers: headers(),
      });

      if (response.status === 201) {
        return response?.data;
      } else {
        return false;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
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

const saveDesignation = async (payload, designationId) => {
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
    // If we get here, neither condition returned a response
    console.warn("API call succeeded but with unexpected status code");
    return false;
  } catch (error) {
    console.error("API error in saveDesignation:", error);
    console.error("Error response:", error.response);

    if (error?.response?.status === 401) {
      HandleLogout();
    }

    // Return the error response for better error handling
    if (error.response) {
      return {
        success: false,
        error: error.response.data,
        status: error.response.status,
      };
    }

    return false;
  }
};

const getDesignationList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const sortField = payload?.options?.sortField ?? "";
  const sortOrder = payload?.options?.sortOrder ?? "";
  const filterData = payload?.filterData ?? {};

  try {
    // Create ordering parameter based on sortField and sortOrder
    let ordering = "-created_at"; // Default ordering
    if (sortField) {
      ordering = sortOrder === "desc" ? `-${sortField}` : sortField;
    }

    const URL = `/designation/?ordering=${ordering}&${
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
    const ordering = payload?.ordering ?? "first_name";
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
      const employeeList = await employeeResponse.map((employee) => ({
        value: employee.id,
        id: employee.id,
        label: `${employee.first_name} ${employee.last_name} - ${employee.username}`,
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
        joining_date: employee.joining_date,
        employee_status: employee.employee_status,
        user_role: employee.user_role,
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
        date_of_birth: employee.date_of_birth,
        direct_report: employee.direct_report,
        joining_date: employee.joining_date,
        last_name: employee.last_name,
        department_name: employee.department_name,
        department_position: employee.department_position,
        disbursement_type: employee.disbursement_type,
        work_email: employee.work_email,
        employee_type: employee.employee_type,
        employee_status: employee.employee_status,
        branch_id: employee.branch_id,
        profile_picture: employee.profile_picture,
        shift_assignment: employee.shift_assignment,
        serial_number: employee.serial_number,
        nationality: employee.nationality,
        user_role: employee.user_role,
        contract_start_date: employee.contract_start_date,
        isContracted: employee.contract_start_date ? true : false,
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
    console.log(`API Request: ${baseUrl}/organization/`);
    const response = await axios.get(`${baseUrl}/organization/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      console.log("API Response:", response.data);
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

export const getTimeZoneList = async (URL) => {
  try {
    const response = await axios.get(`${baseUrl}/timezone/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const TimeZoneResponse = response.data;
      const TimeZoneList = TimeZoneResponse.map((timeZone) => ({
        value: timeZone.timezone,
        label: timeZone.timezone,
        timeZone: timeZone.timezone,
      }));
      return TimeZoneList;
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
function HandleLogout(message = "Session Time Out") {
  if (window.localStorage.getItem("token")) {
    window.location.href = "/login";
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    window.localStorage.setItem("token", "");
    setUserLogout();
  }
}

// Delete role
const deleteRole = async (roleId, roleName) => {
  try {
    const response = await axios.delete(`${baseUrl}/userrole/${roleId}`, {
      headers: headers(),
    });
    if (response.status === 204 || response.status === 200) {
      toast.success(`Role "${roleName}" deleted successfully`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      return true;
    } else {
      toast.error(`Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("ERROR deleting role:", error);
    toast.error(error?.response?.data?.message || error.message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
    return false;
  }
};

const getRoleList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-created_at";
  try {
    const URL = `/userrole/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

export const SubmitResetPassword = async (payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/password/reset/confirm/`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching shifts:", error);
    renderErrorMessages(error?.response?.data);
  }

  return false;
};

// export const getRequestApprovelList = async (request_id) => {
//   try {
//     const pageNo = payload?.options?.page ?? "";
//     const ordering = payload?.ordering ?? "first_name";
//     const pageSize = payload?.options?.sizePerPage ?? "";
//     const filterData = payload?.filterData
//       ? {
//           ...payload?.filterData,
//           employee_status: "Active,Probation,Notice Period",
//         }
//       : { employee_status: "Active,Probation,Notice Period" };
//     const URL = `/requests/?ordering=${ordering}&${
//       pageNo ? `page=${pageNo}&` : ""
//     }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
//       JSON.stringify(filterData)
//     )}`;
//     const response = await axios.get(`${baseUrl}${URL}`, {
//       headers: headers(),
//     });
//     if (response.status === 200) {
//       const employeeResponse = response.data?.results?.employees ?? [];
//       const employeeList = await employeeResponse.map((employee) => ({
//         value: employee.id,
//         id: employee.id,
//         label: `${employee.first_name} ${employee.last_name} - ${employee.username}`,
//         username: `${employee.username}`,
//         name: `${employee.first_name} ${employee.last_name}`,
//         department_name: employee.department_name,
//         department_position: employee.department_position,
//         employee_location: employee.employee_location,
//         direct_report: employee.direct_report,
//         branch_id: employee.branch_id,
//         work_email: employee.work_email,
//         serial_number: employee.serial_number,
//         basic_salary: employee.salary,
//         salary_type: employee.salary_type,
//         is_eos_applicable: employee.is_eos_applicable,
//         is_new: employee.is_new,
//         joining_date: employee.joining_date,
//         employee_status: employee.employee_status,
//         user_role: employee.user_role,
//         name_initials: `${
//           employee?.first_name?.charAt(0)?.toUpperCase() || ""
//         }${employee?.last_name?.charAt(0)?.toUpperCase() || ""}`,
//       }));
//       return { results: employeeList, count: response.data?.count };
//     } else return { results: [], count: 0 };
//   } catch (error) {
//     console.error("Error fetching Personal Info data :", error);
//   }
//   return { results: [], count: 0 };
// };

export const getCurrentRequestApprover = async (request_id) => {
  try {
    const URL = `/requests/${request_id}/`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ReturnData = {
        current_level: ResponseData.current_level,
        level_status: ResponseData.status,
        current_approver: ResponseData.current_approver,
      };
      return ReturnData;
    } else return {};
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return {};
};

export {
  getDepartmentList,
  getManagersList,
  getDesignationList,
  getList,
  deleteRecord,
  getOrganizationList,
  getEmployeeList,
  getEmployeeCustomList,
  getProjectsList,
  getCurrenciesList,
  saveDepartment,
  saveDesignation,
  getWorkingHours,
  getEmployeeListWithDetail,
  HandleLogout,
  deleteRole,
  getRoleList,
};
