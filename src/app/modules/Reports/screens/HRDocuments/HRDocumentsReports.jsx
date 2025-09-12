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
import { exportHRDocumentReport } from "app/hooks/reports";
import { toast } from "react-toastify";

// Import individual report components
import DocumentExpiryReport from "./Sections/DocumentExpiryReport";
import MissingDocumentReport from "./Sections/MissingDocumentReport";
import DocumentAccessReport from "./Sections/DocumentAccessReport";
import VisaPermitExpiryReport from "./Sections/VisaPermitExpiryReport";
import ContractRenewalReport from "./Sections/ContractRenewalReport";
import PolicyAcknowledgementReport from "./Sections/PolicyAcknowledgementReport";

const HRDocumentsReports = () => {
  // Permission checks
  const isAdminView = HasAccess("VIEW_HR_DOCUMENTS_REPORTS") || true; // Default to true for now
  const isBranchView = HasAccess("VIEW_BRN_HR_DOCUMENTS_REPORTS") || true;
  const isDepartmentView = HasAccess("VIEW_DPT_HR_DOCUMENTS_REPORTS") || true;

  // Redux data
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const { branch_id: user_branch, department_name: user_department } =
    useSelector((state) => state.emp.user_details);

  // State management
  const [activeTab, setActiveTab] = useState("document_expiry");
  const [filterData, setFilterData] = useState({});
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Tab configuration
  const reportTabs = [
    {
      value: "document_expiry",
      label: "Document Expiry",
      component: DocumentExpiryReport,
      description:
        "Employee document expiry tracking and compliance monitoring",
    },
    {
      value: "missing_documents",
      label: "Missing Documents",
      component: MissingDocumentReport,
      description: "Identification and tracking of missing required documents",
    },
    {
      value: "document_access",
      label: "Document Access",
      component: DocumentAccessReport,
      description: "Document access permissions and history tracking",
    },
    {
      value: "visa_permit_expiry",
      label: "Visa & Work Permit",
      component: VisaPermitExpiryReport,
      description:
        "Visa and work permit expiry monitoring for UAE/KSA compliance",
    },
    {
      value: "contract_renewal",
      label: "Contract Renewal",
      component: ContractRenewalReport,
      description: "Employee contract renewal tracking and upcoming renewals",
    },
    {
      value: "policy_acknowledgement",
      label: "Policy Acknowledgement",
      component: PolicyAcknowledgementReport,
      description: "Employee policy acknowledgement status and compliance",
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
      const success = await exportHRDocumentReport(activeTab, combinedFilters);

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
                HR Documents Reports
              </CardTitle>
              <CardDescription className="mt-2">
                {currentTab?.description ||
                  "Comprehensive HR document management and compliance reporting"}
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
                placeholder: "Search by Employee Name/ID",
                name: "search",
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
                  { value: "Valid", label: "Valid" },
                  { value: "Expiring Soon", label: "Expiring Soon" },
                  { value: "Expired", label: "Expired" },
                  { value: "Pending", label: "Pending" },
                  { value: "Completed", label: "Completed" },
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                  { value: "Unknown", label: "Unknown" },
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
        defaultValue="document_expiry"
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

export default HRDocumentsReports;
