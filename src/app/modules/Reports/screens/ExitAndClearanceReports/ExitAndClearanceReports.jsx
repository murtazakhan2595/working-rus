// src/app/modules/Reports/screens/ExitAndClearanceReports/ExitAndClearanceReports.jsx

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
import { exportExitClearanceReport } from "app/hooks/reports";
import { toast } from "react-toastify";

// Import individual report components
import AttritionRetentionReport from "./Sections/AttritionRetentionReport";
import ExitRequestsResignationsReport from "./Sections/ExitRequestsResignationsReport";
import TerminationManagementReport from "./Sections/TerminationManagementReport";
import ExitProcessingComplianceReport from "./Sections/ExitProcessingComplianceReport";
import RehireManagementReport from "./Sections/RehireManagementReport";

const ExitAndClearanceReports = () => {
  // Redux data
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);

  // State management
  const [activeTab, setActiveTab] = useState("attrition_retention");
  const [filterData, setFilterData] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  // Tab configuration - ALL MARKED AS READY
  const reportTabs = [
    {
      value: "attrition_retention",
      label: "Attrition & Analytics",
      component: AttritionRetentionReport,
      description:
        "Departmental attrition rates, retention analysis, and workforce trends",
      isReady: true,
    },
    {
      value: "exit_requests_resignations",
      label: "Exit Requests & Resignations",
      component: ExitRequestsResignationsReport,
      description:
        "Employee exit requests, resignation tracking, and approval workflows",
      isReady: true,
    },
    {
      value: "termination_management",
      label: "Termination Management",
      component: TerminationManagementReport,
      description:
        "Employee termination records, types, and compliance tracking",
      isReady: true, // ✅ NOW READY
    },
    {
      value: "exit_processing_compliance",
      label: "Exit Processing & Compliance",
      component: ExitProcessingComplianceReport,
      description:
        "Clearance status, exit interviews, and notice period compliance",
      isReady: true, // ✅ NOW READY (except clearance pending which is noted separately)
    },
    {
      value: "rehire_management",
      label: "Rehire Management",
      component: RehireManagementReport,
      description: "Rehire eligibility tracking and HR decision management",
      isReady: true, // ✅ NOW READY
    },
  ];

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
    const currentTab = reportTabs.find((tab) => tab.value === activeTab);

    if (!currentTab?.isReady) {
      toast.info(
        "Export functionality will be available when API is implemented",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
      return;
    }

    setIsExporting(true);
    try {
      let exportType;
      switch (activeTab) {
        case "attrition_retention":
          exportType = "attrition_retention_report";
          break;
        case "exit_requests_resignations":
          exportType = "resignation_report"; // Default to resignation report
          break;
        case "termination_management":
          exportType = "termination_report";
          break;
        case "exit_processing_compliance":
          exportType = "notice_period_compliance";
          break;
        case "rehire_management":
          exportType = "rehire_eligibility_report";
          break;
        default:
          throw new Error("Export not available for this report");
      }

      const success = await exportExitClearanceReport(exportType, filterData);

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

  // Get global filters based on current tab
  const getGlobalFilters = () => {
    const baseFilters = [
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
    ];

    // Add tab-specific filters
    switch (activeTab) {
      case "exit_requests_resignations":
        return [
          ...baseFilters,
          {
            type: "select-two",
            option: [
              {
                value: "Voluntary Resignation",
                label: "Voluntary Resignation",
              },
              { value: "Retirement", label: "Retirement" },
              { value: "Termination", label: "Termination" },
              { value: "Others", label: "Others" },
            ],
            name: "exit_type",
            placeholder: "Exit Type",
            values: filterData.exit_type,
          },
          {
            type: "select-three",
            option: [
              { value: "APPROVED", label: "Approved" },
              { value: "PENDING", label: "Pending" },
              { value: "REJECTED", label: "Rejected" },
            ],
            name: "status",
            placeholder: "Status",
            values: filterData.status,
          },
        ];
      case "termination_management":
        return [
          ...baseFilters,
          {
            type: "select-two",
            option: [
              { value: "voluntary", label: "Voluntary" },
              { value: "involuntary", label: "Involuntary" },
            ],
            name: "termination_type",
            placeholder: "Termination Type",
            values: filterData.termination_type,
          },
        ];
      case "exit_processing_compliance":
        return [
          ...baseFilters,
          {
            type: "select-two",
            option: [
              { value: "Compliant", label: "Compliant" },
              { value: "Non-Compliant", label: "Non-Compliant" },
              { value: "N/A", label: "N/A" },
            ],
            name: "compliance_status",
            placeholder: "Compliance Status",
            values: filterData.compliance_status,
          },
        ];
      case "rehire_management":
        return [
          ...baseFilters,
          {
            type: "select-two",
            option: [
              { value: "Yes", label: "Eligible" },
              { value: "No", label: "Not Eligible" },
            ],
            name: "eligible_for_rehire",
            placeholder: "Rehire Eligibility",
            values: filterData.eligible_for_rehire,
          },
        ];
      default:
        return baseFilters;
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-plum-1100">
                Exit & Clearance Reports
              </CardTitle>
              <CardDescription className="mt-2">
                {currentTab?.description ||
                  "Comprehensive exit management and clearance tracking"}
                {!currentTab?.isReady && (
                  <span className="text-yellow-600 font-medium">
                    {" "}
                    (API in development)
                  </span>
                )}
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
                disabled={isExporting || !currentTab?.isReady}
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
            filters={getGlobalFilters()}
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
        defaultValue="attrition_retention"
      >
        {/* Tab Navigation */}
        <Card>
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-4">
              {reportTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`data-[state=active]:bg-plum-200 data-[state=active]:text-plum-1100 text-xs lg:text-sm ${
                    !tab.isReady ? "opacity-60" : ""
                  }`}
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
                onFilterChange={handleFilterChange}
                isReady={tab.isReady}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ExitAndClearanceReports;
