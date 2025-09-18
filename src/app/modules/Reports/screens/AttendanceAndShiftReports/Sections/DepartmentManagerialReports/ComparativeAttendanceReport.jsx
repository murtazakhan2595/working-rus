// File: ComparativeAttendanceReport.jsx
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
import { getComparativeAttendanceReportData } from "app/hooks/reports";
import { ComparativeAttendanceColumns } from "../../TableColumns/AdditionalReportsColumns";

const ComparativeAttendanceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [comparativeData, setComparativeData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-avg_attendance");

  const fetchComparativeData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getComparativeAttendanceReportData(payload);
      if (response) {
        setComparativeData(response);
      }
    } catch (error) {
      console.error("Error fetching comparative attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchComparativeData();
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

  // Prepare chart data
  const chartData = comparativeData.results
    .filter((item) => item.unit && item.unit !== "null")
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Comparative Attendance Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Comparative Attendance Performance
          </CardTitle>
          <CardDescription>
            Compare average attendance rates across departments/branches
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
                  dataKey="unit"
                  tick={{ fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value}%`, "Avg Attendance"]}
                />
                <Bar
                  dataKey="avg_attendance"
                  fill="#10B981"
                  name="Avg Attendance %"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 flex items-center justify-center h-full">
              <p>No comparative attendance data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparative Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comparative Attendance Report</CardTitle>
          <CardDescription>
            Compare attendance performance across departments and branches with
            best and worst day analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ComparativeAttendanceColumns()}
              data={comparativeData.results}
              pagination={true}
              dataTotalSize={comparativeData.count}
              tableOptions={tableOptions}
              fallbackText="No comparative attendance data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparativeAttendanceReport;
