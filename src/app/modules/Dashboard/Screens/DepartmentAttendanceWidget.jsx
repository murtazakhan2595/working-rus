import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { getDepartmentPercentage } from "app/hooks/attendance";
import { FilterInput } from "components/FormControl";
import { PageLoader } from "components";
import { ScrollArea } from "src/@/components/ui/scroll-area";

// Color scheme matching your existing components
const COLORS = {
  Present: "#34D399", // Green
  Absent: "#F87171", // Red
  Late: "#FBBF24", // Yellow
  "On Leave": "#A78BFA", // Purple
};

const DepartmentAttendanceWidget = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredDepartment, setFilteredDepartment] = useState("");
  const Departments = useSelector((state) => state.common.departments);

  const fetchDepartmentData = async () => {
    setLoading(true);
    try {
      const response = await getDepartmentPercentage();
      if (response) {
        setDepartmentData(response);
      }
    } catch (error) {
      console.error("Error fetching department attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  // Filter departments if a specific one is selected
  const displayData = filteredDepartment
    ? departmentData.filter(
        (dept) => dept.department_name === filteredDepartment
      )
    : departmentData;

  // Transform data for the chart with calculated values
  const chartData = displayData.map((dept) => {
    // Calculate metrics
    const totalEmployees = dept.total_employees || 0;
    const presentCount = dept.present_count || 0;
    const lateCount = dept.late_count || 0;
    const onLeaveCount = dept.leave_count || 0; 

    // Calculate absent count
    const absentCount =
      totalEmployees - presentCount - lateCount - onLeaveCount;

    // Calculate percentages
    const presentPercentage =
      totalEmployees > 0 ? (presentCount / totalEmployees) * 100 : 0;
    const latePercentage =
      totalEmployees > 0 ? (lateCount / totalEmployees) * 100 : 0;
    const onLeavePercentage =
      totalEmployees > 0 ? (onLeaveCount / totalEmployees) * 100 : 0;
    const absentPercentage =
      totalEmployees > 0 ? (absentCount / totalEmployees) * 100 : 0;

    // Abbreviated department name
    const shortName = dept.department_name.substring(0, 3).toUpperCase();

    return {
      name: dept.department_name,
      shortName: shortName, // For chart display
      Present: parseFloat(presentPercentage.toFixed(1)),
      Absent: parseFloat(absentPercentage.toFixed(1)),
      Late: parseFloat(latePercentage.toFixed(1)),
      "On Leave": parseFloat(onLeavePercentage.toFixed(1)),
      totalEmployees,
      presentCount,
      absentCount,
      lateCount,
      onLeaveCount,
    };
  });

  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "department") {
      setFilteredDepartment(filterValue);
    }
  };

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find the department info by matching the shortName with the original data
      const departmentInfo = chartData.find((dept) => dept.shortName === label);

      if (!departmentInfo) return null;

      return (
        <div className="bg-white p-3 rounded border shadow-md">
          <p className="font-bold">{departmentInfo.name}</p>
          <p className="text-sm">
            Total Employees: {departmentInfo?.totalEmployees}
          </p>
          <div className="mt-2">
            <p className="text-sm text-green-600">
              Present: {departmentInfo?.presentCount} ({departmentInfo?.Present}
              %)
            </p>
            <p className="text-sm text-red-600">
              Absent: {departmentInfo?.absentCount} ({departmentInfo?.Absent}%)
            </p>
            <p className="text-sm text-amber-500">
              Late: {departmentInfo?.lateCount} ({departmentInfo?.Late}%)
            </p>
            <p className="text-sm text-purple-600">
              On Leave: {departmentInfo?.onLeaveCount} (
              {departmentInfo?.["On Leave"]}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Department-wise Attendance
          </div>
          {/* <FilterInput
            filters={[
              {
                type: "select-one",
                option: Departments,
                name: "department",
                placeholder: "All Departments",
                values: filteredDepartment,
                width: "w-[175px]",
              },
            ]}
            onChange={handleFilterChange}
          /> */}
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Section - Horizontal Layout with abbreviated labels */}
        <div className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="shortName"
                  tickLine={true}
                  tick={{ fontSize: 11 }}
                />
                <YAxis type="number" domain={[0, 100]} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="Present"
                  stackId="a"
                  fill={COLORS.Present}
                  name="Present"
                />
                <Bar
                  dataKey="Absent"
                  stackId="a"
                  fill={COLORS.Absent}
                  name="Absent"
                />
                <Bar
                  dataKey="Late"
                  stackId="a"
                  fill={COLORS.Late}
                  name="Late"
                />
                <Bar
                  dataKey="On Leave"
                  stackId="a"
                  fill={COLORS["On Leave"]}
                  name="On Leave"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No department data available</p>
            </div>
          )}
        </div>

        {/* Department Details Table - Scrollable */}
        <div className="mt-4">
          <div className="font-semibold mb-2">Department Details</div>
          <ScrollArea className="h-48">
            {" "}
            {/* Fixed height with scrolling */}
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-100 border-b">
                  <th className="text-left py-1 px-2">Department</th>
                  <th className="text-right py-1 px-2">Total</th>
                  <th className="text-right py-1 px-2">Present</th>
                  <th className="text-right py-1 px-2">Absent</th>
                  <th className="text-right py-1 px-2">Late</th>
                  <th className="text-right py-1 px-2">On Leave</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((dept, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-1 px-2">{dept.name}</td>
                    <td className="text-right py-1 px-2">
                      {dept.totalEmployees}
                    </td>
                    <td className="text-right py-1 px-2">
                      {dept.presentCount} ({dept.Present}%)
                    </td>
                    <td className="text-right py-1 px-2">
                      {dept.absentCount} ({dept.Absent}%)
                    </td>
                    <td className="text-right py-1 px-2">
                      {dept.lateCount} ({dept.Late}%)
                    </td>
                    <td className="text-right py-1 px-2">
                      {dept.onLeaveCount} ({dept["On Leave"]}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </CardContent>
    </>
  );
};

export default DepartmentAttendanceWidget;
