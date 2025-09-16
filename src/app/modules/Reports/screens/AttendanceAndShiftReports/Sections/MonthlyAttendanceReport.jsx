import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getMonthlyAttendanceData } from "app/hooks/reports";
import { MonthlyAttendanceColumns } from "../TableColumns/AttendanceShiftTableColumns";

const MonthlyAttendanceReport = ({
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

  // Fetch monthly attendance data
  const fetchMonthlyAttendanceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getMonthlyAttendanceData(payload);
      if (response) {
        setAttendanceData(response);
      }
    } catch (error) {
      console.error("Error fetching monthly attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchMonthlyAttendanceData();
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

    const totalPresents = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Presents) || 0),
      0
    );
    const totalAbsents = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Absents) || 0),
      0
    );
    const totalLates = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Lates) || 0),
      0
    );
    const totalOvertimeHrs = currentPageData.reduce(
      (sum, item) => sum + (parseFloat(item.OvertimeHrs) || 0),
      0
    );

    return {
      totalEmployees: attendanceData.count || 0,
      totalPresents,
      totalAbsents,
      totalLates,
      totalOvertimeHrs: totalOvertimeHrs.toFixed(1),
    };
  }, [attendanceData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Total records",
            color: "text-plum-900",
          },
          {
            title: "Total Presents",
            value: stats.totalPresents,
            description: "Sum of present days",
            color: "text-green-600",
          },
          {
            title: "Total Absents",
            value: stats.totalAbsents,
            description: "Sum of absent days",
            color: "text-red-600",
          },
          {
            title: "Total Lates",
            value: stats.totalLates,
            description: "Sum of late arrivals",
            color: "text-yellow-600",
          },
          {
            title: "Total Overtime",
            value: `${stats.totalOvertimeHrs}h`,
            description: "Sum of overtime hours",
            color: "text-blue-600",
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

      {/* Monthly Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Summary</CardTitle>
          <CardDescription>
            Comprehensive monthly attendance summary showing total working days,
            presents, absents, late arrivals, early exits, and overtime hours
            for each employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={MonthlyAttendanceColumns()}
              data={attendanceData.results}
              pagination={true}
              dataTotalSize={attendanceData.count}
              tableOptions={tableOptions}
              fallbackText="No monthly attendance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyAttendanceReport;
