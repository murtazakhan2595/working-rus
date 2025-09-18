// ============================================================================
// 6️⃣ DEPARTMENT & MANAGERIAL REPORTS COMPONENTS
// Create these files in: src/app/modules/Reports/screens/AttendanceAndShiftReports/Sections/DepartmentManagerialReports/
// ============================================================================

// File: DepartmentAttendanceReport.jsx
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDepartmentAttendanceReportData } from "app/hooks/reports";
import { DepartmentAttendanceColumns } from "../../TableColumns/AdditionalReportsColumns";

const DepartmentAttendanceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-present");

  const fetchDepartmentData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getDepartmentAttendanceReportData(payload);
      if (response) {
        setDepartmentData(response);
      }
    } catch (error) {
      console.error("Error fetching department attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchDepartmentData();
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

  // Calculate attendance percentages for chart
  const chartData = departmentData.results.map(item => ({
    ...item,
    attendance_percent: item.total_employees > 0 
      ? ((item.present / item.total_employees) * 100).toFixed(1)
      : 0
  })).slice(0, 10); // Show top 10 departments

  return (
    <div className="space-y-6">
      {/* Department Attendance Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Department Attendance Overview
          </CardTitle>
          <CardDescription>
            Visual comparison of attendance rates across departments
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [
                    `${value}%`,
                    "Attendance Rate"
                  ]}
                />
                <Bar
                  dataKey="attendance_percent"
                  fill="#3B82F6"
                  name="Attendance %"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 flex items-center justify-center h-full">
              <p>No department attendance data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Attendance Report</CardTitle>
          <CardDescription>
            Track attendance percentage and presence statistics by department
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={DepartmentAttendanceColumns()}
              data={departmentData.results}
              pagination={true}
              dataTotalSize={departmentData.count}
              tableOptions={tableOptions}
              fallbackText="No department attendance data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentAttendanceReport;





