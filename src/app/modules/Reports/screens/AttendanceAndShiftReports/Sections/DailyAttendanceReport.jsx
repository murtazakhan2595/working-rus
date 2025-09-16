import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getDailyAttendanceData } from "app/hooks/reports";
import { DailyAttendanceColumns } from "../TableColumns/AttendanceShiftTableColumns";

const DailyAttendanceReport = ({
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

  // Fetch daily attendance data
  const fetchDailyAttendanceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getDailyAttendanceData(payload);
      if (response) {
        setAttendanceData(response);
      }
    } catch (error) {
      console.error("Error fetching daily attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchDailyAttendanceData();
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

  // Calculate stats from current page data (for basic stats only)
  const stats = React.useMemo(() => {
    const currentPageData = attendanceData.results || [];

    const presentCount = currentPageData.filter(
      (item) => item.Status === "Present"
    ).length;
    const lateCount = currentPageData.filter(
      (item) => item.Status === "Late"
    ).length;
    const absentCount = currentPageData.filter(
      (item) => item.Status === "Absent"
    ).length;

    return {
      totalRecords: attendanceData.count || 0,
      currentPagePresent: presentCount,
      currentPageLate: lateCount,
      currentPageAbsent: absentCount,
    };
  }, [attendanceData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Records",
            value: stats.totalRecords,
            description: "All attendance records",
            color: "text-plum-900",
          },
          {
            title: "Present (Current Page)",
            value: stats.currentPagePresent,
            description: "Employees present",
            color: "text-green-600",
          },
          {
            title: "Late (Current Page)",
            value: stats.currentPageLate,
            description: "Late arrivals",
            color: "text-yellow-600",
          },
          {
            title: "Absent (Current Page)",
            value: stats.currentPageAbsent,
            description: "Absent employees",
            color: "text-red-600",
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
      </div> */}

      {/* Daily Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Report</CardTitle>
          <CardDescription>
            Detailed daily attendance records showing employee
            check-in/check-out times, shift information, and attendance status
            for tracking daily workforce presence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={DailyAttendanceColumns()}
              data={attendanceData.results}
              pagination={true}
              dataTotalSize={attendanceData.count}
              tableOptions={tableOptions}
              fallbackText="No daily attendance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyAttendanceReport;
