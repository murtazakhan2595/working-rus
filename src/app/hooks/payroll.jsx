import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { getEmployeeCustomList, HandleLogout } from "./general";
import moment from "moment";
import {
  mapPayRunList,
  mapEmployeePayRollData,
  mapPayrunPayloadData,
  mapEmployeeSalaryPayloadData,
  mapFinalSettlementPayloadData,
} from "app/utils/MappingObjects/mapPayrollData";
import { toast } from "react-toastify";
import { renderErrorMessages } from "utils/renderErrors";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
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
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};
export const getEmployeePayrollDetailByEmpId = async (empID) => {
  const URL = `/payroll/payroll/${empID}/`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const payrollDetail = mapEmployeePayRollData(response.data);
      return payrollDetail;
    }
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
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
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
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
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching salary revision data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
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
      HandleLogout();
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
      return response.data;
    }
  } catch (error) {
    console.error("Error updating salary revision status:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
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
      HandleLogout();
    }
    return [];
  }
};

const getSalarySetupData = async (payload) => {
  try {
    const empData = await getEmployeeCustomList(payload);
    console.log("empData", empData);
    return empData;
  } catch (err) {
    console.error("Error fetching salary setup data:", err);
    if (err?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const saveEarnAndDeduction = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/payroll/earn-deduction-type/${payload.id}`,
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
        `${baseUrl}/payroll/earn-deduction-type/`,
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
    console.error("Error saving earn and deduction data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const deleteEarnAndDeduction = async (id) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/payroll/earn-deduction-type/${id}`,
      {
        headers: headers(),
      }
    );
    return true;
  } catch (error) {
    console.error("Error deleting earn and deduction data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const saveEmployeePayroll = async (payload, id) => {
  const finalPaylaod = mapEmployeeSalaryPayloadData(payload);
  const payrollId = payload.id || id;
  try {
    if (!finalPaylaod) {
      console.error("Invalid payload provided to saveEmployeePayroll");
      return false;
    }
    if (payrollId) {
      const response = await axios.patch(
        `${baseUrl}/payroll/employee-payroll/${payrollId}`,
        finalPaylaod,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data || true;
      } else {
        console.error(`Unexpected response status: ${response.status}`);
        return false;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/payroll/employee-payroll/`,
        finalPaylaod,
        {
          headers: headers(),
        }
      );

      if (response.status === 201 || response.status === 200) {
        return response.data || true;
      } else {
        console.error(`Unexpected response status: ${response.status}`);
        return false;
      }
    }
  } catch (error) {
    console.error("Error in saveEmployeePayroll:", error);
    if (error?.response) {
      console.error(
        "API error response:",
        error.response.status,
        error.response.data
      );
    }
    if (error?.response?.status === 401) {
      HandleLogout();
      return false;
    }
    renderErrorMessages(error?.response?.data);
    // toast.error(`Unexpected response status: ${error?.response.status}`);

    return false;
  }
};

const saveEmployeeEarnDeduction = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/payroll/employee-earn-deduction/${payload.id}`,
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
        `${baseUrl}/payroll/employee-earn-deduction/`,
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
    console.error("Error saving employee earn and deduction data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const saveReimbursement = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/payroll/reimbursement/${payload.id}`,
        payload,
        {
          headers: formDataHeader(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return true;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/payroll/reimbursement/`,
        payload,
        {
          headers: formDataHeader(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error saving reimbursement data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};
const getReimbursement = async (payload, options) => {
  const pageNo = options?.page ?? "";
  const pageSize = options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  console.log("payload - ", payload);
  console.log("filterData - ", filterData);
  const URL = `/payroll/reimbursement/?ordering=-id&${
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
    console.error("Error fetching reimbursement data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};
const deleteReimbursement = async (id) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/payroll/reimbursement/${id}`,
      {
        headers: headers(),
      }
    );
    return true;
  } catch (error) {
    console.error("Error deleting reimbursement data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getPayrollSummary = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/payroll/organization/${1}/payroll-summary/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching payroll summary data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const savePayrun = async (payload, id) => {
  const payrunID = id ?? payload?.id;
  const finalPayload = mapPayrunPayloadData(payload);
  try {
    if (payrunID) {
      const response = await axios.patch(
        `${baseUrl}/payroll/payroll-run/${payrunID}`,
        finalPayload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/payroll/payroll/generate/`,
        finalPayload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving payrun data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};
const getPayun = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/payroll-run/?ordering=-id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const PayRunResponse = response.data;
      const PayRunList = await mapPayRunList(PayRunResponse.results);
      return { count: PayRunResponse.count, results: PayRunList };
    }
  } catch (error) {
    console.error("Error fetching payrun data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};
export const getPayRunEmployees = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/employees/?ordering=-id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const PayRunResponse = response.data;
      // const PayRunList = await mapPayRunList(PayRunResponse.results);
      const PayRunList = PayRunResponse.results;
      return { count: PayRunResponse.count, results: PayRunList };
    }
  } catch (error) {
    console.error("Error fetching payrun data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};
const getPayslipByID = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/payroll/payslip/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching payslip data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const saveFinalSettlement = async (payload, id) => {
  const finalId = payload.id || id;
  try {
    const finalPayload = mapFinalSettlementPayloadData(payload);

    const url = finalId
      ? `${baseUrl}/payroll/finalsettlement/${finalId}` // Use id if updating
      : `${baseUrl}/payroll/finalsettlement/`; // No id means create new

    const method = finalId ? "PATCH" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};


// export const saveFinalSettlement = async (payload) => {
//   try {
//     console.log(
//       "Starting final settlement save operation with payload:",
//       payload
//     );

//     if (!payload) {
//       console.error("Final settlement payload is missing");
//       return false;
//     }

//     if (!payload.employee_payroll) {
//       console.error(
//         "Employee payroll ID is missing in final settlement payload"
//       );
//       return false;
//     }

//     // Convert numeric input values to numbers if they're strings
//     if (payload.remaining_salary) {
//       payload.remaining_salary = Number(payload.remaining_salary);
//     }
//     if (payload.earned_leave_encashment) {
//       payload.earned_leave_encashment = Number(payload.earned_leave_encashment);
//     }
//     if (payload.total_deductions) {
//       payload.total_deductions = Number(payload.total_deductions);
//     }
//     if (payload.gratuity_amount) {
//       payload.gratuity_amount = Number(payload.gratuity_amount);
//     }
//     if (payload.final_amount) {
//       payload.final_amount = Number(payload.final_amount);
//     }

//     if (payload?.id) {
//       console.log(`Updating existing final settlement with ID: ${payload.id}`);
//       const response = await axios.patch(
//         `${baseUrl}/payroll/finalsettlement/${payload.id}`,
//         payload,
//         {
//           headers: headers(),
//         }
//       );
//       console.log("Final settlement update response:", response);
//       if (response.status === 201 || response.status === 200) {
//         console.log("Final settlement updated successfully");
//         return true;
//       } else {
//         console.error("Unexpected response status:", response.status);
//         return false;
//       }
//     } else {
//       console.log("Creating new final settlement");
//       const response = await axios.post(
//         `${baseUrl}/payroll/finalsettlement/`,
//         payload,
//         {
//           headers: headers(),
//         }
//       );
//       console.log("Final settlement creation response:", response);
//       if (response.status === 201 || response.status === 200) {
//         console.log("Final settlement created successfully");
//         return true;
//       } else {
//         console.error("Unexpected response status:", response.status);
//         return false;
//       }
//     }
//   } catch (error) {
//     console.error("Error saving final settlement data:", error);
//     console.error("Request payload was:", payload);
//     if (error?.response?.data) {
//       console.error("API error details:", error.response.data);
//     }
//     if (error?.response?.status === 401) {
//       HandleLogout();
//     }
//     return false;
//   }
// };


const getEmpPayrolDetails = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/emppayroldetails/?ordering=-id&${
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
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

const getFinalSettlement = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/payroll/finalsettlement/?ordering=-id&${
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
    console.error("Error fetching final settlement data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const getFinalSettlementByEmpPayrollId = async (payroll_id) => {
  const filterData = { employee_payroll: payroll_id };
  try {
    const response = await getFinalSettlement({ filterData });
    if (response.results && response.results.length > 0) {
      const Record = response.results[0];
      return Record;
    } else return null;
  } catch (error) {
    console.error("Error fetching final settlement data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

const getPayRunById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/payroll/payroll-run/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching payrun data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const claimExpenseChoices = async () => {
  try {
    const response = await axios.get(`${baseUrl}/payroll/expensechoice/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching payrun data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const deleteEmployeeEarnDeduction = async (id) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/payroll/employee-earn-deduction/${id}`,
      {
        headers: headers(),
      }
    );
    return true;
  } catch (error) {
    console.error("Error deleting employee earn and deduction data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getPayrollAdjustmentTemplate = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/payroll/people/download-template/`,
      {
        headers: headers(),
        responseType: "arraybuffer",
      }
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
};

const uploadPayrollAdjustment = async (formData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/payroll/people/import/`,
      formData,
      {
        headers: {
          ...headers(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error uploading employees data:", error);
    return error?.response?.data;
  }
};

export {
  claimExpenseChoices,
  getEmployeePayroll,
  saveEmployeePayroll,
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
  saveEarnAndDeduction,
  deleteEarnAndDeduction,
  deleteEmployeeEarnDeduction,
  saveEmployeeEarnDeduction,
  saveReimbursement,
  getReimbursement,
  deleteReimbursement,
  getPayrollSummary,
  savePayrun,
  getPayun,
  getPayslipByID,
  getPayRunById,
  getEmpPayrolDetails,
  getFinalSettlement,
  getPayrollAdjustmentTemplate,
  uploadPayrollAdjustment,
};
