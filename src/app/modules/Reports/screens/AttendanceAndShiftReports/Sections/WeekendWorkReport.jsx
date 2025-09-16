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
// WEEKEND WORK REPORT COMPONENT
// ============================================================================
import { getWeekendWorkReportData } from "app/hooks/reports";
import { WeekendWorkReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const WeekendWorkReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [weekendWorkData, setWeekendWorkData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchWeekendWorkData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getWeekendWorkReportData(payload);
      if (response) {
        setWeekendWorkData(response);
      }
    } catch (error) {
      console.error("Error fetching weekend work data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchWeekendWorkData();
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
    const currentPageData = weekendWorkData.results || [];

    const totalWeekendHours = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Hours) || 0),
      0
    );

    const employeesWithWeekendWork = currentPageData.filter(
      (item) => item["Weekend Dates Worked"] !== "-" && parseInt(item.Hours) > 0
    ).length;

    const highWeekendHours = currentPageData.filter(
      (item) => parseInt(item.Hours) > 16
    ).length;

    const moderateWeekendWork = currentPageData.filter((item) => {
      const hours = parseInt(item.Hours);
      return hours > 8 && hours <= 16;
    }).length;

    return {
      totalEmployees: weekendWorkData.count || 0,
      totalWeekendHours,
      employeesWithWeekendWork,
      highWeekendHours,
      moderateWeekendWork,
    };
  }, [weekendWorkData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Tracked employees",
            color: "text-plum-900",
          },
          {
            title: "Weekend Hours",
            value: `${stats.totalWeekendHours}h`,
            description: "Total weekend work",
            color: "text-blue-600",
          },
          {
            title: "Weekend Workers",
            value: stats.employeesWithWeekendWork,
            description: "Worked weekends",
            color: "text-green-600",
          },
          {
            title: "High Hours (16+)",
            value: stats.highWeekendHours,
            description: "Excessive weekend work",
            color: "text-red-600",
          },
          {
            title: "Moderate (8-16h)",
            value: stats.moderateWeekendWork,
            description: "Regular weekend work",
            color: "text-yellow-600",
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

      {/* Weekend Work Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weekend Work Report</CardTitle>
          <CardDescription>
            Monitor employees working outside standard workweek for proper
            compensation and work-life balance management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={WeekendWorkReportColumns()}
              data={weekendWorkData.results}
              pagination={true}
              dataTotalSize={weekendWorkData.count}
              tableOptions={tableOptions}
              fallbackText="No weekend work data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
