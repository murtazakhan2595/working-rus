import axios from "axios";
import { toast } from "react-toastify";
import { HandleLogout, baseUrl, headers } from "./general";
import { exportRecordToExcel } from "utils/downloadUtils";
import { renderDate, formatDuration } from "utils/renderValues";
import { EmployeeListData } from "app/utils/Types/General";


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
        on_leave_employees: employeeDataResponse.on_leave_employees,
        on_probation_employees: employeeDataResponse.on_probation_employees,
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


// Get employee data for reports with enhanced filtering
export const getEmployeeReportsData = async (payload) => {
  try {
    const response = await getEmployeeCustomList(payload);
    if (response.results) {
      console.log("API response:", response);
      return {
        results: response.results,
        count: response.count,
        ActiveEmployee: response.ActiveEmployee,
        TotalEmployee: response.TotalEmployee,
        TotalManager: response.TotalManager,
        on_leave_employees: response.on_leave_employees,
        on_probation_employees: response.on_probation_employees,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching employee reports data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get age groups for UAE nationals
export const getUAEAgeGroups = async (filterData = {}) => {
  try {
    const response = await axios.get(`${baseUrl}/employees/age-groups-uae/`, {
      headers: headers(),
      params: filterData,
    });

    if (response.data) {
      const ageGroupsData = response.data;

      // Calculate total UAE employees
      const totalUAEEmployees = Object.values(ageGroupsData).reduce(
        (total, group) => total + (group.total || 0),
        0
      );

      return {
        totalUAEEmployees,
        ageGroups: ageGroupsData,
        raw: ageGroupsData,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching UAE age groups:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

// Get all age groups
export const getAllAgeGroups = async (filterData = {}) => {
  try {
    const response = await axios.get(`${baseUrl}/employees/age-groups/`, {
      headers: headers(),
      params: filterData,
    });

    if (response.data) {
      const responseData = response.data;

      // Calculate total employees from age groups
      const totalEmployees = Object.values(responseData.age_groups || {}).reduce(
        (total, group) => total + (group.total || 0),
        0
      );

      return {
        totalEmployees,
        ageGroups: responseData.age_groups || {},
        averageAge: responseData.average_age || 0, // Get average age from backend
        raw: responseData,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching all age groups:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

// Get department gender nationality report
export const getDepartmentGenderNationalityReport = async (filterData = {}) => {
  try {
    const response = await axios.get(
      `${baseUrl}/employees/department-gender-nationality-report/`,
      {
        headers: headers(),
        params: filterData,
      }
    );

    if (response.data && Array.isArray(response.data)) {
      // Transform the API response into a more usable format
      const departmentReport = {};

      response.data.forEach((dept) => {
        departmentReport[dept.department] = {
          total: dept.total_employees,
          male: dept.male,
          female: dept.female,
          male_percentage: parseFloat(dept.male_percentage.replace("%", "")),
          female_percentage: parseFloat(
            dept.female_percentage.replace("%", "")
          ),
          nationalities: dept.top_3_nationalities.reduce((acc, nat) => {
            acc[nat.country] = nat.count;
            return acc;
          }, {}),
          top_3_nationalities: dept.top_3_nationalities,
        };
      });

      return departmentReport;
    }
    return {};
  } catch (error) {
    console.error(
      "Error fetching department gender nationality report:",
      error
    );
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

// Get organizational report data
export const getOrgReport = async (filterData = {}) => {
  try {
    const response = await axios.get(`${baseUrl}/employees/org-report/`, {
      headers: headers(),
      params: filterData,
    });

    if (response.data) {
      return {
        departmentWise: response.data.department_wise || [],
        locationWise: response.data.location_wise || [],
        branchWise: response.data.branch_wise || [],
        grandTotals: response.data.grand_totals || {},
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching organizational report:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

// Get demographics statistics for charts (legacy function for backward compatibility)
export const getDemographicsStats = async (filterData = {}) => {
  try {
    const response = await getEmployeeCustomList({ filterData });
    if (response.results) {
      const employees = response.results;

      // Calculate age groups
      const ageGroups = {
        "20-30": 0,
        "31-40": 0,
        "41-50": 0,
        "51-60": 0,
        "60+": 0,
      };

      // Calculate gender distribution
      const genderDistribution = {
        MALE: 0,
        FEMALE: 0,
        Other: 0,
      };

      // Calculate nationality distribution
      const nationalityDistribution = {};

      // Calculate department distribution
      const departmentDistribution = {};

      employees.forEach((emp) => {
        // Age groups calculation
        const age = parseInt(emp.age);
        if (age >= 20 && age <= 30) ageGroups["20-30"]++;
        else if (age >= 31 && age <= 40) ageGroups["31-40"]++;
        else if (age >= 41 && age <= 50) ageGroups["41-50"]++;
        else if (age >= 51 && age <= 60) ageGroups["51-60"]++;
        else if (age > 60) ageGroups["60+"]++;

        // Gender distribution
        const gender = emp.gender || "Other";
        genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;

        // Nationality distribution
        const nationality = emp.nationality || "Unknown";
        nationalityDistribution[nationality] =
          (nationalityDistribution[nationality] || 0) + 1;

        // Department distribution
        const department = emp.department_name || "Unknown";
        departmentDistribution[department] =
          (departmentDistribution[department] || 0) + 1;
      });

      return {
        totalEmployees: employees.length,
        ageGroups,
        genderDistribution,
        nationalityDistribution,
        departmentDistribution,
        employees,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching demographics stats:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

// Get employee skills and qualifications
export const getEmployeeSkillsQualifications = async (employeeId) => {
  try {
    const [educationResponse, certificationResponse] = await Promise.all([
      axios.get(`${baseUrl}/education/?search={"employee_id":${employeeId}}`, {
        headers: headers(),
      }),
      axios.get(
        `${baseUrl}/certification/?search={"employee_id":${employeeId}}`,
        {
          headers: headers(),
        }
      ),
    ]);

    return {
      education: educationResponse.data?.results || [],
      certifications: certificationResponse.data?.results || [],
    };
  } catch (error) {
    console.error("Error fetching employee skills/qualifications:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { education: [], certifications: [] };
  }
};

export const getDocumentComplianceData = async (payload = {}) => {
  try {
    const response = await getEmployeeCustomList(payload);
    if (response.results) {
      return response;
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching document compliance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get headcount statistics using organizational report API
export const getHeadcountStats = async (filterData = {}) => {
  try {
    // Use the new organizational report API for accurate headcount data
    const orgReport = await getOrgReport(filterData);

    if (orgReport) {
      // Transform department-wise data for headcount analysis
      const departmentHeadcount = {};
      const locationHeadcount = {};
      const branchHeadcount = {};
      const statusHeadcount = {
        active: 0,
        on_leave: 0,
        terminated: 0,
        retired: 0,
      };

      // Process department-wise data
      orgReport.departmentWise.forEach((dept) => {
        departmentHeadcount[dept.department] = {
          total: dept.total,
          active: dept.active,
          onLeave: dept.on_leave,
          terminated: dept.terminated,
          retired: dept.retired,
          locations: dept.locations,
          branches: dept.branches,
        };

        // Aggregate status counts
        statusHeadcount.active += dept.active;
        statusHeadcount.on_leave += dept.on_leave;
        statusHeadcount.terminated += dept.terminated;
        statusHeadcount.retired += dept.retired;
      });

      // Process location-wise data
      orgReport.locationWise.forEach((loc) => {
        locationHeadcount[loc.location] = {
          total: loc.total,
          active: loc.active,
          departments: loc.departments,
          branches: loc.branches,
        };
      });

      // Process branch-wise data
      orgReport.branchWise.forEach((branch) => {
        branchHeadcount[branch.branch] = {
          total: branch.total,
          active: branch.active,
          departments: branch.departments,
          locations: branch.locations,
        };
      });

      return {
        totalEmployees: orgReport.grandTotals.total || 0,
        activeEmployees: orgReport.grandTotals.active || 0,
        totalManagers: 0, // This might need a separate API or calculation
        departmentHeadcount,
        locationHeadcount,
        branchHeadcount,
        statusHeadcount,
        orgReport, // Include raw data for detailed analysis
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching headcount stats:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

// Export employee reports to Excel
export const exportEmployeeReport = async (reportType, filterData = {}) => {
  try {
    let response, dataToExport, filename;

    switch (reportType) {
      case "employee_master":
        response = await getEmployeeReportsData({ filterData });
        dataToExport = response.results.map((emp) => ({
          "Employee ID": emp.serial_number,
          Name: emp.name,
          Designation: emp.department_position,
          Department: emp.department_name,
          Location: emp.employee_location,
          "Date of Joining": renderDate(emp.joining_date),
          "Employment Type": emp.salary_type,
          Status: emp.employee_status,
        }));
        filename = "Employee_Master_Report";
        break;

      case "demographics":
        response = await getEmployeeReportsData({ filterData });
        dataToExport = response.results.map((emp) => ({
          "Employee ID": emp.serial_number,
          Name: emp.name,
          Age: emp.age,
          Gender: emp.gender,
          Nationality: emp.nationality,
          "Date of Joining": renderDate(emp.joining_date),
          "Tenure (Months)": emp.tenure,
        }));
        filename = "Demographics_Report";
        break;

      case "employee_status":
        response = await getEmployeeReportsData({ filterData });
        dataToExport = response.results.map((emp) => ({
          "Employee ID": emp.serial_number,
          Name: emp.name,
          Department: emp.department_name,
          Status: emp.employee_status,
          "Current Leave Balance": "N/A - API Pending",
          "Last Status Change": renderDate(emp.joining_date),
        }));
        filename = "Employee_Status_Report";
        break;

      case "probation_status":
        response = await getEmployeeReportsData({ filterData });
        dataToExport = response.results.map((emp) => ({
          "Employee ID": emp.serial_number,
          Name: emp.name,
          Department: emp.department_name,
          Designation: emp.department_position,
          "Joining Date": renderDate(emp.joining_date),
          "Probation End Date": renderDate(emp.probation_end_date),
          "Probation Status": emp.probation_status,
          "Confirmation Status":
            emp.probation_status === "Completed" ? "Confirmed" : "Pending",
        }));
        filename = "Probation_Status_Report";
        break;

      case "document_compliance":
        response = await getDocumentComplianceData(filterData);
        dataToExport = response.results.map((emp) => ({
          "Employee ID": emp.employee_serial_number,
          Name: emp.employee_name,
          "Passport Status": emp.passport_status,
          "Visa Status": emp.visa_status,
          "Emirates ID Status": emp.emirates_id_status,
          "Compliance Status": emp.compliance_status,
        }));
        filename = "Document_Compliance_Report";
        break;

      case "skills_qualifications":
        response = await getEmployeeReportsData({ filterData });
        dataToExport = response.results.map((emp) => ({
          "Employee ID": emp.serial_number,
          Name: emp.name,
          Department: emp.department_name,
          Designation: emp.department_position,
          Education: emp.education || "N/A - View Details",
          Certifications: emp.certifications || "N/A - View Details",
          Skills: "N/A - API Pending",
        }));
        filename = "Skills_Qualifications_Report";
        break;

      case "contact_report":
        response = await getEmployeeReportsData({ filterData });
        dataToExport = response.results.map((emp) => ({
          "Employee ID": emp.serial_number,
          Name: emp.name,
          Department: emp.department_name,
          "Emergency Contact":
            emp.emergency_first_name && emp.emergency_last_name
              ? `${emp.emergency_first_name} ${emp.emergency_last_name}`
              : "N/A",
          Relationship: emp.emergency_relation || "N/A",
          "Contact Number": emp.emergency_phone_no || "N/A",
          Dependents: "N/A - API Pending",
        }));
        filename = "Contact_Report";
        break;

      case "cross_functional":
        const orgResponse = await getOrgReport(filterData);
        if (orgResponse && orgResponse.departmentWise) {
          dataToExport = orgResponse.departmentWise.map((dept) => ({
            Department: dept.department,
            "Total Employees": dept.total,
            Active: dept.active,
            "On Leave": dept.on_leave,
            Terminated: dept.terminated,
            Retired: dept.retired,
            "Primary Location":
              Object.keys(dept.locations || {})[0] || "Multiple",
            "Branch Count": Object.keys(dept.branches || {}).length,
          }));
        } else {
          dataToExport = [];
        }
        filename = "Cross_Functional_Report";
        break;

      default:
        throw new Error("Invalid report type");
    }

    if (dataToExport && dataToExport.length > 0) {
      exportRecordToExcel(dataToExport, "Employee Reports", filename);
      return true;
    } else {
      toast.error("No data available to export", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  } catch (error) {
    console.error("Error exporting employee report:", error);
    toast.error("Failed to export report", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};

export const getWorkforceReport = async (filterData = {}) => {
  try {
    const response = await axios.get(
      `${baseUrl}/employees/work-force-report/`,
      {
        headers: headers(),
        params: filterData,
      }
    );

    if (response.data) {
      // Transform the API response for better chart usage
      const monthlyData = [];
      const summaryData = {};

      Object.entries(response.data).forEach(([period, data]) => {
        if (period.includes("Total") || period.includes("Q1-Q2")) {
          // This is summary data
          summaryData[period] = data;
        } else {
          // This is monthly data
          monthlyData.push({
            month: period,
            joiners: data.joiners,
            leavers: data.leavers,
            net_change: data.net_change,
            turnover_rate: parseFloat(data.turnover_rate.replace("%", "")),
          });
        }
      });

      return {
        monthlyData,
        summaryData,
        raw: response.data,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching workforce report:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

// Get resignation report data
export const getResignationReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExitClearance/ResignationReport/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching resignation report data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get exit request report data (v1)
export const getExitRequestReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    
    const URL = `/ExitClearance/exit-request-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching exit request report data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get v2 exit request report data (enhanced)
export const getV2ExitRequestReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExitClearance/v2-exit-request-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching v2 exit request report data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get attrition retention report data
export const getAttritionRetentionReportData = async (filterData = {}) => {
  try {
    const response = await axios.get(`${baseUrl}/ExitClearance/AttritionRetentionReport/`, {
      headers: headers(),
      params: filterData,
    });

    if (response.data) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching attrition retention data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Update export function to include clearance pending reports
export const exportExitClearanceReport = async (reportType, filterData = {}) => {
  try {
    let response, dataToExport, filename;

    switch (reportType) {
      case "resignation_report":
        response = await getResignationReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department": item.department,
          "Designation": item.designation,
          "Resignation Date": renderDate(item.resignation_date),
          "Notice Start Date": renderDate(item.notice_start_date),
          "Notice End Date": renderDate(item.notice_end_date),
          "Reason for Leaving": item.reason_for_leaving,
          "Status": item.status,
        }));
        filename = "Resignation_Report";
        break;

      case "v2_exit_request_report":
        response = await getV2ExitRequestReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department": item.department,
          "Exit Type": item.exit_type,
          "Notice Start": renderDate(item.notice_start),
          "Notice End": renderDate(item.notice_end),
          "Nationality": item.nationality,
        }));
        filename = "Enhanced_Exit_Request_Report";
        break;

      case "termination_report":
        response = await getTerminationReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department": item.department,
          "Designation": item.designation,
          "Termination Date": item.termination_date,
          "Termination Type": item.termination_type,
          "Notice Period": item.notice_period,
          "Reason": item.reason_for_termination,
          "Status": item.status,
        }));
        filename = "Termination_Report";
        break;

      case "notice_period_compliance":
        response = await getNoticePeriodComplianceData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department": item.department,
          "Exit Type": item.exit_type,
          "Notice Start": item.notice_start_date,
          "Notice End": item.notice_end_date,
          "Total Days": item.total_notice_days,
          "Served Days": item.served_days,
          "Compliance": item.compliance_status,
        }));
        filename = "Notice_Period_Compliance_Report";
        break;

      case "exit_interview_report":
        response = await getExitInterviewReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Exit Reason": item.exit_reason,
          "Rehire Eligible": item.rehire_eligible,
          "Nationality": item.nationality,
        }));
        filename = "Exit_Interview_Report";
        break;

      case "rehire_eligibility_report":
        response = await getRehireEligibilityReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Exit Type": item.exit_type,
          "Exit Reason": item.exit_reason,
          "HR Decision": item.hr_decision,
          "Eligible for Rehire": item.eligible_for_rehire,
          "Notes": item.notes,
        }));
        filename = "Rehire_Eligibility_Report";
        break;

      case "attrition_retention_report":
        response = await getAttritionRetentionReportData(filterData);
        dataToExport = response.results.map((item) => ({
          "Month": item.month,
          "Department": item.department,
          "Total Employees": item.total_employees,
          "Exits": item.exits,
          "Attrition %": item.attrition_percent,
          "Retention %": item.retention_percent,
        }));
        filename = "Attrition_Retention_Report";
        break;

      case "clearance_pending_report":
        response = await getV2ClearancePendingReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Payroll Status": item.payroll,
          "Assets Status": item.assets,
          "HR Documents Status": item.hr_docs,
          "Nationality": item.nationality,
        }));
        filename = "Clearance_Pending_Report";
        break;

      case "detailed_clearance_pending_report":
        response = await getClearancePendingReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Assets Pending": Array.isArray(item.assets_pending) 
            ? item.assets_pending.filter(asset => asset !== null).join(", ") || "None"
            : "None",
          "Payroll Pending": item.payroll_pending,
          "HR Documents Pending": item.hr_docs_pending,
          "Clearance Status": item.clearance_status,
        }));
        filename = "Detailed_Clearance_Pending_Report";
        break;

      default:
        throw new Error("Invalid report type");
    }

    if (dataToExport && dataToExport.length > 0) {
      exportRecordToExcel(dataToExport, "Exit & Clearance Reports", filename);
      return true;
    } else {
      toast.error("No data available to export", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  } catch (error) {
    console.error("Error exporting exit clearance report:", error);
    toast.error("Failed to export report", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};


// Get termination report data
export const getTerminationReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    
    const URL = `/ExitClearance/v2-termination-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching termination report data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get notice period compliance report data
export const getNoticePeriodComplianceData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    
    const URL = `/ExitClearance/notice-period-compliance-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching notice period compliance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get exit interview report data
export const getExitInterviewReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    
    const URL = `/ExitClearance/Exit-Interview-Report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching exit interview data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get rehire eligibility report data
export const getRehireEligibilityReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    
    const URL = `/ExitClearance/rehire-eligibility-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching rehire eligibility data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get v2 attrition rehire eligibility report data
export const getV2AttritionRehireEligibilityData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    
    const URL = `/ExitClearance/v2-attrition-rehire-eligibility-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching v2 attrition rehire eligibility data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};


// Get clearance pending report data (detailed version)
export const getClearancePendingReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    
    const URL = `/ExitClearance/Clearance-Pending-Report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching clearance pending data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get v2 clearance pending report data (simplified version)
export const getV2ClearancePendingReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    
    const URL = `/ExitClearance/v2-Clearance-Pending-Report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching v2 clearance pending data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};


// ============================================================================
// EMPLOYEE CREATION & HIRING REPORTS API FUNCTIONS
// Add these functions to your existing src/app/hooks/reports.jsx file
// ============================================================================
// Get new hire report data
export const getNewHireReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-joining_date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/EmployeeCreationHiring/EmployeeCreationHiring/new-hire-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching new hire report data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get offer letter compliance data
export const getOfferLetterComplianceData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/EmployeeCreationHiring/offer-letter-compliance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching offer letter compliance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get employee creation TAT data
export const getEmployeeCreationTATData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-tat_days";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/EmployeeCreationHiring/employee-creation-tat/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching employee creation TAT data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get offer letter report data
export const getOfferLetterReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-offer_date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/EmployeeCreationHiring/offer-letter-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching offer letter report data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get pre-onboarding compliance data
export const getPreOnboardingComplianceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/EmployeeCreationHiring/pre-onboarding-compliance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching pre-onboarding compliance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get probation completion data
export const getProbationCompletionReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "probation_end_date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/EmployeeCreationHiring/probation-completion/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching probation completion data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Export hiring reports
export const exportHiringReport = async (reportType, filterData = {}) => {
  try {
    let response, dataToExport, filename;

    switch (reportType) {
      case "new_hire":
        response = await getNewHireReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Designation": item.designation,
          "Department": item.department,
          "Joining Date": renderDate(item.joining_date),
          "Location": item.location,
          "Status": item.status,
        }));
        filename = "New_Hire_Report";
        break;

      case "onboarding_status":
        response = await getOfferLetterComplianceData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Offer Status": item.offer_status,
          "Background Check": item.background_check,
          "Medical Done": item.medical_done,
          "Visa Processing": item.visa_processing,
          "Nationality": item.nationality,
        }));
        filename = "Onboarding_Status_Report";
        break;

      case "creation_tat":
        response = await getEmployeeCreationTATData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department": item.department,
          "Date of Joining": item.date_of_joining,
          "Employee Created on HRMS": item.employee_created_on_hrms,
          "TAT (Days)": item.tat_days,
          "Status": item.status,
        }));
        filename = "Employee_Creation_TAT_Report";
        break;

      case "offer_letter":
        response = await getOfferLetterReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Designation": item.designation,
          "Offer Date": item.offer_date,
          "Status": item.status,
          "Acceptance Date": item.acceptance_date,
          "Remarks": item.remarks,
        }));
        filename = "Offer_Letter_Report";
        break;

      case "pre_onboarding":
        response = await getPreOnboardingComplianceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Background Check": item.background_check,
          "Medical Check": item.medical_check,
          "Visa Processing": item.visa_processing,
          "Other Compliance": item.other_compliance,
          "Status": item.status,
        }));
        filename = "Pre_Onboarding_Compliance_Report";
        break;

      case "probation_completion":
        response = await getProbationCompletionReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department": item.department,
          "Joining Date": item.joining_date,
          "Probation End Date": item.probation_end_date,
          "Confirmation Status": item.confirmation_status,
          "Action Required": item.action_required,
          "Days Remaining": item.days_remaining,
        }));
        filename = "Probation_Completion_Report";
        break;

      default:
        throw new Error("Invalid report type");
    }

    if (dataToExport && dataToExport.length > 0) {
      exportRecordToExcel(dataToExport, "Employee Creation & Hiring Reports", filename);
      return true;
    } else {
      toast.error("No data available to export", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  } catch (error) {
    console.error("Error exporting hiring report:", error);
    toast.error("Failed to export report", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};


// ============================================================================
// HR DOCUMENTS REPORTS API FUNCTIONS
// Add these functions to your existing src/app/hooks/reports.jsx file
// ============================================================================

// Get document expiry data
export const getDocumentExpiryData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-days_remaining";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/HRDocuments/document-expiry/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching document expiry data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get missing documents data
export const getMissingDocumentsData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/HRDocuments/missing-documents/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching missing documents data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get document access data
export const getDocumentAccessData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/HRDocuments/document-access/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching document access data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get visa & work permit expiry data
export const getVisaPermitExpiryData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-days_remaining";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/HRDocuments/visa-permit/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching visa permit data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get contract renewal data
export const getContractRenewalData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-days_remaining";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/HRDocuments/contract-renewal/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching contract renewal data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get policy acknowledgement data
export const getPolicyAcknowledgementData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/HRDocuments/policy-acknowledgement/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching policy acknowledgement data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Export HR document reports
export const exportHRDocumentReport = async (reportType, filterData = {}) => {
  try {
    let response, dataToExport, filename;

    switch (reportType) {
      case "document_expiry":
        response = await getDocumentExpiryData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Department": item.department,
          "Document Type": item.document_type,
          "Document Number": item.document_number,
          "Issue Date": item.issue_date,
          "Expiry Date": item.expiry_date,
          "Days Remaining": item.days_remaining,
          "Status": item.status,
        }));
        filename = "Document_Expiry_Report";
        break;

      case "missing_documents":
        response = await getMissingDocumentsData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Department": item.department,
          "Missing Documents": item.missing_documents,
          "Status": item.status,
        }));
        filename = "Missing_Documents_Report";
        break;

      case "document_access":
        response = await getDocumentAccessData({ filterData });
        dataToExport = response.results.map((item) => ({
          "ID": item.id,
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Document Name": item.document_name,
          "Expiry Date": item.expiry_date || "N/A",
          "Has Expiry Date": item.has_expiry_date ? "Yes" : "No",
          "Is Active": item.is_active ? "Yes" : "No",
        }));
        filename = "Document_Access_Report";
        break;

      case "visa_permit_expiry":
        response = await getVisaPermitExpiryData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Country": item.country,
          "Visa Type": item.visa_type,
          "Visa Number": item.visa_number || "N/A",
          "Issue Date": item.issue_date || "N/A",
          "Expiry Date": item.expiry_date || "N/A",
          "Days Remaining": item.days_remaining || "N/A",
          "Status": item.status,
        }));
        filename = "Visa_Permit_Expiry_Report";
        break;

      case "contract_renewal":
        response = await getContractRenewalData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Department": item.department,
          "Contract Type": item.contract_type,
          "Start Date": item.start_date,
          "End Date": item.end_date,
          "Days Remaining": item.days_remaining,
          "Renewal Status": item.renewal_status,
        }));
        filename = "Contract_Renewal_Report";
        break;

      case "policy_acknowledgement":
        response = await getPolicyAcknowledgementData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Policy Name": item.policy_name || "N/A",
          "Acknowledged": item.acknowledged,
          "Acknowledgement Date": item.acknowledgement_date || "N/A",
          "Status": item.status,
        }));
        filename = "Policy_Acknowledgement_Report";
        break;

      default:
        throw new Error("Invalid report type");
    }

    if (dataToExport && dataToExport.length > 0) {
      exportRecordToExcel(dataToExport, "HR Documents Reports", filename);
      return true;
    } else {
      toast.error("No data available to export", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  } catch (error) {
    console.error("Error exporting HR document report:", error);
    toast.error("Failed to export report", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};



// ============================================================================
// TRANSFER & ROTATION REPORTS API FUNCTIONS
// Add these functions to your existing src/app/hooks/reports.jsx file
// ============================================================================

// Get transfer report data
export const getTransferReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-transfer_request_date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/transfers/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching transfer report data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get job rotation history data
export const getJobRotationHistoryData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-rotation_date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/job-rotation-history/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching job rotation history data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get pending transfer approvals data
export const getPendingTransferApprovalsData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-request_date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/pending-transfer-approvals/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching pending transfer approvals data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get transfer cost impact data
export const getTransferCostImpactData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-total_cost";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/transfer-cost-impact-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching transfer cost impact data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get rotation compliance data
export const getRotationComplianceData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-rotation_date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/rotation-compilance-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching rotation compliance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get transfer rejection data
export const getTransferRejectionData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-rejection_date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/transfer-rejection-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching transfer rejection data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get rotation skill gap data
export const getRotationSkillGapData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "employee_name";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/rotation-skill-gap-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching rotation skill gap data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get employee rotation frequency data
export const getEmployeeRotationFrequencyData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-total_rotations";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/employee-rotation-frequency-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching employee rotation frequency data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get transfer approval timeline data
export const getTransferApprovalTimelineData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/transfer-approval-timeline-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching transfer approval timeline data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get cross department transfer data
export const getCrossDepartmentTransferData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TransferRotation/cross-department-transfers/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
      };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching cross department transfer data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get transfer rotation dashboard data
export const getTransferRotationDashboardData = async (filterData = {}) => {
  try {
    const response = await axios.get(`${baseUrl}/TransferRotation/transfer-rotation-dashboard/`, {
      headers: headers(),
      params: filterData,
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching transfer rotation dashboard data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

// Export transfer rotation reports
export const exportTransferRotationReport = async (reportType, filterData = {}) => {
  try {
    let response, dataToExport, filename;

    switch (reportType) {
      case "transfer_reports":
        response = await getTransferReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Current Department": item.current_department,
          "New Department": item.new_department,
          "Transfer Type": item.transfer_type,
          "Request Date": item.transfer_request_date,
          "Effective Date": item.effective_date,
          "Status": item.status,
        }));
        filename = "Transfer_Reports";
        break;

      case "job_rotation_history":
        response = await getJobRotationHistoryData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department History": item.department_history,
          "Designation History": item.designation_history,
          "Rotation Date": item.rotation_date,
          "Duration in Previous Role": item.duration_in_previous_role,
          "Reason for Rotation": item.reason_for_rotation,
        }));
        filename = "Job_Rotation_History";
        break;

      case "pending_approvals":
        response = await getPendingTransferApprovalsData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department": item.department,
          "Transfer Type": item.transfer_type,
          "Request Date": item.request_date,
          "Requested By": item.requested_by,
          "Approver": item.approver,
          "Status": item.status,
        }));
        filename = "Pending_Transfer_Approvals";
        break;

      case "cost_impact":
        response = await getTransferCostImpactData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Transfer Type": item.transfer_type,
          "Relocation Cost": item.relocation_cost,
          "Training Cost": item.training_cost,
          "Onboarding Cost": item.onboarding_cost,
          "Total Cost": item.total_cost,
          "Notes": item.notes,
        }));
        filename = "Transfer_Cost_Impact";
        break;

      case "rotation_compliance":
        response = await getRotationComplianceData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.name,
          "Department": item.department,
          "Designation": item.designation,
          "Rotation Date": item.rotation_date,
          "Last Rotation Date": item.last_rotation_date,
          "Rotation Interval (Months)": item.rotation_interval_months,
          "Compliance Status": item.compliance_status,
          "Notes": item.notes,
        }));
        filename = "Rotation_Compliance";
        break;

      case "skill_gap_analysis":
        response = await getRotationSkillGapData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Name": item.employee_name,
          "Current Role": item.current_role,
          "Rotated Role": item.rotated_role,
          "Required Skills": item.required_skills,
          "Employee Skills": item.employee_skills,
          "Skill Gap": item.skill_gap,
          "Training Required": item.training_required,
        }));
        filename = "Rotation_Skill_Gap_Analysis";
        break;

      default:
        throw new Error("Invalid report type");
    }

    if (dataToExport && dataToExport.length > 0) {
      exportRecordToExcel(dataToExport, "Transfer & Rotation Reports", filename);
      return true;
    } else {
      toast.error("No data available to export", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  } catch (error) {
    console.error("Error exporting transfer rotation report:", error);
    toast.error("Failed to export report", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};


// ============================================================================
// ATTENDANCE & SHIFT REPORTS API FUNCTIONS - UPDATED WITH AGGREGATED STATS
// Replace the existing functions in your src/app/hooks/reports.jsx file
// ============================================================================

// ============================================================================
// CORE ATTENDANCE REPORTS
// ============================================================================

// Get daily attendance report data
export const getDailyAttendanceData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/daily-attendence/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching daily attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get monthly attendance report data
export const getMonthlyAttendanceData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "EmployeeID";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/montly-attendence/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching monthly attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get yearly attendance report data  
export const getYearlyAttendanceData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "EmployeeID";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/yearly-attendance-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching yearly attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// ============================================================================
// ATTENDANCE ISSUES & EXCEPTIONS REPORTS  
// ============================================================================

// Get absenteeism report data
export const getAbsenteeismReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/absenteeism-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching absenteeism data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get late arrival report data
export const getLateArrivalReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/late-arrival-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching late arrival data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get early departure report data
export const getEarlyDepartureReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/early-departure-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching early departure data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get no punch report data
export const getNoPunchReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/no-punch-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching no punch data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// ============================================================================
// TIME MANAGEMENT REPORTS
// ============================================================================

// Get overtime report data
export const getOvertimeReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/overtime-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching overtime data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get idle/undertime report data
export const getIdleUndertimeReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/idle-undertime-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching idle undertime data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get attendance vs leave report data
export const getAttendanceVsLeaveReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceReports/attendance-vs-leave-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching attendance vs leave data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// ============================================================================
// SHIFT MANAGEMENT REPORTS
// ============================================================================

// Get shift allocation report data
export const getShiftAllocationReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee_ID";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ShiftCalendarSchedulingReports/shift-allocation-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching shift allocation data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get shift vs actual attendance data
export const getShiftVsActualAttendanceData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ShiftCalendarSchedulingReports/shift-vs-actual-attendance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching shift vs actual attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get shift compliance report data
export const getShiftComplianceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ShiftCalendarSchedulingReports/shift-compliance-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching shift compliance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get shift coverage report data
export const getShiftCoverageReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ShiftCalendarSchedulingReports/shift-coverage-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching shift coverage data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get shift swapping report data
export const getShiftSwappingReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Request_ID";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ShiftCalendarSchedulingReports/shift-swapping-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching shift swapping data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get weekly shift calendar data
export const getWeeklyShiftCalendarData = async (payload) => {
  try {
    const filterData = payload?.filterData ?? {};

    const URL = `/ShiftCalendarSchedulingReports/weekly-shift-calendar/?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        week_period: response.data.week_period,
        schedule: response.data.schedule || [],
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { week_period: "", schedule: [], aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching weekly shift calendar data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { week_period: "", schedule: [], aggregated_stats: null };
  }
};

// Get holiday special shift report data
export const getHolidaySpecialShiftReportData = async (payload) => {
  try {
    const filterData = payload?.filterData ?? {};

    const URL = `/ShiftCalendarSchedulingReports/holiday-special-shift-report/?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        month: response.data.month,
        results: response.data.results || [],
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { month: "", results: [], aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching holiday special shift data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { month: "", results: [], aggregated_stats: null };
  }
};

// Get weekend work report data
export const getWeekendWorkReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "Employee";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ShiftCalendarSchedulingReports/weekend-work-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null, // ✅ ADDED
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching weekend work data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// ============================================================================
// EXCEL EXPORT FUNCTIONALITY - UNCHANGED
// ============================================================================

// Export attendance and shift reports
export const exportAttendanceShiftReport = async (reportType, filterData = {}) => {
  try {
    let response, dataToExport, filename;

    switch (reportType) {
      case "daily_attendance":
        response = await getDailyAttendanceData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.EmployeeID,
          "Name": item.Name,
          "Department": item.Dept,
          "Shift": item.Shift,
          "Check In": item.CheckIn,
          "Check Out": item.CheckOut,
          "Date": item.date,
          "Status": item.Status,
          "Remarks": item.Remarks,
        }));
        filename = "Daily_Attendance_Report";
        break;

      case "monthly_attendance":
        response = await getMonthlyAttendanceData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.EmployeeID,
          "Name": item.Name,
          "Department": item.Dept,
          "Total Days": item.TotalDays,
          "Presents": item.Presents,
          "Absents": item.Absents,
          "Lates": item.Lates,
          "Early Exits": item.EarlyExits,
          "Overtime Hours": item.OvertimeHrs,
          "Remarks": item.Remarks,
        }));
        filename = "Monthly_Attendance_Report";
        break;

      case "yearly_attendance":
        response = await getYearlyAttendanceData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.EmployeeID,
          "Employee": item.Employee,
          "Department": item.Department,
          "Year": item.Year,
          "Working Days": item.WorkingDays,
          "Present Days": item.PresentDays,
          "Absents": item.Absents,
          "On Leave": item.OnLeave,
          "Remote Days": item.RemoteDays,
          "Attendance %": item.AttendancePercentage,
        }));
        filename = "Yearly_Attendance_Report";
        break;

      case "absenteeism_report":
        response = await getAbsenteeismReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Department": item.Department,
          "Period": item.Period,
          "Year": item.Year,
          "Absents": item.Absents,
          "Reason Trend": item.ReasonTrend,
        }));
        filename = "Absenteeism_Report";
        break;

      case "late_arrival_report":
        response = await getLateArrivalReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Month": item.Month,
          "Lates": item.Lates,
          "Total Late Hours": item.TotalLateHours,
          "Pattern": item.Pattern,
        }));
        filename = "Late_Arrival_Report";
        break;

      case "early_departure_report":
        response = await getEarlyDepartureReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Month": item.Month,
          "Early Exits": item.EarlyExits,
          "Time Lost": item.TimeLost,
          "Reason": item.Reason,
        }));
        filename = "Early_Departure_Report";
        break;

      case "no_punch_report":
        response = await getNoPunchReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Department": item.Department,
          "Date": item.Date,
          "Dates Missing": item.DatesMissing,
          "Remarks": item.Remarks,
        }));
        filename = "No_Punch_Report";
        break;

      case "overtime_report":
        response = await getOvertimeReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Department": item.Department,
          "Overtime Hours": item.OvertimeHours,
          "Status": item.Status,
          "Date Range": item.DateRange,
        }));
        filename = "Overtime_Report";
        break;

      case "idle_undertime_report":
        response = await getIdleUndertimeReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Period": item.Period,
          "Expected Hours": item.ExpectedHours,
          "Worked Hours": item.WorkedHours,
          "Shortfall": item.Shortfall,
          "Remarks": item.Remarks,
        }));
        filename = "Idle_Undertime_Report";
        break;

      case "attendance_vs_leave_report":
        response = await getAttendanceVsLeaveReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Department": item.Department,
          "Date": item.Date,
          "Leave Type": item.LeaveType,
          "Attendance Status": item.AttendanceStatus,
          "Conflict": item.Conflict,
        }));
        filename = "Attendance_Vs_Leave_Report";
        break;

      case "shift_allocation_report":
        response = await getShiftAllocationReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.Employee_ID,
          "Name": item.Name,
          "Department": item.Department,
          "Monday": item.Mon,
          "Tuesday": item.Tue,
          "Wednesday": item.Wed,
          "Thursday": item.Thu,
          "Friday": item.Fri,
          "Saturday": item.Sat,
          "Sunday": item.Sun,
        }));
        filename = "Shift_Allocation_Report";
        break;

      case "shift_vs_actual_attendance":
        response = await getShiftVsActualAttendanceData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Date": item.Date,
          "Planned Shift": item.Planned_Shift,
          "Scheduled Time": item.Scheduled_Time,
          "Actual In": item.Actual_In,
          "Actual Out": item.Actual_Out,
          "Compliance": item.Compliance,
          "Status": item.Status,
          "Remarks": item.Remarks,
        }));
        filename = "Shift_Vs_Actual_Attendance_Report";
        break;

      case "shift_compliance_report":
        response = await getShiftComplianceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Department": item.Department,
          "Assigned Shifts": item.Assigned_Shifts,
          "Deviations": item.Deviations,
          "Compliance Rate": item.Compliance_Rate,
          "Remarks": item.Remarks,
        }));
        filename = "Shift_Compliance_Report";
        break;

      case "shift_coverage_report":
        response = await getShiftCoverageReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Department": item.Department,
          "Assigned Shifts": item.Assigned_Shifts,
          "Deviations": item.Deviations,
          "Compliance Rate": item.Compliance_Rate,
          "Remarks": item.Remarks,
        }));
        filename = "Shift_Coverage_Report";
        break;

      case "shift_swapping_report":
        response = await getShiftSwappingReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Request ID": item.Request_ID,
          "Requested By": item.Requested_By,
          "Employee": item.Employee,
          "Date": item.Date,
          "Swap Details": item.Swap_Details,
          "Status": item.Status,
          "Requested Date": item.Requested_Date,
          "Reviewed By": item.Reviewed_By,
          "Remarks": item.Remarks,
        }));
        filename = "Shift_Swapping_Report";
        break;

      case "weekend_work_report":
        response = await getWeekendWorkReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee": item.Employee,
          "Weekend Dates Worked": item["Weekend Dates Worked"],
          "Hours": item.Hours,
          "Reason": item.Reason,
        }));
        filename = "Weekend_Work_Report";
        break;

      default:
        throw new Error("Invalid report type");
    }

    if (dataToExport && dataToExport.length > 0) {
      exportRecordToExcel(dataToExport, "Attendance & Shift Reports", filename);
      return true;
    } else {
      toast.error("No data available to export", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  } catch (error) {
    console.error("Error exporting attendance shift report:", error);
    toast.error("Failed to export report", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};

// ============================================================================
// TIME ADJUSTMENT REPORTS API FUNCTIONS
// Add these to your src/app/hooks/reports.jsx file
// ============================================================================

// Get time adjustment request report data
export const getTimeAdjustmentReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-Request_ID";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/TimeAdjustmentReports/time-adjustment-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
        period: response.data.period || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null, period: null };
  } catch (error) {
    console.error("Error fetching time adjustment data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null, period: null };
  }
};

// Get time adjustment status report data
export const getTimeAdjustmentStatusReportData = async (payload) => {
  try {
    const filterData = payload?.filterData ?? {};

    const URL = `/TimeAdjustmentReports/time-adjustment-status/?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching time adjustment status data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get reason analysis report data
export const getReasonAnalysisReportData = async (payload) => {
  try {
    const filterData = payload?.filterData ?? {};

    const URL = `/TimeAdjustmentReports/reason-analysis-report/?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.Report || [],
        period: response.data.Period || null,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], period: null, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching reason analysis data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], period: null, aggregated_stats: null };
  }
};

// Get manager approval report data
export const getManagerApprovalReportData = async (payload) => {
  try {
    const filterData = payload?.filterData ?? {};

    const URL = `/TimeAdjustmentReports/manager-approval-report/?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.Report || [],
        period: response.data.Period || null,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], period: null, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching manager approval data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], period: null, aggregated_stats: null };
  }
};

// Get repeat adjustment report data
export const getRepeatAdjustmentReportData = async (payload) => {
  try {
    const filterData = payload?.filterData ?? {};

    const URL = `/TimeAdjustmentReports/repeat-adjustment-report/?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.Report || [],
        period: response.data.Period || null,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], period: null, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching repeat adjustment data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], period: null, aggregated_stats: null };
  }
};

export const exportTimeAdjustmentReport = async (
  reportType,
  filterData = {}
) => {
  try {
    let response, dataToExport, filename;

    switch (reportType) {
      case "time_adjustment_request_report":
        response = await getTimeAdjustmentReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Request ID": item.Request_ID,
          Employee: item.Employee,
          Department: item.Dept,
          Date: item.Date,
          "Requested Change": item.Requested_Change,
          Reason: item.Reason,
          Status: item.Status,
        }));
        filename = "Time_Adjustment_Request_Report";
        break;

      case "adjustment_status_report":
        response = await getTimeAdjustmentStatusReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          Status: item.Status,
          Count: item.Count,
          "Percentage of Total": item["% of Total"],
        }));
        filename = "Time_Adjustment_Status_Report";
        break;

      case "reason_analysis_report":
        response = await getReasonAnalysisReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Reason Type": item["Reason Type"],
          "Number of Requests": item["No. of Requests"],
          "Share Percentage": item["% Share"],
          "Example Employee": item["Example Employee"],
        }));
        filename = "Time_Adjustment_Reason_Analysis_Report";
        break;

      case "manager_approval_report":
        response = await getManagerApprovalReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          Manager: item.Manager,
          "Requests Reviewed": item.Requests_Reviewed,
          Approved: item.Approved,
          Rejected: item.Rejected,
          Pending: item.Pending,
          "Approval Rate": item.Approval_Rate,
        }));
        filename = "Manager_Approval_Report";
        break;

      case "repeat_adjustment_report":
        response = await getRepeatAdjustmentReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          Employee: item.Employee,
          Department: item["Dept."],
          "Number of Requests": item["No. of Requests"],
          "Common Reason": item["Common Reason"],
          "Risk Level": item["Risk Level"],
        }));
        filename = "Repeat_Adjustment_Report";
        break;

      default:
        throw new Error("Invalid time adjustment report type");
    }

    if (dataToExport && dataToExport.length > 0) {
      exportRecordToExcel(dataToExport, "Time Adjustment Reports", filename);
      return true;
    } else {
      toast.error("No data available to export", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  } catch (error) {
    console.error("Error exporting time adjustment report:", error);
    toast.error("Failed to export report", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};

// ============================================================================
// 4️⃣ ATTENDANCE UPDATES & AUDIT REPORTS API FUNCTIONS
// Add these to your src/app/hooks/reports.jsx file
// ============================================================================

// Get updated attendance report data
export const getUpdatedAttendanceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-employee_id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceUpdatesAuditReports/updated-attendance-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching updated attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get HR/Admin correction report data
export const getHRAdminCorrectionReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-employee_id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceUpdatesAuditReports/hr-admin-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching HR admin correction data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get audit trail report data
export const getAuditTrailReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-timestamp";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceUpdatesAuditReports/audit-trail-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching audit trail data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get compliance breach report data
export const getComplianceBreachReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-timestamp";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceUpdatesAuditReports/compliance-breaches/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching compliance breach data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get attendance update history data
export const getAttendanceUpdateHistoryData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-modified_on";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AttendanceUpdatesAuditReports/attendance-update-history/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data || [],
        count: response.data.length || 0,
        aggregated_stats: null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching update history data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// ============================================================================
// 5️⃣ EXCEPTION & SPECIAL CONDITION REPORTS API FUNCTIONS
// ============================================================================

// Get missing punch report data
export const getMissingPunchReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExceptionSpecialConditionReports/missing-punch-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching missing punch data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get multiple punch report data
export const getMultiplePunchReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExceptionSpecialConditionReports/multiple-punch-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching multiple punch data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get half day report data
export const getHalfDayReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExceptionSpecialConditionReports/half-day-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching half day data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get grace period usage report data
export const getGracePeriodUsageReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-frequency_this_month";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExceptionSpecialConditionReports/grace-period-usage/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching grace period usage data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get frequent breaks report data
export const getFrequentBreaksReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-total_break_duration";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExceptionSpecialConditionReports/frequent-breaks/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching frequent breaks data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get remote work report data
export const getRemoteWorkReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExceptionSpecialConditionReports/remote-work-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching remote work data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get business trip report data
export const getBusinessTripReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-date";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/ExceptionSpecialConditionReports/business-trip-report/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching business trip data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// ============================================================================
// 6️⃣ DEPARTMENT & MANAGERIAL REPORTS API FUNCTIONS
// ============================================================================

// Get department attendance report data
export const getDepartmentAttendanceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-attendance_percent";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/DepartmentManagerialReports/department-attendance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching department attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get team attendance report data
export const getTeamAttendanceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-present";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/DepartmentManagerialReports/team-attendance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching team attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get manager attendance report data
export const getManagerAttendanceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-present";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/DepartmentManagerialReports/manager-attendance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching manager attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get branch attendance report data
export const getBranchAttendanceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-present";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/DepartmentManagerialReports/branch-attendance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching branch attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get comparative attendance report data
export const getComparativeAttendanceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-avg_attendance";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/DepartmentManagerialReports/comparative-attendance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching comparative attendance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// ============================================================================
// 7️⃣ ANALYTICS, TRENDS & COMPLIANCE REPORTS API FUNCTIONS
// ============================================================================

// Get attendance trend report data
export const getAttendanceTrendReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-present";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AnalyticsTrendsComplianceReports/attendance-trends/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching attendance trend data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get shift utilization report data
export const getShiftUtilizationReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-total_employees";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AnalyticsTrendsComplianceReports/shift-utilization/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching shift utilization data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get overtime trend report data
export const getOvertimeTrendReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-total_ot_hours";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AnalyticsTrendsComplianceReports/overtime-trends/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching overtime trend data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get attrition risk report data
export const getAttritionRiskReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-employee_id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AnalyticsTrendsComplianceReports/attrition-risk/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching attrition risk data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get labor law compliance report data
export const getLaborLawComplianceReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-employee_id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AnalyticsTrendsComplianceReports/labor-law-compliance/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching labor law compliance data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get payroll integration report data
export const getPayrollIntegrationReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-employee_id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AnalyticsTrendsComplianceReports/payroll-integration/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching payroll integration data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// Get alerts threshold report data
export const getAlertsThresholdReportData = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-late_arrival";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};

    const URL = `/AnalyticsTrendsComplianceReports/alerts-thresholds/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        aggregated_stats: response.data.aggregated_stats || null,
      };
    }
    return { results: [], count: 0, aggregated_stats: null };
  } catch (error) {
    console.error("Error fetching alerts threshold data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0, aggregated_stats: null };
  }
};

// ============================================================================
// EXPORT FUNCTIONALITY FOR REMAINING REPORTS
// ============================================================================

export const exportRemainingReports = async (reportType, filterData = {}) => {
  try {
    let response, dataToExport, filename;

    switch (reportType) {
      // 4️⃣ Attendance Updates & Audit Reports
      case "updated_attendance_report":
        response = await getUpdatedAttendanceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Original In": item.original_in,
          "Updated In": item.updated_in,
          "Original Out": item.original_out,
          "Updated Out": item.updated_out,
          "Updated By": item.updated_by,
          "Update Date": item.update_date,
          "Reason/Remarks": item.reason_remarks,
        }));
        filename = "Updated_Attendance_Report";
        break;

      case "hr_admin_correction_report":
        response = await getHRAdminCorrectionReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Date": item.date,
          "Field Changed": item.field_changed,
          "Old Value": item.old_value,
          "New Value": item.new_value,
          "Changed By": item.changed_by,
          "Reason/Remarks": item.reason_remarks,
        }));
        filename = "HR_Admin_Correction_Report";
        break;

      case "audit_trail_report":
        response = await getAuditTrailReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Change ID": item.change_id,
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Action": item.action,
          "Field Affected": item.field_affected,
          "Old Value": item.old_value,
          "New Value": item.new_value,
          "Performed By": item.performed_by,
          "Timestamp": item.timestamp,
          "Reason": item.reason,
        }));
        filename = "Audit_Trail_Report";
        break;

      case "compliance_breach_report":
        response = await getComplianceBreachReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Breach ID": item.breach_id,
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Date": item.date,
          "Breach Type": item.breach_type,
          "Changed By": item.changed_by,
          "Timestamp": item.timestamp,
          "Status": item.status,
        }));
        filename = "Compliance_Breach_Report";
        break;

      case "attendance_update_history":
        response = await getAttendanceUpdateHistoryData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Change ID": item.change_id,
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Date": item.date,
          "Version No": item.version_no,
          "In Time": item.in_time,
          "Out Time": item.out_time,
          "Modified By": item.modified_by,
          "Modified On": item.modified_on,
          "Remarks": item.remarks,
        }));
        filename = "Attendance_Update_History";
        break;

      // 5️⃣ Exception & Special Condition Reports
      case "missing_punch_report":
        response = await getMissingPunchReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Date": item.date,
          "Missing Punch Type": item.missing_punch_type,
          "Recorded Punches": JSON.stringify(item.recorded_punches),
          "Status": item.status,
        }));
        filename = "Missing_Punch_Report";
        break;

      case "multiple_punch_report":
        response = await getMultiplePunchReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "User No": item.user_no,
          "Date": item.date,
          "Total Punches": item.total_punches,
        }));
        filename = "Multiple_Punch_Report";
        break;

      case "half_day_report":
        response = await getHalfDayReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Date": item.date,
          "Expected Hours": item.expected_hours,
          "Actual Hours": item.actual_hours,
          "Status": item.status,
          "Reason": item.reason,
        }));
        filename = "Half_Day_Report";
        break;

      case "grace_period_usage_report":
        response = await getGracePeriodUsageReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Date": item.date,
          "Shift Start": item.shift_start,
          "In Time": item.in_time,
          "Grace Period": item.grace_period,
          "Used Grace": item.used_grace,
          "Frequency This Month": item.frequency_this_month,
        }));
        filename = "Grace_Period_Usage_Report";
        break;

      case "frequent_breaks_report":
        response = await getFrequentBreaksReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Date": item.date,
          "Breaks Taken": item.breaks_taken,
          "Total Break Duration": item.total_break_duration,
        }));
        filename = "Frequent_Breaks_Report";
        break;

      case "remote_work_report":
        response = await getRemoteWorkReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Date": item.date,
          "Punch Type": item.punch_type,
          "Location Logged": item.location_logged,
          "Geo-Fence Compliance": item.geo_fence_compliance,
          "Remarks": item.remarks,
        }));
        filename = "Remote_Work_Report";
        break;

      case "business_trip_report":
        response = await getBusinessTripReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Date": item.date,
          "Trip Location": item.trip_location,
          "Duration": item.duration,
          "Approved By": item.approved_by,
          "Status": item.status,
        }));
        filename = "Business_Trip_Report";
        break;

      // 6️⃣ Department & Managerial Reports
      case "department_attendance_report":
        response = await getDepartmentAttendanceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Department": item.department,
          "Total Employees": item.total_employees,
          "Present": item.present,
          "Absent": item.absent,
          "On Leave": item.on_leave,
          "Attendance Percent": item.attendance_percent,
        }));
        filename = "Department_Attendance_Report";
        break;

      case "team_attendance_report":
        response = await getTeamAttendanceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Team Name": item.team_name,
          "Total Members": item.total_members,
          "Present": item.present,
          "Absent": item.absent,
          "Leave": item.leave,
        }));
        filename = "Team_Attendance_Report";
        break;

      case "manager_attendance_report":
        response = await getManagerAttendanceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Manager Name": item.manager_name,
          "Present": item.present,
          "Absent": item.absent,
          "Leave": item.leave,
        }));
        filename = "Manager_Attendance_Report";
        break;

      case "branch_attendance_report":
        response = await getBranchAttendanceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Branch": item.branch,
          "Total Employees": item.total_employees,
          "Present": item.present,
          "Absent": item.absent,
          "On Leave": item.on_leave,
        }));
        filename = "Branch_Attendance_Report";
        break;

      case "comparative_attendance_report":
        response = await getComparativeAttendanceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Unit": item.unit,
          "Avg Attendance": item.avg_attendance,
          "Highest Attendance Day": item.highest_attendance_day,
          "Lowest Attendance Day": item.lowest_attendance_day,
        }));
        filename = "Comparative_Attendance_Report";
        break;

      // 7️⃣ Analytics, Trends & Compliance Reports
      case "attendance_trend_report":
        response = await getAttendanceTrendReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Department": item.department,
          "Total Days": item.total_days,
          "Present": item.present,
          "Absent": item.absent,
          "Late Arrivals": item.late_arrivals,
        }));
        filename = "Attendance_Trend_Report";
        break;

      case "shift_utilization_report":
        response = await getShiftUtilizationReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Shift Name": item.shift_name,
          "Total Employees": item.total_employees,
        }));
        filename = "Shift_Utilization_Report";
        break;

      case "overtime_trend_report":
        response = await getOvertimeTrendReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Department": item.department,
          "Total OT Hours": item.total_ot_hours,
          "Avg OT per Employee": item.avg_ot_per_employee,
          "Exceeding Limit": item.exceeding_limit,
        }));
        filename = "Overtime_Trend_Report";
        break;

      case "attrition_risk_report":
        response = await getAttritionRiskReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Department": item.department,
          "Absent Days": item.absent_days,
          "Late Arrivals": item.late_arrivals,
          "Risk Level": item.risk_level,
          "Remarks": item.remarks,
        }));
        filename = "Attrition_Risk_Report";
        break;

      case "labor_law_compliance_report":
        response = await getLaborLawComplianceReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Total Hours": item.total_hours,
          "Overtime Hours": item.overtime_hours,
          "Weekly Offs": item.weekly_offs,
          "Non Compliance": item.non_compliance,
        }));
        filename = "Labor_Law_Compliance_Report";
        break;

      case "payroll_integration_report":
        response = await getPayrollIntegrationReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Total Days": item.total_days,
          "Present": item.present,
          "Payable Days": item.payable_days,
          "Leave Without Pay": item.leave_without_pay,
          "Adjustments": item.adjustments,
        }));
        filename = "Payroll_Integration_Report";
        break;

      case "alerts_threshold_report":
        response = await getAlertsThresholdReportData({ filterData });
        dataToExport = response.results.map((item) => ({
          "Employee ID": item.employee_id,
          "Employee Name": item.employee_name,
          "Department": item.department,
          "Absenteeism": item.absenteeism,
          "OT Limit": item.ot_limit,
          "Late Arrival": item.late_arrival,
        }));
        filename = "Alerts_Threshold_Report";
        break;

      default:
        throw new Error("Invalid report type for remaining reports");
    }

    if (dataToExport && dataToExport.length > 0) {
      exportRecordToExcel(dataToExport, "Additional Attendance Reports", filename);
      return true;
    } else {
      toast.error("No data available to export", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  } catch (error) {
    console.error("Error exporting additional report:", error);
    toast.error("Failed to export report", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};