import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";

// ============================================================================
// SHIFT ALLOCATION REPORT COMPONENT
// ============================================================================
import { getShiftAllocationReportData } from "app/hooks/reports";
import { ShiftAllocationReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const ShiftAllocationReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [shiftAllocationData, setShiftAllocationData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchShiftAllocationData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftAllocationReportData(payload);
      if (response) {
        setShiftAllocationData(response);
      }
    } catch (error) {
      console.error("Error fetching shift allocation data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchShiftAllocationData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const stats = React.useMemo(() => {
    const currentPageData = shiftAllocationData.results || [];

    // Count employees with weekend work
    const weekendWorkers = currentPageData.filter(
      (item) => item.Sat !== "-" || item.Sun !== "-"
    ).length;

    // Count total working days assignments
    const totalAssignments = currentPageData.reduce((sum, item) => {
      const workingDays = [
        item.Mon,
        item.Tue,
        item.Wed,
        item.Thu,
        item.Fri,
      ].filter((day) => day !== "-").length;
      return sum + workingDays;
    }, 0);

    return {
      totalEmployees: shiftAllocationData.count || 0,
      weekendWorkers,
      totalAssignments,
      averageWorkingDays:
        currentPageData.length > 0
          ? (totalAssignments / currentPageData.length).toFixed(1)
          : 0,
    };
  }, [shiftAllocationData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "With shift assignments",
            color: "text-plum-900",
          },
          {
            title: "Weekend Workers",
            value: stats.weekendWorkers,
            description: "Working weekends",
            color: "text-blue-600",
          },
          {
            title: "Total Assignments",
            value: stats.totalAssignments,
            description: "Weekly assignments",
            color: "text-green-600",
          },
          {
            title: "Avg Working Days",
            value: stats.averageWorkingDays,
            description: "Days per employee",
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="flex flex-col justify-center shadow-md border rounded-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-neutral-900">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-medium ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-neutral-800 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shift Allocation Report</CardTitle>
          <CardDescription>
            View planned shift schedules by day, week, and month for effective
            workforce planning and resource allocation management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ShiftAllocationReportColumns()}
              data={shiftAllocationData.results}
              pagination={true}
              dataTotalSize={shiftAllocationData.count}
              tableOptions={tableOptions}
              fallbackText="No shift allocation data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
