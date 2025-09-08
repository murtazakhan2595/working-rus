import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { Badge } from "components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import {
  BarChart,
  Bar,
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
  getHeadcountStats,
  getDepartmentGenderNationalityReport,
  getOrgReport,
} from "app/hooks/reports";
import {
  HeadcountColumns,
  DiversityColumns,
} from "../TableColumns/ReportTableColumns";

const CrossFunctionalReports = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [orgReportData, setOrgReportData] = useState(null);
  const [diversityData, setDiversityData] = useState({});
  const [activeSubTab, setActiveSubTab] = useState("headcount");

  // Chart colors
  const statusColors = ["#10B981", "#F59E0B", "#EF4444", "#6B7280"];

  const fetchCrossFunctionalData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };

      // Fetch organizational report data
      const orgResponse = await getOrgReport(combinedFilters);
      if (orgResponse) setOrgReportData(orgResponse);

      // Fetch diversity data
      const diversityResponse = await getDepartmentGenderNationalityReport(
        combinedFilters
      );
      if (diversityResponse) setDiversityData(diversityResponse);
    } catch (error) {
      console.error("Error fetching cross-functional data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchCrossFunctionalData();
    }
  }, [filterData, permittedViewFilterData]);

  // Prepare headcount table data from org report
  const headcountTableData = React.useMemo(() => {
    if (!orgReportData?.departmentWise) return [];

    return orgReportData.departmentWise.map((dept) => ({
      department: dept.department,
      location: Object.keys(dept.locations || {})[0] || "Multiple",
      total_employees: dept.total,
      active: dept.active,
      on_leave: dept.on_leave,
      terminated: dept.terminated,
      retired: dept.retired,
    }));
  }, [orgReportData]);

  // Prepare diversity table data
  const diversityTableData = React.useMemo(() => {
    if (!diversityData || Object.keys(diversityData).length === 0) return [];

    return Object.entries(diversityData).map(([dept, stats]) => ({
      department: dept,
      total_employees: stats.total,
      male: stats.male,
      female: stats.female,
      male_percentage: Math.round(stats.male_percentage),
      female_percentage: Math.round(stats.female_percentage),
      nationality_breakdown:
        stats.top_3_nationalities
          ?.map((n) => n.country)
          .slice(0, 3)
          .join(", ") || "N/A",
    }));
  }, [diversityData]);

  // Prepare chart data for department status breakdown
  const departmentStatusChartData = React.useMemo(() => {
    if (!orgReportData?.departmentWise) return [];

    return orgReportData.departmentWise
      .filter((dept) => dept.total > 0)
      .slice(0, 10) // Top 10 departments
      .map((dept) => ({
        department:
          dept.department.length > 15
            ? dept.department.substring(0, 15) + "..."
            : dept.department,
        active: dept.active,
        on_leave: dept.on_leave,
        terminated: dept.terminated,
        retired: dept.retired,
      }));
  }, [orgReportData]);

  // Prepare location distribution chart
  const locationChartData = React.useMemo(() => {
    if (!orgReportData?.locationWise) return [];

    return orgReportData.locationWise.map((loc) => ({
      location: loc.location,
      total: loc.total,
      active: loc.active,
    }));
  }, [orgReportData]);

  // Calculate summary stats
  const stats = {
    totalEmployees: orgReportData?.grandTotals?.total || 0,
    activeEmployees: orgReportData?.grandTotals?.active || 0,
    terminatedEmployees: orgReportData?.grandTotals?.terminated || 0,
    totalDepartments: orgReportData?.departmentWise?.length || 0,
    totalLocations: orgReportData?.locationWise?.length || 0,
    totalBranches: orgReportData?.branchWise?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Cross-Functional Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Organization wide",
            color: "text-plum-900",
          },
          {
            title: "Active Employees",
            value: stats.activeEmployees,
            description: "Currently active",
            color: "text-green-600",
          },
          {
            title: "Terminated",
            value: stats.terminatedEmployees,
            description: "Former employees",
            color: "text-red-600",
          },
          {
            title: "Departments",
            value: stats.totalDepartments,
            description: "Active departments",
            color: "text-blue-600",
          },
          {
            title: "Locations",
            value: stats.totalLocations,
            description: "Office locations",
            color: "text-purple-600",
          },
          {
            title: "Branches",
            value: stats.totalBranches,
            description: "Branch offices",
            color: "text-indigo-600",
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
        {/* Department Status Breakdown */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Employee Status by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentStatusChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="active"
                  stackId="a"
                  fill="#10B981"
                  name="Active"
                />
                <Bar
                  dataKey="on_leave"
                  stackId="a"
                  fill="#F59E0B"
                  name="On Leave"
                />
                <Bar
                  dataKey="terminated"
                  stackId="a"
                  fill="#EF4444"
                  name="Terminated"
                />
                <Bar
                  dataKey="retired"
                  stackId="a"
                  fill="#6B7280"
                  name="Retired"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Employee Distribution by Location
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationChartData}
                  dataKey="total"
                  nameKey="location"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {locationChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
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

      {/* Sub-reports Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Organizational Analytics</CardTitle>
          <CardDescription>
            Comprehensive organizational analytics including headcount,
            diversity, and workforce distribution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="headcount">Headcount Report</TabsTrigger>
              <TabsTrigger value="diversity">Diversity & Inclusion</TabsTrigger>
            </TabsList>

            <TabsContent value="headcount">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={HeadcountColumns()}
                  data={headcountTableData}
                  pagination={false}
                  fallbackText="No headcount data available"
                />
              )}
            </TabsContent>

            <TabsContent value="diversity">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={DiversityColumns()}
                  data={diversityTableData}
                  pagination={false}
                  fallbackText="No diversity data available"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Placeholder for additional cross-functional reports */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm">Employee Turnover Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">API Development Required</Badge>
            <p className="text-xs text-neutral-800 mt-2">
              Joiners vs Leavers trends, turnover rates by department
            </p>
          </CardContent>
        </Card>
    </div>
  );
};

export default CrossFunctionalReports;
