import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getYearlyAttendanceData } from "app/hooks/reports";
import { YearlyAttendanceColumns } from "../TableColumns/AttendanceShiftTableColumns";

const YearlyAttendanceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Fetch yearly attendance data
  const fetchYearlyAttendanceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getYearlyAttendanceData(payload);
      if (response) {
        setAttendanceData(response);
      }
    } catch (error) {
      console.error("Error fetching yearly attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchYearlyAttendanceData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  // Handle page changes
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Table options
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  // Calculate stats from current page data
  const stats = React.useMemo(() => {
    const currentPageData = attendanceData.results || [];

    const totalWorkingDays = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.WorkingDays) || 0),
      0
    );
    const totalPresentDays = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.PresentDays) || 0),
      0
    );
    const totalAbsents = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Absents) || 0),
      0
    );
    const totalRemoteDays = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.RemoteDays) || 0),
      0
    );

    // Calculate average attendance percentage
    const attendancePercentages = currentPageData
      .map((item) =>
        parseFloat(item.AttendancePercentage?.replace("%", "") || 0)
      )
      .filter((percentage) => percentage > 0);

    const avgAttendancePercentage =
      attendancePercentages.length > 0
        ? (
            attendancePercentages.reduce(
              (sum, percentage) => sum + percentage,
              0
            ) / attendancePercentages.length
          ).toFixed(1)
        : 0;

    return {
      totalEmployees: attendanceData.count || 0,
      totalWorkingDays,
      totalPresentDays,
      totalAbsents,
      totalRemoteDays,
      avgAttendancePercentage: `${avgAttendancePercentage}%`,
    };
  }, [attendanceData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Total records",
            color: "text-plum-900",
          },
          {
            title: "Working Days",
            value: stats.totalWorkingDays,
            description: "Sum of working days",
            color: "text-neutral-800",
          },
          {
            title: "Present Days",
            value: stats.totalPresentDays,
            description: "Sum of present days",
            color: "text-green-600",
          },
          {
            title: "Absents",
            value: stats.totalAbsents,
            description: "Sum of absent days",
            color: "text-red-600",
          },
          {
            title: "Remote Days",
            value: stats.totalRemoteDays,
            description: "Sum of remote work",
            color: "text-blue-600",
          },
          {
            title: "Avg Attendance",
            value: stats.avgAttendancePercentage,
            description: "Average percentage",
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

      {/* Yearly Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yearly Attendance Report</CardTitle>
          <CardDescription>
            Annual attendance overview showing working days, present days,
            absents, leave days, remote work days, and overall attendance
            percentage for performance analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={YearlyAttendanceColumns()}
              data={attendanceData.results}
              pagination={true}
              dataTotalSize={attendanceData.count}
              tableOptions={tableOptions}
              fallbackText="No yearly attendance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyAttendanceReport;
