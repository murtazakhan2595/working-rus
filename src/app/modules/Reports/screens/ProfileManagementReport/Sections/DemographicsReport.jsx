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
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getEmployeeReportsData,
  getAllAgeGroups,
  getUAEAgeGroups,
  getDepartmentGenderNationalityReport,
} from "app/hooks/reports";
import { DemographicsColumns } from "../TableColumns/ReportTableColumns";

const DemographicsReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [demographicsStats, setDemographicsStats] = useState(null);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("name");

  // Chart colors
  const ageGroupColors = [
    "#F87171",
    "#FBBF24",
    "#34D399",
    "#60A5FA",
    "#A78BFA",
  ];
  const genderColors = ["#3B82F6", "#EC4899", "#6B7280"];

  // Fetch employee data and statistics
  const fetchDemographicsData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };

      // Fetch table data
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };
      const tableResponse = await getEmployeeReportsData(payload);

      console.log("tableResponse demographicsreport component", tableResponse);

      // Fetch real age groups data from API
      const [
        allAgeGroupsResponse,
        uaeAgeGroupsResponse,
        departmentReportResponse,
      ] = await Promise.all([
        getAllAgeGroups(combinedFilters),
        getUAEAgeGroups(combinedFilters),
        getDepartmentGenderNationalityReport(combinedFilters),
      ]);

      if (tableResponse) {
        setEmployeeData(tableResponse);
      }

      // Combine all demographics data
      const combinedStats = {
        totalEmployees: tableResponse?.count || 0,
        ageGroups: allAgeGroupsResponse?.ageGroups || {},
        uaeAgeGroups: uaeAgeGroupsResponse?.ageGroups || {},
        totalUAEEmployees: uaeAgeGroupsResponse?.totalUAEEmployees || 0,
        departmentReport: departmentReportResponse || {},
        // Calculate gender distribution from department report
        genderDistribution: Object.values(
          departmentReportResponse || {}
        ).reduce((acc, dept) => {
          acc.MALE = (acc.MALE || 0) + dept.male;
          acc.FEMALE = (acc.FEMALE || 0) + dept.female;
          return acc;
        }, {}),
        // Calculate nationality distribution from department report
        nationalityDistribution: Object.values(
          departmentReportResponse || {}
        ).reduce((acc, dept) => {
          Object.entries(dept.nationalities || {}).forEach(
            ([nationality, count]) => {
              acc[nationality] = (acc[nationality] || 0) + count;
            }
          );
          return acc;
        }, {}),
      };

      setDemographicsStats(combinedStats);
    } catch (error) {
      console.error("Error fetching demographics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchDemographicsData();
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

  // Prepare chart data
  const ageGroupChartData = React.useMemo(() => {
    if (!demographicsStats?.ageGroups) return [];
    return Object.entries(demographicsStats.ageGroups).map(
      ([ageGroup, data]) => ({
        ageGroup,
        count: data.total,
        male: data.male,
        female: data.female,
        percentage:
          demographicsStats.totalEmployees > 0
            ? Math.round((data.total / demographicsStats.totalEmployees) * 100)
            : 0,
      })
    );
  }, [demographicsStats]);

  const genderChartData = React.useMemo(() => {
    if (!demographicsStats?.genderDistribution) return [];
    return Object.entries(demographicsStats.genderDistribution).map(
      ([gender, count]) => ({
        gender:
          gender === "MALE" ? "Male" : gender === "FEMALE" ? "Female" : gender,
        count,
        percentage:
          demographicsStats.totalEmployees > 0
            ? Math.round((count / demographicsStats.totalEmployees) * 100)
            : 0,
      })
    );
  }, [demographicsStats]);

  const nationalityChartData = React.useMemo(() => {
    if (!demographicsStats?.nationalityDistribution) return [];

    // Get top 10 nationalities
    const sortedNationalities = Object.entries(
      demographicsStats.nationalityDistribution
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return sortedNationalities.map(([nationality, count]) => ({
      nationality,
      count,
      percentage:
        demographicsStats.totalEmployees > 0
          ? Math.round((count / demographicsStats.totalEmployees) * 100)
          : 0,
    }));
  }, [demographicsStats]);

  // UAE Age Groups Chart Data
  const uaeAgeGroupChartData = React.useMemo(() => {
    if (!demographicsStats?.uaeAgeGroups) return [];
    return Object.entries(demographicsStats.uaeAgeGroups).map(
      ([ageGroup, data]) => ({
        ageGroup,
        count: data.total,
        male: data.male,
        female: data.female,
        percentage:
          demographicsStats.totalUAEEmployees > 0
            ? Math.round(
                (data.total / demographicsStats.totalUAEEmployees) * 100
              )
            : 0,
      })
    );
  }, [demographicsStats]);

  // Calculate summary stats
  const stats = {
    totalEmployees: demographicsStats?.totalEmployees || 0,
    averageAge: React.useMemo(() => {
      if (!employeeData.results.length) return 0;
      const totalAge = employeeData.results.reduce(
        (sum, emp) => sum + (parseInt(emp.age) || 0),
        0
      );
      return Math.round(totalAge / employeeData.results.length);
    }, [employeeData.results]),
    malePercentage: React.useMemo(() => {
      if (!demographicsStats?.genderDistribution) return 0;
      const male = demographicsStats.genderDistribution.MALE || 0;
      return demographicsStats.totalEmployees > 0
        ? Math.round((male / demographicsStats.totalEmployees) * 100)
        : 0;
    }, [demographicsStats]),
    femalePercentage: React.useMemo(() => {
      if (!demographicsStats?.genderDistribution) return 0;
      const female = demographicsStats.genderDistribution.FEMALE || 0;
      return demographicsStats.totalEmployees > 0
        ? Math.round((female / demographicsStats.totalEmployees) * 100)
        : 0;
    }, [demographicsStats]),
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "All employees",
            color: "text-plum-900",
          },
          {
            title: "Average Age",
            value: `${stats.averageAge} years`,
            description: "Organization average",
            color: "text-blue-600",
          },
          {
            title: "Male Employees",
            value: `${stats.malePercentage}%`,
            description: "Gender distribution",
            color: "text-indigo-600",
          },
          {
            title: "Female Employees",
            value: `${stats.femalePercentage}%`,
            description: "Gender distribution",
            color: "text-pink-600",
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Age Distribution Chart */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Age Distribution (All Employees)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageGroupChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="ageGroup" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} employees`, name]}
                />
                <Bar
                  dataKey="count"
                  fill="#A78BFA"
                  name="Total"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* UAE Age Distribution Chart */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              UAE Nationals Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={uaeAgeGroupChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="ageGroup" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} UAE nationals`, name]}
                />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  name="UAE Nationals"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Distribution Chart */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderChartData}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {genderChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={genderColors[index % genderColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} employees`, name]}
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
      </div>

      {/* Top Nationalities Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Top 10 Nationalities
          </CardTitle>
          <CardDescription>
            Distribution of employees by nationality
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={nationalityChartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
            >
              <XAxis
                dataKey="nationality"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                formatter={(value, name) => [`${value} employees`, `Count`]}
              />
              <Bar
                dataKey="count"
                fill="#10B981"
                name="Employees"
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Demographics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Demographics Report</CardTitle>
          <CardDescription>
            Detailed demographic information including age, gender, tenure, and
            nationality for all employees with filtering and sorting
            capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={DemographicsColumns()}
              data={employeeData.results}
              pagination={true}
              dataTotalSize={employeeData.count}
              tableOptions={tableOptions}
              fallbackText="No demographic data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemographicsReport;
