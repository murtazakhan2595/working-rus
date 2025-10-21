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
import { exportHiringReport } from "app/hooks/reports";
import { toast } from "react-toastify";

// Import individual report components
import NewHireReport from "./Sections/NewHireReport";
import OnboardingStatusReport from "./Sections/OnboardingStatusReport";
import EmployeeCreationTATReport from "./Sections/EmployeeCreationTATReport";
import OfferLetterReport from "./Sections/OfferLetterReport";
import PreOnboardingComplianceReport from "./Sections/PreOnboardingComplianceReport";
import ProbationCompletionReport from "./Sections/ProbationCompletionReport";

const EmployeeCreationAndHiringReports = () => {
  // Permission checks
  const isAdminView = HasAccess("VIEW_HIRING_REPORTS") || true; // Default to true for now
  const isBranchView = HasAccess("VIEW_BRN_HIRING_REPORTS") || true;
  const isDepartmentView = HasAccess("VIEW_DPT_HIRING_REPORTS") || true;

  // Redux data
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const { branch_id: user_branch, department_name: user_department } =
    useSelector((state) => state.emp.user_details);

  // State management
  const [activeTab, setActiveTab] = useState("new_hire");
  const [filterData, setFilterData] = useState({});
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Tab configuration
  const reportTabs = [
    {
      value: "new_hire",
      label: "New Hire Report",
      component: NewHireReport,
      description: "New employee hiring tracking and status monitoring",
    },
    {
      value: "onboarding_status",
      label: "Onboarding Status",
      component: OnboardingStatusReport,
      description: "Employee onboarding progress and compliance tracking",
    },
    {
      value: "creation_tat",
      label: "Creation TAT",
      component: EmployeeCreationTATReport,
      description: "Employee creation turnaround time analysis",
    },
    {
      value: "offer_letter",
      label: "Offer Letter",
      component: OfferLetterReport,
      description: "Offer letter lifecycle and acceptance tracking",
    },
    {
      value: "pre_onboarding",
      label: "Pre-Onboarding",
      component: PreOnboardingComplianceReport,
      description: "Pre-onboarding compliance and verification status",
    },
    {
      value: "probation_completion",
      label: "Probation Completion",
      component: ProbationCompletionReport,
      description: "Probation period tracking and confirmation status",
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
      const success = await exportHiringReport(activeTab, combinedFilters);

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

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-plum-1100">
                Employee Creation & Hiring Reports
              </CardTitle>
              <CardDescription className="mt-2">
                {currentTab?.description ||
                  "Comprehensive hiring and onboarding reporting and analytics"}
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
                name: "name",
              },
              {
                 type: "select",
                options: Departments,
                name: "department",
                placeholder: "Department",
                values: filterData.department,
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
                  { value: "Terminated", label: "Terminated" },
                  { value: "Exit", label: "Exit" },
                  { value: "Pending", label: "Pending" },
                  { value: "Confirmed", label: "Confirmed" },
                ],
                name: "status",
                placeholder: "Status",
                values: filterData.status,
              },
              {
                type: "date-range",
                name: "date_range",
                placeholder: "Date Range",
                values: filterData.date_range,
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
        defaultValue="new_hire"
      >
        {/* Tab Navigation */}
        <Card>
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
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

export default EmployeeCreationAndHiringReports;
