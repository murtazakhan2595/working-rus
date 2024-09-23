import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { getEmployeeCustomList, handleLogout } from "./general";
import moment from "moment";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getEmployeePayroll = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
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

const getEmployeeEarnAndDeduction = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/employee-earn-deduction/?ordering=-id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    const responseEarnDededuction = await axios.get(
      `${baseUrl}/payroll/earn-deduction-type/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200 && responseEarnDededuction.status === 200) {
      const earnDeduction = responseEarnDededuction.data.results;
      response.data.results.map((item) => {
        item.income_type = earnDeduction.find(
          (earnDeduction) => earnDeduction.id === item.income_type
        )?.income_type;
      });
      const earnings = response.data.results.filter(
        (item) => item.income_type === "earning"
      );

      const deductions = response.data.results.filter(
        (item) => item.income_type === "deduction"
      );

      // Calculate total amounts for earnings and deductions
      const totalEarnings = earnings
        .reduce((total, item) => total + parseFloat(item.amount), 0)
        .toFixed(2);

      const totalDeductions = deductions
        .reduce((total, item) => total + parseFloat(item.amount), 0)
        .toFixed(2);

      const data = {
        earnings,
        deductions,
        totalEarnings,
        totalDeductions,
      };
      return data;
    }
  } catch (error) {
    console.error("Error fetching salary revision data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

const getPayslip = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/payslip/?ordering=-id&${
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
    console.error("Error fetching salary revision data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

const updateSalaryRevisionStatus = async (payload) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/payroll/salaryrevision//${payload.id}`,
      payload,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error updating salary revision status:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};

const getEarnAndDeduction = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/earn-deduction-type?ordering=-id&${
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
    console.error("Error fetching earn and deduction data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

const getSalarySetupData = async (payload) => {
  try {
    const empData = await getEmployeeCustomList({
      filterData: payload.filterData,
    });
    const empPayroll = await getEmployeePayroll({
      filterData: payload.filterData,
    });
    console.log("empData", empData.results);
    console.log("empPayroll", empPayroll.results);
    const employees = empData.results;
    const payrolls = empPayroll.results;

    // Create a Map for payroll lookup by employee ID
    const payrollMap = new Map(
      payrolls.map((payroll) => [payroll.employee, payroll])
    );

    // Merge payroll data into employee list or mark employee as 'new'
    const mergedData = employees.map((employee) => {
      const payroll = payrollMap.get(employee.id);
      return payroll
        ? {
            ...employee,
            basic_salary: payroll.basic_salary,
            salary_type: payroll.salary_type,
          }
        : {
            ...employee,
            new: true,
          };
    });
    mergedData.sort((a, b) => {
      return (a.new === true ? 1 : 0) - (b.new === true ? 1 : 0);
    });

    console.log("mergedData", mergedData);
    return mergedData;
  } catch (err) {
    console.error("Error fetching salary setup data:", err);
    if (err?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

export {
  getEmployeePayroll,
  getEmployeePayrollById,
  saveSalaryRevision,
  getSalaryRevision,
  getSalaryRevisionByPayrollId,
  deleteSalaryRevision,
  getEmployeeEarnAndDeduction,
  getPayslip,
  updateSalaryRevisionStatus,
  getEarnAndDeduction,
  getSalarySetupData,
};
