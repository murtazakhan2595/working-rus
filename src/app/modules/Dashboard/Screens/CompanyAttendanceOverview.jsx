import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getAttendanceStats } from "app/hooks/attendance";
import { PageLoader } from "components";

const COLORS = {
  Present: "#34D399", // Green
  Absent: "#F87171", // Red
  Late: "#FBBF24", // Yellow
  "On Leave": "#A78BFA", // Purple
};

const CompanyAttendanceOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({
    total_employees: 0,
    daily_stats: {
      Present: 0,
      Absent: 0,
      Late: 0,
      "On Leave": 0,
    },
  });

  const fetchAttendanceStats = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceStats({ filterData: {} });
      if (response) {
        setAttendanceStats({
          total_employees: response?.valid_employee_count || 0,
          daily_stats: response?.daily_stats,
        });
      }
    } catch (error) {
      console.error("Error fetching attendance statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStats();
  }, []);

  // Calculate percentages
  const calculatePercentage = (value) => {
    const total = attendanceStats.total_employees;
    if (!total) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  // Prepare data for pie chart
  const chartData = Object.entries(attendanceStats.daily_stats || {}).map(
    ([status, count]) => ({
      name: status,
      value: parseInt(count) || 0,
      percentage: calculatePercentage(count),
      color: COLORS[status] || "#CBD5E1", // Default gray color if status is not in COLORS
    })
  );

  // Handle click on chart segment
  const handleChartClick = (data) => {
    if (data && data.name) {
      // Navigate to attendance list filtered by the clicked status
      navigate(`/attendance?status=${data.name}`);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <CardHeader className="pb-2">
        <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          Company Attendance
        </div>
      </CardHeader>
      <CardContent>
        <div className="">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={50} // Added innerRadius to make it a doughnut chart
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handleChartClick}
                  cursor="pointer"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} (${props.payload.percentage}%)`,
                    name,
                  ]}
                />
                {/* <Legend /> */}
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-center">
            <div className="font-semibold ">Attendance Metrics</div>
            <div className="space-y-1">
              {Object.entries(attendanceStats.daily_stats || {}).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex justify-between items-center px-3 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleChartClick({ name: status })}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: COLORS[status] || "#CBD5E1" }}
                      ></div>
                      <span>{status}</span>
                    </div>
                    <div>
                      <span className="font-bold">{count}</span>
                      <span className="text-gray-500 ml-2">
                        ({calculatePercentage(count)}%)
                      </span>
                    </div>
                  </div>
                )
              )}
              <div className="flex justify-between border-t pt-1 font-bold">
                <span>Total Employees</span>
                <span>{attendanceStats.total_employees}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default CompanyAttendanceOverview;
