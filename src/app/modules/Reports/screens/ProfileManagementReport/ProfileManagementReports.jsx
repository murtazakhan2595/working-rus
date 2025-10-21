import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { FilterInput } from "components/FormControl";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import { exportEmployeeReport } from "app/hooks/reports";
import { toast } from "react-toastify";

// Import individual report components
import EmployeeMasterReport from "./Sections/EmployeeMasterReport";
import DemographicsReport from "./Sections/DemographicsReport";
import EmployeeStatusReport from "./Sections/EmployeeStatusReport";
import ProbationStatusReport from "./Sections/ProbationStatusReport";
import DocumentComplianceReport from "./Sections/DocumentComplianceReport";
import SkillQualificationReport from "./Sections/SkillQualificationReport";
import ContactReport from "./Sections/ContactReport";
import CrossFunctionalReports from "./Sections/CrossFunctionalReports";

const ProfileManagementReports = () => {
  // Permission checks
  const isAdminView = HasAccess("VIEW_EMPLOYEE_REPORTS") || true; // Default to true for now
  const isBranchView = HasAccess("VIEW_BRN_EMPLOYEE_REPORTS") || true;
  const isDepartmentView = HasAccess("VIEW_DPT_EMPLOYEE_REPORTS") || true;

  // Redux data
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const { branch_id: user_branch, department_name: user_department } =
    useSelector((state) => state.emp.user_details);

  // State management
  const [activeTab, setActiveTab] = useState("employee_master");
  const [filterData, setFilterData] = useState({});
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Tab configuration
  const reportTabs = [
    {
      value: "employee_master",
      label: "Employee Master",
      component: EmployeeMasterReport,
      description: "Complete employee listing with core information",
    },
    {
      value: "demographics",
      label: "Demographics",
      component: DemographicsReport,
      description: "Age, Gender, Tenure, and Nationality analysis",
    },
    {
      value: "employee_status",
      label: "Employee Status",
      component: EmployeeStatusReport,
      description: "Active, On Leave, Terminated employee tracking",
    },
    {
      value: "probation_status",
      label: "Probation Status",
      component: ProbationStatusReport,
      description: "Probation tracking and confirmation status",
    },
    {
      value: "document_compliance",
      label: "Document Compliance",
      component: DocumentComplianceReport,
      description: "Visa, Passport, Emirates ID compliance tracking",
    },
    {
      value: "skills_qualifications",
      label: "Skills & Qualifications",
      component: SkillQualificationReport,
      description: "Education, Certifications, and Skills matrix",
    },
    {
      value: "contact_report",
      label: "Contact Report",
      component: ContactReport,
      description: "Emergency contacts and dependents information",
    },
    {
      value: "cross_functional",
      label: "Cross-Functional",
      component: CrossFunctionalReports,
      description: "Headcount, Turnover, Diversity, and Analytics",
    },
  ];

  // Set permitted view filter data based on permissions
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setPermittedViewFilterData(() => {
        if (isAdminView) return {};
        else if (isBranchView) return { branch_id: user_branch };
        else if (isDepartmentView) return { department_name: user_department };
        else return {};
      });
    }
    return () => {
      isMounted = false;
    };
  }, [
    isAdminView,
    isBranchView,
    isDepartmentView,
    user_branch,
    user_department,
  ]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (
        filterValue === "" ||
        filterValue === null ||
        filterValue === undefined ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilterData({});
  }, []);

  // Export current report
  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const success = await exportEmployeeReport(activeTab, combinedFilters);

      if (success) {
        toast.success("Report exported successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Get current tab info
  const currentTab = reportTabs.find((tab) => tab.value === activeTab);

  console.log("dep, branch, filterdata", Departments, Branches, filterData);

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-plum-1100">
                Profile Management Reports
              </CardTitle>
              <CardDescription className="mt-2">
                {currentTab?.description ||
                  "Comprehensive employee reporting and analytics"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleClearFilters}
                variant="outline"
                disabled={Object.keys(filterData).length === 0}
              >
                Reset Filters
              </Button>
              <Button
                onClick={handleExportReport}
                disabled={isExporting}
                variant="default"
              >
                {isExporting ? "Exporting..." : "Export to Excel"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Global Filters */}
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by Employee Name",
                name: "emp_name",
              },
              {
                 type: "select",
                options: Departments,
                name: "department_name",
                placeholder: "Department",
                values: filterData.department_name,
              },
              {
                type: "select-two",
                option: Branches,
                name: "branch_id",
                placeholder: "Branch",
                values: filterData.branch_id,
              },
              {
                type: "select-three",
                option: [
                  { value: "Active", label: "Active" },
                  { value: "On Leave", label: "On Leave" },
                  { value: "Terminated", label: "Terminated" },
                  { value: "Probation", label: "Probation" },
                  { value: "Notice Period", label: "Notice Period" },
                ],
                name: "employee_status",
                placeholder: "Employee Status",
                values: filterData.employee_status,
              },
              {
                type: "select-four",
                option: [
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                ],
                name: "gender",
                placeholder: "Gender",
                values: filterData.gender,
              },
            ]}
            filterValues={filterData}
            onChange={handleFilterChange}
            className="justify-end"
          />
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="employee_master"
      >
        {/* Tab Navigation */}
        <Card>
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-4">
              {reportTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-plum-200 data-[state=active]:text-plum-1100 text-xs lg:text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {reportTabs.map((tab) => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.value} value={tab.value}>
              <TabComponent
                filterData={filterData}
                permittedViewFilterData={permittedViewFilterData}
                onFilterChange={handleFilterChange}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ProfileManagementReports;
