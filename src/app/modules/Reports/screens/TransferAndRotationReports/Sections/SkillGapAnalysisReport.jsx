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
import {
  getRotationSkillGapData,
  getEmployeeRotationFrequencyData,
} from "app/hooks/reports";
import {
  RotationSkillGapColumns,
  EmployeeRotationFrequencyColumns,
} from "../TableColumns/TransferRotationTableColumns";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";

const SkillGapAnalysisReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [skillGapData, setSkillGapData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [rotationFrequencyData, setRotationFrequencyData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("skill_gap");

  // Chart colors
  const skillGapColors = {
    No: "#10B981",
    Yes: "#EF4444",
  };

  const trainingColors = {
    not_required: "#10B981",
    required: "#F59E0B",
  };

  // Fetch skill gap data
  const fetchSkillGapData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const [skillGapResponse, rotationFreqResponse] = await Promise.all([
        getRotationSkillGapData(payload),
        getEmployeeRotationFrequencyData(payload),
      ]);

      if (skillGapResponse) {
        setSkillGapData(skillGapResponse);
      }

      if (rotationFreqResponse) {
        setRotationFrequencyData(rotationFreqResponse);
      }
    } catch (error) {
      console.error("Error fetching skill gap data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchSkillGapData();
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

  // Calculate stats from aggregated_stats
  const stats = {
    totalEmployees: skillGapData.aggregated_stats?.total_employees || 0,
    noSkillGap: skillGapData.aggregated_stats?.skill_gap_status?.No || 0,
    hasSkillGap: skillGapData.aggregated_stats?.skill_gap_status?.Yes || 0,
    trainingRequired:
      skillGapData.aggregated_stats?.training_required?.required || 0,
    trainingNotRequired:
      skillGapData.aggregated_stats?.training_required?.not_required || 0,
  };

  // Calculate additional stats from rotation frequency data
  const rotationStats = React.useMemo(() => {
    const totalRotations = rotationFrequencyData.results.reduce(
      (sum, emp) => sum + (emp.total_rotations || 0),
      0
    );
    const avgRotations =
      rotationFrequencyData.results.length > 0
        ? Math.round(
            (totalRotations / rotationFrequencyData.results.length) * 10
          ) / 10
        : 0;

    return {
      totalEmployeesWithRotations: rotationFrequencyData.count || 0,
      totalRotations,
      avgRotations,
    };
  }, [rotationFrequencyData]);

  // Calculate skill gap percentage
  const skillGapPercentage =
    stats.totalEmployees > 0
      ? Math.round((stats.hasSkillGap / stats.totalEmployees) * 100)
      : 0;

  // Prepare chart data
  const skillGapChartData = React.useMemo(() => {
    if (!skillGapData.aggregated_stats?.skill_gap_status) return [];
    return Object.entries(skillGapData.aggregated_stats.skill_gap_status).map(
      ([status, count]) => ({
        status: status === "No" ? "No Gap" : "Gap Exists",
        count,
        fill: skillGapColors[status] || "#6B7280",
      })
    );
  }, [skillGapData.aggregated_stats]);

  const trainingChartData = React.useMemo(() => {
    if (!skillGapData.aggregated_stats?.training_required) return [];
    return Object.entries(skillGapData.aggregated_stats.training_required).map(
      ([status, count]) => ({
        status: status === "not_required" ? "Not Required" : "Required",
        count,
        fill: trainingColors[status] || "#6B7280",
      })
    );
  }, [skillGapData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Skill gap assessed",
            color: "text-plum-900",
          },
          {
            title: "No Skill Gap",
            value: stats.noSkillGap,
            description: "Ready for rotation",
            color: "text-green-600",
          },
          {
            title: "Skill Gap Exists",
            value: stats.hasSkillGap,
            description: "Training needed",
            color: "text-red-600",
          },
          {
            title: "Skill Gap Rate",
            value: `${skillGapPercentage}%`,
            description: "Gap percentage",
            color:
              skillGapPercentage <= 20
                ? "text-green-600"
                : skillGapPercentage <= 50
                ? "text-yellow-600"
                : "text-red-600",
          },
          {
            title: "Training Required",
            value: stats.trainingRequired,
            description: "Need development",
            color: "text-orange-600",
          },
          {
            title: "Avg Rotations",
            value: rotationStats.avgRotations,
            description: "Per employee",
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
        {/* Skill Gap Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Skill Gap Distribution
            </CardTitle>
            <CardDescription>
              Employee skill gap analysis for rotations
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillGapChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {skillGapChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
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

        {/* Training Requirements */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Training Requirements
            </CardTitle>
            <CardDescription>
              Training needs analysis for rotations
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trainingChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} employees`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#F59E0B"
                  name="Employees"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sub-reports Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap & Rotation Analysis</CardTitle>
          <CardDescription>
            Detailed analysis of skill gaps and rotation patterns for workforce
            development planning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="skill_gap">Skill Gap Analysis</TabsTrigger>
              <TabsTrigger value="rotation_frequency">
                Rotation Frequency
              </TabsTrigger>
            </TabsList>

            <TabsContent value="skill_gap">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={RotationSkillGapColumns()}
                  data={skillGapData.results}
                  pagination={true}
                  dataTotalSize={skillGapData.count}
                  tableOptions={tableOptions}
                  fallbackText="No skill gap data found matching the current filters"
                />
              )}
            </TabsContent>

            <TabsContent value="rotation_frequency">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={EmployeeRotationFrequencyColumns()}
                  data={rotationFrequencyData.results}
                  pagination={true}
                  dataTotalSize={rotationFrequencyData.count}
                  tableOptions={tableOptions}
                  fallbackText="No rotation frequency data found matching the current filters"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillGapAnalysisReport;
