import axios from "axios";

/**
 * Global Payroll API Service Layer
 * Centralized API calls for Global Payroll module
 */

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// Dashboard APIs
export const getPayrollDashboard = async (baseUrl) => {
  const response = await axios.get(`${baseUrl}/payroll/dashboard/`, getAuthHeaders());
  return response.data;
};

// Payroll Run APIs
export const getPayrollRuns = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/runs/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const getPayrollRunById = async (baseUrl, runId) => {
  const response = await axios.get(`${baseUrl}/payroll/runs/${runId}/`, getAuthHeaders());
  return response.data;
};

export const createPayrollRun = async (baseUrl, data) => {
  const response = await axios.post(`${baseUrl}/payroll/runs/`, data, getAuthHeaders());
  return response.data;
};

export const updatePayrollRun = async (baseUrl, runId, data) => {
  const response = await axios.put(
    `${baseUrl}/payroll/runs/${runId}/`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const deletePayrollRun = async (baseUrl, runId) => {
  const response = await axios.delete(`${baseUrl}/payroll/runs/${runId}/`, getAuthHeaders());
  return response.data;
};

export const approvePayrollRun = async (baseUrl, runId) => {
  const response = await axios.post(
    `${baseUrl}/payroll/runs/${runId}/approve/`,
    {},
    getAuthHeaders()
  );
  return response.data;
};

export const processPayrollRun = async (baseUrl, runId) => {
  const response = await axios.post(
    `${baseUrl}/payroll/runs/${runId}/process/`,
    {},
    getAuthHeaders()
  );
  return response.data;
};

// Countries & Currencies APIs
export const getCountries = async (baseUrl) => {
  const response = await axios.get(`${baseUrl}/payroll/countries/`, getAuthHeaders());
  return response.data;
};

export const addCountry = async (baseUrl, data) => {
  const response = await axios.post(`${baseUrl}/payroll/countries/`, data, getAuthHeaders());
  return response.data;
};

export const updateCountry = async (baseUrl, countryId, data) => {
  const response = await axios.put(
    `${baseUrl}/payroll/countries/${countryId}/`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const getCurrencies = async (baseUrl) => {
  const response = await axios.get(`${baseUrl}/payroll/currencies/`, getAuthHeaders());
  return response.data;
};

export const getExchangeRates = async (baseUrl) => {
  const response = await axios.get(`${baseUrl}/payroll/exchange-rates/`, getAuthHeaders());
  return response.data;
};

export const updateExchangeRate = async (baseUrl, data) => {
  const response = await axios.post(
    `${baseUrl}/payroll/exchange-rates/update/`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

// Earnings & Deductions APIs
export const getSalaryComponents = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/components/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const addSalaryComponent = async (baseUrl, data) => {
  const response = await axios.post(`${baseUrl}/payroll/components/`, data, getAuthHeaders());
  return response.data;
};

export const updateSalaryComponent = async (baseUrl, componentId, data) => {
  const response = await axios.put(
    `${baseUrl}/payroll/components/${componentId}/`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const deleteSalaryComponent = async (baseUrl, componentId) => {
  const response = await axios.delete(
    `${baseUrl}/payroll/components/${componentId}/`,
    getAuthHeaders()
  );
  return response.data;
};

// Tax Management APIs
export const getTaxTables = async (baseUrl, country) => {
  const response = await axios.get(
    `${baseUrl}/payroll/tax-tables/?country=${country}`,
    getAuthHeaders()
  );
  return response.data;
};

export const updateTaxTable = async (baseUrl, data) => {
  const response = await axios.post(`${baseUrl}/payroll/tax-tables/`, data, getAuthHeaders());
  return response.data;
};

export const getPFRules = async (baseUrl, country) => {
  const response = await axios.get(
    `${baseUrl}/payroll/pf-rules/?country=${country}`,
    getAuthHeaders()
  );
  return response.data;
};

export const updatePFRules = async (baseUrl, data) => {
  const response = await axios.post(`${baseUrl}/payroll/pf-rules/`, data, getAuthHeaders());
  return response.data;
};

export const getSocialSecurityRules = async (baseUrl, country) => {
  const response = await axios.get(
    `${baseUrl}/payroll/social-security/?country=${country}`,
    getAuthHeaders()
  );
  return response.data;
};

// WPS & Payment APIs
export const generateWPSFile = async (baseUrl, data) => {
  const response = await axios.post(
    `${baseUrl}/payroll/wps/generate/`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const downloadWPSFile = async (baseUrl, fileId) => {
  const response = await axios.get(
    `${baseUrl}/payroll/wps/download/${fileId}/`,
    {
      ...getAuthHeaders(),
      responseType: "blob",
    }
  );
  return response.data;
};

export const getWPSFiles = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/wps/files/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const validateWPSData = async (baseUrl, data) => {
  const response = await axios.post(
    `${baseUrl}/payroll/wps/validate/`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

// Claims & Reimbursements APIs
export const getClaims = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/claims/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const getClaimById = async (baseUrl, claimId) => {
  const response = await axios.get(`${baseUrl}/payroll/claims/${claimId}/`, getAuthHeaders());
  return response.data;
};

export const approveClaim = async (baseUrl, claimId) => {
  const response = await axios.post(
    `${baseUrl}/payroll/claims/${claimId}/approve/`,
    {},
    getAuthHeaders()
  );
  return response.data;
};

export const rejectClaim = async (baseUrl, claimId, reason) => {
  const response = await axios.post(
    `${baseUrl}/payroll/claims/${claimId}/reject/`,
    { reason },
    getAuthHeaders()
  );
  return response.data;
};

export const postClaimToPayroll = async (baseUrl, claimId, payrollRunId) => {
  const response = await axios.post(
    `${baseUrl}/payroll/claims/${claimId}/post-to-payroll/`,
    { payroll_run_id: payrollRunId },
    getAuthHeaders()
  );
  return response.data;
};

// AI Recommendations APIs
export const getAIRecommendations = async (baseUrl, payrollRunId) => {
  const response = await axios.get(
    `${baseUrl}/payroll/ai/recommendations/${payrollRunId}/`,
    getAuthHeaders()
  );
  return response.data;
};

export const getAIAnomalies = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/ai/anomalies/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const runAIAnalysis = async (baseUrl, data) => {
  const response = await axios.post(
    `${baseUrl}/payroll/ai/analyze/`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

// Reports APIs
export const getPayrollReports = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/reports/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const generateReport = async (baseUrl, reportType, params = {}) => {
  const response = await axios.post(
    `${baseUrl}/payroll/reports/generate/`,
    { report_type: reportType, ...params },
    getAuthHeaders()
  );
  return response.data;
};

export const exportReport = async (baseUrl, reportId, format = "pdf") => {
  const response = await axios.get(
    `${baseUrl}/payroll/reports/${reportId}/export/?format=${format}`,
    {
      ...getAuthHeaders(),
      responseType: "blob",
    }
  );
  return response.data;
};

// Audit Logs APIs
export const getAuditLogs = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/audit-logs/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const getAuditLogById = async (baseUrl, logId) => {
  const response = await axios.get(
    `${baseUrl}/payroll/audit-logs/${logId}/`,
    getAuthHeaders()
  );
  return response.data;
};

// Employee APIs for Payroll
export const getEmployeesForPayroll = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/employees/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const getEmployeePayrollDetails = async (baseUrl, employeeId) => {
  const response = await axios.get(
    `${baseUrl}/payroll/employees/${employeeId}/details/`,
    getAuthHeaders()
  );
  return response.data;
};

// Payslip APIs
export const getPayslips = async (baseUrl, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${baseUrl}/payroll/payslips/?${queryString}`,
    getAuthHeaders()
  );
  return response.data;
};

export const getPayslipById = async (baseUrl, payslipId) => {
  const response = await axios.get(
    `${baseUrl}/payroll/payslips/${payslipId}/`,
    getAuthHeaders()
  );
  return response.data;
};

export const downloadPayslip = async (baseUrl, payslipId) => {
  const response = await axios.get(
    `${baseUrl}/payroll/payslips/${payslipId}/download/`,
    {
      ...getAuthHeaders(),
      responseType: "blob",
    }
  );
  return response.data;
};

export const bulkDownloadPayslips = async (baseUrl, payrollRunId) => {
  const response = await axios.get(
    `${baseUrl}/payroll/payslips/bulk-download/${payrollRunId}/`,
    {
      ...getAuthHeaders(),
      responseType: "blob",
    }
  );
  return response.data;
};

// Approval Workflow APIs
export const getApprovalWorkflow = async (baseUrl, payrollRunId) => {
  const response = await axios.get(
    `${baseUrl}/payroll/approvals/${payrollRunId}/`,
    getAuthHeaders()
  );
  return response.data;
};

export const submitForApproval = async (baseUrl, payrollRunId) => {
  const response = await axios.post(
    `${baseUrl}/payroll/approvals/${payrollRunId}/submit/`,
    {},
    getAuthHeaders()
  );
  return response.data;
};

export const approveWorkflowLevel = async (baseUrl, payrollRunId, levelId, comments = "") => {
  const response = await axios.post(
    `${baseUrl}/payroll/approvals/${payrollRunId}/levels/${levelId}/approve/`,
    { comments },
    getAuthHeaders()
  );
  return response.data;
};

export const rejectWorkflowLevel = async (baseUrl, payrollRunId, levelId, comments) => {
  const response = await axios.post(
    `${baseUrl}/payroll/approvals/${payrollRunId}/levels/${levelId}/reject/`,
    { comments },
    getAuthHeaders()
  );
  return response.data;
};

export default {
  // Dashboard
  getPayrollDashboard,
  
  // Payroll Runs
  getPayrollRuns,
  getPayrollRunById,
  createPayrollRun,
  updatePayrollRun,
  deletePayrollRun,
  approvePayrollRun,
  processPayrollRun,
  
  // Countries & Currencies
  getCountries,
  addCountry,
  updateCountry,
  getCurrencies,
  getExchangeRates,
  updateExchangeRate,
  
  // Salary Components
  getSalaryComponents,
  addSalaryComponent,
  updateSalaryComponent,
  deleteSalaryComponent,
  
  // Tax Management
  getTaxTables,
  updateTaxTable,
  getPFRules,
  updatePFRules,
  getSocialSecurityRules,
  
  // WPS & Payments
  generateWPSFile,
  downloadWPSFile,
  getWPSFiles,
  validateWPSData,
  
  // Claims
  getClaims,
  getClaimById,
  approveClaim,
  rejectClaim,
  postClaimToPayroll,
  
  // AI
  getAIRecommendations,
  getAIAnomalies,
  runAIAnalysis,
  
  // Reports
  getPayrollReports,
  generateReport,
  exportReport,
  
  // Audit
  getAuditLogs,
  getAuditLogById,
  
  // Employees
  getEmployeesForPayroll,
  getEmployeePayrollDetails,
  
  // Payslips
  getPayslips,
  getPayslipById,
  downloadPayslip,
  bulkDownloadPayslips,
  
  // Approvals
  getApprovalWorkflow,
  submitForApproval,
  approveWorkflowLevel,
  rejectWorkflowLevel,
};

