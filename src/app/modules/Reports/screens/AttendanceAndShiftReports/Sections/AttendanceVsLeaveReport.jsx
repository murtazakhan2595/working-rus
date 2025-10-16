import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
// ============================================================================
// ATTENDANCE VS LEAVE REPORT COMPONENT
// ============================================================================
import { getAttendanceVsLeaveReportData } from "app/hooks/reports";
import { AttendanceVsLeaveReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const AttendanceVsLeaveReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [attendanceVsLeaveData, setAttendanceVsLeaveData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const conflictColors = ["#10B981", "#EF4444"];
  const typeColors = ["#F59E0B", "#EF4444"];

  const fetchAttendanceVsLeaveData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAttendanceVsLeaveReportData(payload);
      if (response) {
        setAttendanceVsLeaveData(response);
      }
    } catch (error) {
      console.error("Error fetching attendance vs leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAttendanceVsLeaveData();
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

  // Calculate stats from aggregated data only
  const stats = {
    totalRecords:
      attendanceVsLeaveData.aggregated_stats?.total_records ||
      attendanceVsLeaveData.count ||
      0,
    conflictsFound:
      attendanceVsLeaveData.aggregated_stats?.conflicts_found || 0,
    noConflicts: attendanceVsLeaveData.aggregated_stats?.no_conflicts || 0,
    presentWithLeave:
      attendanceVsLeaveData.aggregated_stats?.by_conflict_type
        ?.present_with_leave || 0,
    absentWithoutLeave:
      attendanceVsLeaveData.aggregated_stats?.by_conflict_type
        ?.absent_without_leave || 0,
  };

  // Conflict status chart data
  const conflictChartData = React.useMemo(() => {
    if (!attendanceVsLeaveData.aggregated_stats) return [];

    return [
      {
        status: "No Conflicts",
        count: stats.noConflicts,
        percentage:
          stats.totalRecords > 0
            ? Math.round((stats.noConflicts / stats.totalRecords) * 100)
            : 0,
      },
      {
        status: "Conflicts Found",
        count: stats.conflictsFound,
        percentage:
          stats.totalRecords > 0
            ? Math.round((stats.conflictsFound / stats.totalRecords) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [attendanceVsLeaveData.aggregated_stats, stats]);

  // Conflict type breakdown chart data
  const conflictTypeChartData = React.useMemo(() => {
    if (!attendanceVsLeaveData.aggregated_stats?.by_conflict_type) return [];

    return [
      {
        type: "Present with Leave",
        count: stats.presentWithLeave,
      },
      {
        type: "Absent without Leave",
        count: stats.absentWithoutLeave,
      },
    ].filter((item) => item.count > 0);
  }, [attendanceVsLeaveData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Records",
            value: stats.totalRecords.toLocaleString(),
            description: "Records analyzed",
            color: "text-plum-900",
          },
          {
            title: "Conflicts Found",
            value: stats.conflictsFound.toLocaleString(),
            description: "Leave vs attendance",
            color: "text-red-600",
          },
          {
            title: "No Conflicts",
            value: stats.noConflicts.toLocaleString(),
            description: "Records consistent",
            color: "text-green-600",
          },
          {
            title: "Present with Leave",
            value: stats.presentWithLeave.toLocaleString(),
            description: "Potential issues",
            color: "text-yellow-600",
          },
          {
            title: "Absent w/o Leave",
            value: stats.absentWithoutLeave.toLocaleString(),
            description: "Missing leave records",
            color: "text-orange-600",
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Conflict Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Conflict Status Overview
            </CardTitle>
            <CardDescription>
              Distribution of records with and without conflicts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conflictChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {conflictChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={conflictColors[index % conflictColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} records (${
                      conflictChartData.find((d) => d.status === name)
                        ?.percentage
                    }%)`,
                    name,
                  ]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conflict Type Breakdown */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Conflict Type Breakdown
            </CardTitle>
            <CardDescription>
              Types of attendance vs leave conflicts identified
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conflictTypeChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="type"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [
                    `${value.toLocaleString()} records`,
                    "Count",
                  ]}
                />
                <Bar
                  dataKey="count"
                  name="Conflicts"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                >
                  {conflictTypeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={typeColors[index % typeColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attendance vs Leave Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance vs Leave Report</CardTitle>
          <CardDescription>
            Identify conflicts between attendance records and leave applications
            to ensure data accuracy and prevent payroll discrepancies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AttendanceVsLeaveReportColumns()}
              data={attendanceVsLeaveData.results}
              pagination={true}
              dataTotalSize={attendanceVsLeaveData.count}
              tableOptions={tableOptions}
              fallbackText="No attendance vs leave data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
