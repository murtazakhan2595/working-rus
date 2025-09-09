import axios from "axios";
import { toast } from "react-toastify";
import { HandleLogout, baseUrl, headers } from "./general";
import { getEmployeeCustomList } from "app/hooks/general";
import { exportRecordToExcel } from "utils/downloadUtils";
import { renderDate, formatDuration } from "utils/renderValues";

// Get employee data for reports with enhanced filtering
export const getEmployeeReportsData = async (payload) => {
  try {
    const response = await getEmployeeCustomList(payload);
    if (response.results) {
      return {
        results: response.results,
        count: response.count,
        ActiveEmployee: response.ActiveEmployee,
        TotalEmployee: response.TotalEmployee,
        TotalManager: response.TotalManager,
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
      const ageGroupsData = response.data;

      // Calculate total employees
      const totalEmployees = Object.values(ageGroupsData).reduce(
        (total, group) => total + (group.total || 0),
        0
      );

      return {
        totalEmployees,
        ageGroups: ageGroupsData,
        raw: ageGroupsData,
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

// Get document compliance data (placeholder - will need new API)
export const getDocumentComplianceData = async (filterData = {}) => {
  try {
    // TODO: Implement when document compliance API is available
    // For now, return placeholder data structure
    const response = await getEmployeeCustomList({ filterData });
    if (response.results) {
      const employees = response.results;

      // Create placeholder compliance data
      const complianceData = employees.map((emp) => ({
        employee_id: emp.id,
        employee_name: emp.name,
        employee_serial_number: emp.serial_number,
        department_name: emp.department_name,
        nationality: emp.nationality,
        // Placeholder fields - will come from actual API
        passport_status: "N/A - API Pending",
        visa_status: "N/A - API Pending",
        emirates_id_status: "N/A - API Pending",
        passport_expiry: "N/A - API Pending",
        visa_expiry: "N/A - API Pending",
        emirates_id_expiry: "N/A - API Pending",
        compliance_status: "N/A - API Pending",
        days_to_expire: "N/A - API Pending",
      }));

      return {
        results: complianceData,
        count: complianceData.length,
      };
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

// Get turnover analytics (placeholder - needs new API)
export const getTurnoverAnalytics = async (filterData = {}) => {
  try {
    // TODO: Implement when turnover analytics API is available
    // const response = await axios.get(`${baseUrl}/employees/turnover-analytics/`, {
    //   headers: headers(),
    //   params: filterData
    // });

    // For now, return placeholder structure
    return {
      monthlyTrends: [
        { month: "Jan 2024", joiners: 0, leavers: 0, netChange: 0 },
        { month: "Feb 2024", joiners: 0, leavers: 0, netChange: 0 },
        // ... more months
      ],
      departmentTurnover: {},
      turnoverRate: 0,
      averageTenure: 0,
    };
  } catch (error) {
    console.error("Error fetching turnover analytics:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

// Get succession planning data (placeholder - needs new API)
export const getSuccessionPlanningData = async (filterData = {}) => {
  try {
    // TODO: Implement when succession planning API is available
    // const response = await axios.get(`${baseUrl}/succession-planning/`, {
    //   headers: headers(),
    //   params: filterData
    // });

    // For now, return placeholder structure
    return {
      criticalPositions: [],
      backupEmployees: [],
      readinessLevels: {},
      riskAssessment: {},
    };
  } catch (error) {
    console.error("Error fetching succession planning data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

// Get employee dependents data (placeholder - needs new API)
export const getEmployeeDependents = async (employeeId) => {
  try {
    // TODO: Implement when dependents API is available
    // const response = await axios.get(`${baseUrl}/employees/${employeeId}/dependents/`, {
    //   headers: headers(),
    // });

    // For now, return placeholder structure
    return {
      dependents: [],
      totalDependents: 0,
    };
  } catch (error) {
    console.error("Error fetching employee dependents:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { dependents: [], totalDependents: 0 };
  }
};
