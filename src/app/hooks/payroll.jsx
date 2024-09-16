import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";
import  moment  from 'moment';

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getEmployeePayroll = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  console.log("filterData", filterData);
  console.log("payload", payload);
  const URL = `/payroll/employee-payroll/?ordering=-id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return { results: [], count: 0 };
  }
};

const getEmployeePayrollById = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/payroll/employee-payroll/${id}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

const saveSalaryRevision = async (payload) => {
  console.log("payload of saveSalaryRevision", payload);
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/payroll/salaryrevision/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return true;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/payroll/salaryrevision/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error saving salary revision:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};

const getSalaryRevision = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/salaryrevision/?ordering=-id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    console.log("response", response.data);
    if (response.status === 200) {
      const salaryRevisions = response.data.revision;
        const approvedRevisions = salaryRevisions.filter(
          (revision) => revision.revision_status === "APPROVED"
        );
      const lastApprovedRevision = approvedRevisions.sort(
        (a, b) => new Date(b.last_revised_date) - new Date(a.last_revised_date)
      )[0];

      // Calculate how long ago the last revision was
      const lastIncrementDate = lastApprovedRevision
        ? lastApprovedRevision.last_revised_date
        : null;
      if (lastIncrementDate) {
        const timeAgo = moment(lastIncrementDate).fromNow(); // "5 months ago", "3 days ago", etc.
        console.log(`Last increment was: ${timeAgo}`);
        response.data.lastIncrementDate = timeAgo;
        
      }
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching salary revision data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

const getSalaryRevisionByPayrollId = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/payroll/salaryrevision/${id}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching salary revision data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

const deleteSalaryRevision = async (id) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/payroll/salaryrevision/${id}`,
      {
        headers: headers(),
      }
    );
    return true;
  } catch (error) {
    console.error("Error deleting salary revision data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};

const getEmployeeEarnAndDeduction = async (payload)=>{
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/employee-earn-deduction/?ordering=-id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;

  try{
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    console.log("response", response.data);
    if (response.status === 200) {
       
        response.data.totalAmount =response.data.results
           .reduce((total, item) => total + parseFloat(item.amount), 0)
           .toFixed(2);
       
      return response.data;
    }

  }catch(error){
    console.error("Error fetching salary revision data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
}

export {
  getEmployeePayroll,
  getEmployeePayrollById,
  saveSalaryRevision,
  getSalaryRevision,
  getSalaryRevisionByPayrollId,
  deleteSalaryRevision,
  getEmployeeEarnAndDeduction,
};
