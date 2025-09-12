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
} from "recharts";
import { getMissingDocumentsData } from "app/hooks/reports";
import { MissingDocumentsColumns } from "../TableColumns/HRDocumentTableColumns";

const MissingDocumentReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [missingData, setMissingData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const documentColors = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6B7280",
  ];

  // Fetch missing documents data
  const fetchMissingData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getMissingDocumentsData(payload);
      if (response) {
        setMissingData(response);
      }
    } catch (error) {
      console.error("Error fetching missing documents data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchMissingData();
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

  // Prepare chart data from aggregated stats
  const documentTypeChartData = React.useMemo(() => {
    if (!missingData.aggregated_stats?.document_type_breakdown) return [];

    return Object.entries(missingData.aggregated_stats.document_type_breakdown)
      .map(([type, count]) => ({
        type,
        count,
        percentage:
          missingData.aggregated_stats.total_missing_documents > 0
            ? Math.round(
                (count / missingData.aggregated_stats.total_missing_documents) *
                  100
              )
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [missingData.aggregated_stats]);

  // Department chart data (top 10)
  const departmentChartData = React.useMemo(() => {
    if (!missingData.aggregated_stats?.department_breakdown) return [];

    return Object.entries(missingData.aggregated_stats.department_breakdown)
      .map(([department, count]) => ({
        department:
          department.length > 20
            ? department.substring(0, 20) + "..."
            : department,
        count,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 departments
  }, [missingData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalEmployees:
      missingData.aggregated_stats?.total_employees_with_missing_docs ||
      missingData.count ||
      0,
    totalMissingDocs:
      missingData.aggregated_stats?.total_missing_documents || 0,
    avgMissingPerEmployee:
      missingData.aggregated_stats?.avg_missing_docs_per_employee || 0,
    topDepartment:
      Object.keys(
        missingData.aggregated_stats?.department_breakdown || {}
      )[0] || "N/A",
    topDepartmentCount:
      Object.values(
        missingData.aggregated_stats?.department_breakdown || {}
      )[0] || 0,
  };

  return (
    <div className="space-y-6">
      {/* Missing Documents Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Employees Affected",
            value: stats.totalEmployees,
            description: "With missing documents",
            color: "text-plum-900",
          },
          {
            title: "Total Missing Docs",
            value: stats.totalMissingDocs.toLocaleString(),
            description: "Across all employees",
            color: "text-red-600",
          },
          {
            title: "Avg Per Employee",
            value: stats.avgMissingPerEmployee.toFixed(1),
            description: "Missing documents",
            color: "text-yellow-600",
          },
          {
            title: "Most Affected Dept",
            value: stats.topDepartmentCount,
            description:
              stats.topDepartment.length > 15
                ? stats.topDepartment.substring(0, 15) + "..."
                : stats.topDepartment,
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Missing Document Types Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Missing Document Types
            </CardTitle>
            <CardDescription>
              Distribution of missing document types
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={documentTypeChartData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {documentTypeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={documentColors[index % documentColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} missing (${
                      documentTypeChartData.find((d) => d.type === name)
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

        {/* Department-wise Missing Documents */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Most Affected Departments
            </CardTitle>
            <CardDescription>
              Employees with missing documents by department
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 80 }}
              >
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value} employees`, "Affected"]}
                />
                <Bar
                  dataKey="count"
                  fill="#EF4444"
                  name="Employees"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Missing Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Missing Documents Report</CardTitle>
          <CardDescription>
            Comprehensive tracking of employees with missing required documents
            including identification, passport copies, visas, and other
            mandatory submissions for HR compliance and onboarding completion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={MissingDocumentsColumns()}
              data={missingData.results}
              pagination={true}
              dataTotalSize={missingData.count}
              tableOptions={tableOptions}
              fallbackText="No missing documents data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MissingDocumentReport;
