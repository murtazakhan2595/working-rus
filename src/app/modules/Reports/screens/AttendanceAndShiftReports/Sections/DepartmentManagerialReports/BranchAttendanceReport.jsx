// File: BranchAttendanceReport.jsx
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
} from "recharts";
import { getBranchAttendanceReportData } from "app/hooks/reports";
import { BranchAttendanceColumns } from "../../TableColumns/AdditionalReportsColumns";

const BranchAttendanceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [branchData, setBranchData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-present");

  const branchColors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#F97316",
  ];

  const fetchBranchData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getBranchAttendanceReportData(payload);
      if (response) {
        setBranchData(response);
      }
    } catch (error) {
      console.error("Error fetching branch attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchBranchData();
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
  const chartData = branchData.results
    .filter((item) => item.branch && item.branch !== "null")
    .map((item) => ({
      name: item.branch,
      value: item.present,
    }));

  return (
    <div className="space-y-6">
      {/* Branch Attendance Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Branch Attendance Distribution
          </CardTitle>
          <CardDescription>
            Present employees distribution across branches
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={branchColors[index % branchColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} employees`, "Present"]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500">
              <p>No branch attendance data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branch Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Branch/Location Attendance Report</CardTitle>
          <CardDescription>
            Track attendance statistics across different office branches and
            locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={BranchAttendanceColumns()}
              data={branchData.results}
              pagination={true}
              dataTotalSize={branchData.count}
              tableOptions={tableOptions}
              fallbackText="No branch attendance data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default BranchAttendanceReport;