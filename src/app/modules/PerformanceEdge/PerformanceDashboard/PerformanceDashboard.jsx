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
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

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
      if (filterValue === "") {
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

  return (
    <div
      className={`flex flex-col gap-4 mb-10 ${window.location.pathname.substring(
        1
      )}`}
    >
      <div className="flex gap-4">
        <PerformanceStatsCards
          dashboardData={dashboardData}
          loading={isLoading}
          onCardClick={(tab) => setActiveTab(tab)}
        />
      </div>

      <div className="flex gap-4">
        <PerformanceCharts dashboardData={dashboardData} />
        <DepartmentRatingChart dashboardData={dashboardData} />
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap gap-4 justify-between">
          <div>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Track evaluation progress and performance metrics across your
              organization.
            </CardDescription>
          </div>
          <div className="flex-row flex flex-wrap gap-2">
            <ExportPerformanceReports filterData={filterData} />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="pending"
          >
            <TabsList className="flex justify-start mb-4">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                Pending Evaluations
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                Completed Evaluations
              </TabsTrigger>
              <TabsTrigger
                value="calibrations"
                className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                Recent Calibrations
              </TabsTrigger>
            </TabsList>

            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search by Employee Name",
                  name: "employee_name",
                },
                {
                  type: "select",
                  options: Departments,
                  name: "department",
                  placeholder: "Department",
                },
                {
                  type: "select",
                  options: Branches,
                  name: "branch",
                  placeholder: "Branch",
                },
              ]}
              filterValues={filterData}
              onChange={handleFilterChange}
              className="justify-end mb-4"
            />

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
    </div>
  );
};

export default PerformanceDashboard;
