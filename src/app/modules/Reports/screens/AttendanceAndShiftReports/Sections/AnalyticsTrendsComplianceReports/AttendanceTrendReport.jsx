// ============================================================================
// 7️⃣ ANALYTICS, TRENDS & COMPLIANCE REPORTS COMPONENTS
// Create these files in: src/app/modules/Reports/screens/AttendanceAndShiftReports/Sections/AnalyticsTrendsComplianceReports/
// ============================================================================

// File: AttendanceTrendReport.jsx
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAttendanceTrendReportData } from "app/hooks/reports";
import { AttendanceTrendColumns } from "../../TableColumns/AdditionalReportsColumns";

const AttendanceTrendReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-present");

  const fetchTrendData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAttendanceTrendReportData(payload);
      if (response) {
        setTrendData(response);
      }
    } catch (error) {
      console.error("Error fetching attendance trend data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchTrendData();
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

  return (
    <div className="space-y-6">
      {/* Attendance Trend Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Attendance Trend Analysis
          </CardTitle>
          <CardDescription>
            Monthly/quarterly trends showing presence, absenteeism, and lateness patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {trendData.results.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData.results.slice(0, 10)}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Present"
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Absent"
                />
                <Line
                  type="monotone"
                  dataKey="late_arrivals"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Late Arrivals"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 flex items-center justify-center h-full">
              <p>No attendance trend data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Trend Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trend Report</CardTitle>
          <CardDescription>
            Analyze monthly/quarterly attendance trends including lateness and absenteeism patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AttendanceTrendColumns()}
              data={trendData.results}
              pagination={true}
              dataTotalSize={trendData.count}
              tableOptions={tableOptions}
              fallbackText="No attendance trend data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTrendReport;


