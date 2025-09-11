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

    const URL = `/ResignationReport/?ordering=${ordering}&${
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
    
    const URL = `/exit-request-report/?ordering=${ordering}&${
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

    const URL = `/v2-exit-request-report/?ordering=${ordering}&${
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
    const response = await axios.get(`${baseUrl}/AttritionRetentionReport/`, {
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
    
    const URL = `/v2-termination-report/?ordering=${ordering}&${
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
    
    const URL = `/notice-period-compliance-report/?ordering=${ordering}&${
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
    
    const URL = `/Exit-Interview-Report/?ordering=${ordering}&${
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
    
    const URL = `/rehire-eligibility-report/?ordering=${ordering}&${
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
    
    const URL = `/v2-attrition-rehire-eligibility-report/?ordering=${ordering}&${
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
    
    const URL = `/Clearance-Pending-Report/?ordering=${ordering}&${
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
    
    const URL = `/v2-Clearance-Pending-Report/?ordering=${ordering}&${
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

    const URL = `/new-hire-report/?ordering=${ordering}&${
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
        aggregated_stats: response.data.aggregated_stats || {
          // Mock data for now - backend will add this
          total_new_hires: response.data.count || 0,
          status_breakdown: {
            Active: Math.floor((response.data.count || 0) * 0.8),
            Terminated: Math.floor((response.data.count || 0) * 0.1),
            Exit: Math.floor((response.data.count || 0) * 0.07),
            Other: Math.floor((response.data.count || 0) * 0.03),
          },
          department_breakdown: {
            Development: Math.floor((response.data.count || 0) * 0.4),
            Design: Math.floor((response.data.count || 0) * 0.2),
            HR: Math.floor((response.data.count || 0) * 0.2),
            Accounts: Math.floor((response.data.count || 0) * 0.2),
          },
        },
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

    const URL = `/offer-letter-compliance/?ordering=${ordering}&${
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
        aggregated_stats: response.data.aggregated_stats || {
          // Mock data for now - backend will add this
          total_employees: response.data.count || 0,
          compliance_rates: {
            background_check_completed: 18.2,
            medical_done_completed: 11.4,
            offer_status_accepted: 7.5,
            overall_compliance: 12.4,
          },
        },
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

    const URL = `/employee-creation-tat/?ordering=${ordering}&${
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
        aggregated_stats: response.data.aggregated_stats || {
          // Mock data for now - backend will add this
          total_employees: response.data.count || 0,
          average_tat_days: 3.2,
          tat_status_breakdown: {
            "On Time": Math.floor((response.data.count || 0) * 0.75),
            Delayed: Math.floor((response.data.count || 0) * 0.25),
          },
          on_time_percentage: 75.0,
        },
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

    const URL = `/offer-letter-report/?ordering=${ordering}&${
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
        aggregated_stats: response.data.aggregated_stats || {
          // Mock data for now - backend will add this
          total_offers: response.data.count || 0,
          offer_status_breakdown: {
            Pending: Math.floor((response.data.count || 0) * 0.85),
            Accepted: Math.floor((response.data.count || 0) * 0.1),
            Rejected: Math.floor((response.data.count || 0) * 0.04),
            Other: Math.floor((response.data.count || 0) * 0.01),
          },
          conversion_rate: 10.2,
        },
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

    const URL = `/pre-onboarding-compliance/?ordering=${ordering}&${
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
        aggregated_stats: response.data.aggregated_stats || {
          // Mock data for now - backend will add this
          total_employees: response.data.count || 0,
          completion_counts: {
            background_check_completed: Math.floor((response.data.count || 0) * 0.15),
            medical_check_completed: Math.floor((response.data.count || 0) * 0.16),
            visa_processing_completed: Math.floor((response.data.count || 0) * 0.08),
            fully_compliant: Math.floor((response.data.count || 0) * 0.04),
          },
          overall_compliance_rate: 15.2,
        },
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

    const URL = `/probation-completion/?ordering=${ordering}&${
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
        aggregated_stats: response.data.aggregated_stats || {
          // Mock data for now - backend will add this
          total_employees: response.data.count || 0,
          confirmation_status_breakdown: {
            Confirmed: Math.floor((response.data.count || 0) * 0.78),
            Pending: Math.floor((response.data.count || 0) * 0.15),
            "Under Review": Math.floor((response.data.count || 0) * 0.07),
          },
          upcoming_confirmations_30_days: 8,
        },
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