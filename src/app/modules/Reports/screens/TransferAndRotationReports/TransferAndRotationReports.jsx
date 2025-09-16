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
import { exportTransferRotationReport } from "app/hooks/reports";
import { toast } from "react-toastify";

// Import individual report components
import TransferReport from "./Sections/TransferReport";
import JobRotationHistoryReport from "./Sections/JobRotationHistoryReport";
import PendingApprovalsReport from "./Sections/PendingApprovalsReport";
import CostImpactReport from "./Sections/CostImpactReport.jsx";
import RotationComplianceReport from "./Sections/RotationComplianceReport";
import SkillGapAnalysisReport from "./Sections/SkillGapAnalysisReport";
import TransferAnalyticsReport from "./Sections/TransferAnalyticsReport";

const TransferAndRotationReports = () => {
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
  const [activeTab, setActiveTab] = useState("transfer_reports");
  const [filterData, setFilterData] = useState({});
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Tab configuration
  const reportTabs = [
    {
      value: "transfer_reports",
      label: "Transfer Reports",
      component: TransferReport,
      description: "Complete transfer tracking with status and timelines",
    },
    {
      value: "job_rotation_history",
      label: "Rotation History",
      component: JobRotationHistoryReport,
      description: "Employee job rotation history and movements",
    },
    {
      value: "pending_approvals",
      label: "Pending Approvals",
      component: PendingApprovalsReport,
      description: "Transfer requests awaiting approval",
    },
    {
      value: "cost_impact",
      label: "Cost Impact",
      component: CostImpactReport,
      description: "Transfer cost analysis and budgeting",
    },
    {
      value: "rotation_compliance",
      label: "Compliance",
      component: RotationComplianceReport,
      description: "Rotation compliance for regulated sectors",
    },
    {
      value: "skill_gap_analysis",
      label: "Skill Gap Analysis",
      component: SkillGapAnalysisReport,
      description: "Skills assessment for role transitions",
    },
    {
      value: "analytics_dashboard",
      label: "Analytics",
      component: TransferAnalyticsReport,
      description: "Transfer and rotation analytics dashboard",
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
      const success = await exportTransferRotationReport(
        activeTab,
        combinedFilters
      );

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
                Transfer & Rotation Reports
              </CardTitle>
              <CardDescription className="mt-2">
                {currentTab?.description ||
                  "Comprehensive transfer and rotation reporting and analytics"}
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
                disabled={isExporting || activeTab === "analytics_dashboard"}
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
                type: "select-one",
                option: Departments,
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
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },
                ],
                name: "status",
                placeholder: "Status",
                values: filterData.status,
              },
              {
                type: "select-four",
                option: [
                  { value: "Internal", label: "Internal" },
                  { value: "External", label: "External" },
                  { value: "INTERNAL", label: "Internal" },
                  { value: "EXTERNAL", label: "External" },
                ],
                name: "transfer_type",
                placeholder: "Transfer Type",
                values: filterData.transfer_type,
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
        defaultValue="transfer_reports"
      >
        {/* Tab Navigation */}
        <Card>
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-4">
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

export default TransferAndRotationReports;
