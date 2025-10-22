// src/app/modules/PerformanceEdge/PerformanceDashboard/PerformanceDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "components/ui/card";
import { Button } from "components/ui/button";
import {
  getDashboardMetrics,
  getBulkDashboardData,
} from "app/hooks/performanceEdge";
import { PageLoader, TableCustom } from "components";
import { PerformanceTableColumns } from ".";
import { ExportPerformanceReports } from ".";
import { PerformanceStatsCards } from "./Sections/PerformanceStatsCards";
import { PerformanceCharts } from "./Sections/PerformanceCharts";
import { DepartmentRatingChart } from "./Sections/DepartmentRatingChart";
import { FilterInput } from "components/FormControl";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import {
  PerformanceDistributionReport,
  DepartmentComparisonReport,
  PerformanceTrendsReport,
  HighPerformersReport,
  LowPerformersReport,
  CompletionRatesReport,
} from "./Reports";

const PerformanceDashboard = () => {
  // const isAdminView = HasAccess("VIEW_PERFORMANCE_DASHBOARD");
  // const isBranchView = HasAccess("VIEW_BRN_PERFORMANCE_DASHBOARD");
  // const isDepartmentView = HasAccess("VIEW_DPT_PERFORMANCE_DASHBOARD");
  // const isManagerView = HasAccess("VIEW_MANAGER_PERFORMANCE_DASHBOARD");
  const isAdminView = true;
  const isBranchView = true;
  const isDepartmentView = true;
  const isManagerView = true;

  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const Designations = useSelector((state) => state.common.designations);
  const {
    branch_id: user_branch,
    department_name: user_department,
    id: user_id,
  } = useSelector((state) => state.emp.user_details);

  const [dashboardData, setDashboardData] = useState({});
  const [bulkData, setBulkData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("employee_name");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReportType, setSelectedReportType] = useState("overview");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  // Report types for tabs - converted from dropdown options
  const reportTypes = [
    { label: "Overview", value: "overview", shortLabel: "Overview" },
    {
      label: "Distribution",
      value: "distribution",
      shortLabel: "Distribution",
    },
    {
      label: "Department Comparison",
      value: "department_comparison",
      shortLabel: "Departments",
    },
    { label: "Trends", value: "trends", shortLabel: "Trends" },
    {
      label: "High Performers",
      value: "high_performers",
      shortLabel: "High Performers",
    },
    {
      label: "Low Performers",
      value: "low_performers",
      shortLabel: "Low Performers",
    },
    {
      label: "Completion Rates",
      value: "completion_rates",
      shortLabel: "Completion",
    },
  ];

  // Performance cycles options from dashboard data
  const performanceCycles = React.useMemo(() => {
    return (
      dashboardData?.total_evaluations?.by_cycle?.map((cycle) => ({
        label: cycle.cycle_name,
        value: cycle.cycle_id,
      })) || []
    );
  }, [dashboardData.total_evaluations]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setPermittedViewFilterData(() => {
        if (isAdminView) return {};
        else if (isBranchView) return { branch: user_branch };
        else if (isDepartmentView) return { department: user_department };
        else if (isManagerView) return { reporting_employees: user_id };
      });
    return () => {
      isMounted = false;
    };
  }, [isAdminView, isBranchView, isDepartmentView, isManagerView]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (
        filterValue === "" ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const getDashboardData = async (isMounted) => {
    setIsLoading(true);
    const filter = {
      ...filterData,
      ...permittedViewFilterData,
    };

    try {
      const metricsResponse = await getDashboardMetrics(filter);
      if (isMounted && metricsResponse) {
        setDashboardData(metricsResponse);
      }
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBulkData = async (isMounted) => {
    setIsTableLoading(true);
    const filter = {
      ...filterData,
      ...permittedViewFilterData,
    };

    try {
      const bulkResponse = await getBulkDashboardData(filter);
      if (isMounted && bulkResponse) {
        setBulkData(bulkResponse);
      }
    } catch (error) {
      console.error("Error fetching bulk data:", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  useEffect(() => {
    let isMounted = true;
    if (permittedViewFilterData) {
      getDashboardData(isMounted);
      getBulkData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [filterData, permittedViewFilterData, ordering, options]);

  const getTableData = () => {
    switch (activeTab) {
      case "pending":
        return bulkData.pending_evaluations || [];
      case "completed":
        return bulkData.completed_evaluations || [];
      case "calibrations":
        return bulkData.recent_calibrations || [];
      default:
        return [];
    }
  };

  const renderReportContent = () => {
    if (isLoading) return <PageLoader />;

    switch (selectedReportType) {
      case "overview":
        return (
          <>
            <div className="flex gap-4 mb-6">
              <PerformanceStatsCards
                dashboardData={dashboardData}
                loading={isLoading}
                onCardClick={(tab) => setActiveTab(tab)}
              />
            </div>
            <div className="flex gap-4 mb-6">
              <PerformanceCharts dashboardData={dashboardData} />
              <DepartmentRatingChart dashboardData={dashboardData} />
            </div>
          </>
        );
      case "distribution":
        return <PerformanceDistributionReport dashboardData={dashboardData} />;
      case "department_comparison":
        return <DepartmentComparisonReport dashboardData={dashboardData} />;
      case "trends":
        return <PerformanceTrendsReport dashboardData={dashboardData} />;
      case "high_performers":
        return <HighPerformersReport dashboardData={dashboardData} />;
      case "low_performers":
        return <LowPerformersReport dashboardData={dashboardData} />;
      case "completion_rates":
        return <CompletionRatesReport dashboardData={dashboardData} />;
      default:
        return <div>Select a report type to view data</div>;
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 mb-10 ${window.location.pathname.substring(
        1
      )}`}
    >
      {/* Main Report Type Tabs */}
      <Tabs
        value={selectedReportType}
        onValueChange={setSelectedReportType}
        defaultValue="overview"
      >
        {/* Report Type Tab Navigation */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>HR Analytics & Reporting</CardTitle>
                <CardDescription>
                  Comprehensive performance reports and analytics across the
                  organization
                </CardDescription>
              </div>
              <ExportPerformanceReports
                filterData={filterData}
                reportType={selectedReportType}
                dashboardData={dashboardData}
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* Report Type Tabs - Replaced SelectInputComponent */}
            <div className="mb-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4">
                {reportTypes.map((report) => (
                  <TabsTrigger
                    key={report.value}
                    value={report.value}
                    className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-1100 text-xs lg:text-sm"
                  >
                    {report.shortLabel}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Advanced Filters */}
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search by Employee Name",
                  name: "employee_name",
                },
                {
                   type: "select",
                  options: performanceCycles,
                  name: "cycle_ids",
                  placeholder: "Performance Cycles",
                },
                {
                  type: "select-two",
                  options: Departments,
                  name: "department_ids",
                  placeholder: "Departments",
                },
                {
                  type: "select-three",
                  options: Branches,
                  name: "branch_ids",
                  placeholder: "Branches",
                },
                {
                  type: "select-four",
                  options: Designations,
                  name: "designation_ids",
                  placeholder: "Designations",
                },
              ]}
              filterValues={filterData}
              onChange={handleFilterChange}
              className="justify-end"
            />
          </CardContent>
        </Card>

        {/* Tab Content for Each Report Type */}
        <TabsContent value="overview">
          {/* Overview Content */}
          {renderReportContent()}

          {/* Tables Section - Only show for overview */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Track evaluation progress and performance metrics across your
                organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="pending"
              >
                <TabsList className="flex justify-start mb-4">
                  <TabsTrigger value="pending">Pending Evaluations</TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed Evaluations
                  </TabsTrigger>
                  <TabsTrigger value="calibrations">
                    Recent Calibrations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  {isTableLoading ? (
                    <PageLoader />
                  ) : (
                    <TableCustom
                      data={getTableData()}
                      columns={PerformanceTableColumns(activeTab)}
                      pagination={true}
                      dataTotalSize={getTableData().length}
                      tableOptions={tableOptions}
                    />
                  )}
                </TabsContent>

                <TabsContent value="completed">
                  {isTableLoading ? (
                    <PageLoader />
                  ) : (
                    <TableCustom
                      data={getTableData()}
                      columns={PerformanceTableColumns(activeTab)}
                      pagination={true}
                      dataTotalSize={getTableData().length}
                      tableOptions={tableOptions}
                    />
                  )}
                </TabsContent>

                <TabsContent value="calibrations">
                  {isTableLoading ? (
                    <PageLoader />
                  ) : (
                    <TableCustom
                      data={getTableData()}
                      columns={PerformanceTableColumns(activeTab)}
                      pagination={true}
                      dataTotalSize={getTableData().length}
                      tableOptions={tableOptions}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">{renderReportContent()}</TabsContent>

        <TabsContent value="department_comparison">
          {renderReportContent()}
        </TabsContent>

        <TabsContent value="trends">{renderReportContent()}</TabsContent>

        <TabsContent value="high_performers">
          {renderReportContent()}
        </TabsContent>

        <TabsContent value="low_performers">
          {renderReportContent()}
        </TabsContent>

        <TabsContent value="completion_rates">
          {renderReportContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
