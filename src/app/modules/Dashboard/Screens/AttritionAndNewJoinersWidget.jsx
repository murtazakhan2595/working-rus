import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  ChartConfig,
  ChartContainer,
} from "../../../../src/@/components/ui/chart";
import { getEmployeeMonthlySummary } from "app/hooks/employee";

export default function AttritionAndNewJoinersWidget() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [attritionData, setAttritionData] = useState({
    resignations: 0,
    terminations: 0,
    newHires: 0,
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Function to fetch attrition and new joiners data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeMonthlySummary();

      if (response && response.length > 0) {
        // Get current month data (first item in the array)
        const currentMonthData = response[0];

        // Format the data for the chart
        const formattedData = response.map((item) => {
          // Extract month name from "Month YYYY" format
          const monthParts = item.month.split(" ");
          const monthName = monthParts[0];

          return {
            month: monthName.substring(0, 3), // Abbreviate month name to first 3 letters
            resignations: item.resigned,
            terminations: item.terminated,
            newHires: item.joined,
          };
        });

        // Reverse the data to show oldest months first (left to right)
        const sortedData = formattedData.reverse();

        setAttritionData({
          resignations: currentMonthData.resigned,
          terminations: currentMonthData.terminated,
          newHires: currentMonthData.joined,
          monthlyData: sortedData,
        });

        // Update current month and year from API data
        if (currentMonthData.month) {
          const dateParts = currentMonthData.month.split(" ");
          if (dateParts.length === 2) {
            setCurrentMonth(dateParts[0]);
            setCurrentYear(dateParts[1]);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching attrition data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchData();
    }
  }, [userProfile]);

  // Direct color values for the chart
  const chartConfig = {
    resignations: {
      label: "Resignations",
      color: "#9d4edd", // Purple color for resignations
    },
    terminations: {
      label: "Terminations",
      color: "#f59e0b", // Amber color for terminations
    },
    newHires: {
      label: "New Hires",
      color: "#10b981", // Green color for new hires
    },
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border rounded shadow">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="flex items-center text-neutral-1100">
              <span
                className="inline-block w-2 h-2 mr-2 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Attrition & New Joiners
          </div>
          {(userProfile.role === 1 || userProfile.role === 3) && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Link to="/exit-clearance">View Exits</Link>
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-slate-900">
          <Calendar className="w-4 h-4" />
          <span>
            {currentMonth} {currentYear}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="grid grid-cols-3 gap-4 mb-1">
          <div className="flex flex-col items-center px-3 py-2 bg-white hover:bg-gray-50 rounded-md shadow-sm">
            <span className="text-xl font-bold" style={{ color: "#9d4edd" }}>
              {attritionData.resignations}
            </span>
            <span className="text-sm text-neutral-600">Resignations</span>
          </div>
          <div className="flex flex-col items-center px-3 py-2 bg-white hover:bg-gray-50 rounded-md shadow-sm">
            <span className="text-xl font-bold" style={{ color: "#f59e0b" }}>
              {attritionData.terminations}
            </span>
            <span className="text-sm text-neutral-600">Terminations</span>
          </div>
          <div className="flex flex-col items-center px-3 py-2 bg-white hover:bg-gray-50 rounded-md shadow-sm">
            <span className="text-xl font-bold" style={{ color: "#10b981" }}>
              {attritionData.newHires}
            </span>
            <span className="text-sm text-neutral-600">New Hires</span>
          </div>
        </div>

        {attritionData.monthlyData.length > 0 && (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attritionData.monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="resignations"
                  name="Resignations"
                  fill={chartConfig.resignations.color}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="terminations"
                  name="Terminations"
                  fill={chartConfig.terminations.color}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="newHires"
                  name="New Hires"
                  fill={chartConfig.newHires.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </>
  );
}
