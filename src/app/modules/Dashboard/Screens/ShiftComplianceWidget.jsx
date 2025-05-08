import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "components/ui/card";
import { getAttendance, getShift, getEmployeeList } from "app/hooks/attendance";
import { PageLoader } from "components";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// Color scheme
const COLORS = {
  Compliant: "#34D399", // Green
  "Non-Compliant": "#F87171", // Red
};

const ShiftComplianceWidget = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState({
    complianceRate: 0,
    compliantCount: 0,
    nonCompliantCount: 0,
    totalEmployees: 0,
    shiftDistribution: [],
  });

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      // Get today's date
      const today = moment().format("YYYY-MM-DD");

      // Get all employees
      const employeesResponse = await getEmployeeList({});

      // Get today's attendance data
      const attendanceResponse = await getAttendance({
        filterData: { date: today },
      });

      // Get all shifts
      const shiftsResponse = await getShift();
      
      
      if (attendanceResponse && shiftsResponse && employeesResponse) {
        const employees = employeesResponse.results?.employees || [];
        const attendance = attendanceResponse.results || [];
        const shifts = shiftsResponse.results || [];
      
        // Filter employees with shift assignments manually
        const employeesWithShifts = employees.filter(
          (emp) => emp.shift_assignment
        );
        const totalEmployees = employeesWithShifts.length;

        // Create a map of employees who have checked in today
        const employeeCheckIns = {};
        attendance.forEach((record) => {
          if (record.employee_id && record.checkin) {
            employeeCheckIns[record.employee_id] = record;
          }
        });

        // Create a map to count employees by shift
        const shiftCounts = {};
        shifts.forEach((shift) => {
          shiftCounts[shift.id] = {
            name: shift.name,
            count: 0,
            complianceCount: 0,
            shiftStartTime: moment(shift.starttime).format("h:mm A"),
            shiftEndTime: moment(shift.endtime).format("h:mm A"),
          };
        });

        // Analyze compliance for each employee with a shift
        let compliantCount = 0;

        employeesWithShifts.forEach((employee) => {
          const shiftId = employee.shift_assignment;

          // Skip if shift doesn't exist in our data
          if (!shiftId || !shiftCounts[shiftId]) return;

          // Count this employee in their assigned shift
          shiftCounts[shiftId].count += 1;

          // Check if employee has checked in today
          const hasCheckedIn = !!employeeCheckIns[employee.id];

          if (hasCheckedIn) {
            compliantCount++;
            shiftCounts[shiftId].complianceCount += 1;
          }
        });

        // Calculate non-compliant count
        const nonCompliantCount = totalEmployees - compliantCount;

        // Calculate compliance rate
        const complianceRate =
          totalEmployees > 0
            ? Math.round((compliantCount / totalEmployees) * 100)
            : 0;

        // Format shift distribution data for chart
        const shiftDistribution = Object.entries(shiftCounts)
          .filter(([_, shift]) => shift.count > 0)
          .map(([shiftId, shift]) => ({
            name: `${shift.name} (${shift.shiftStartTime} - ${shift.shiftEndTime})`,
            value: shift.count,
            complianceCount: shift.complianceCount,
            complianceRate:
              shift.count > 0
                ? Math.round((shift.complianceCount / shift.count) * 100)
                : 0,
          }));

        setComplianceData({
          complianceRate,
          compliantCount,
          nonCompliantCount,
          totalEmployees,
          shiftDistribution,
        });
      }
    } catch (error) {
      console.error("Error fetching compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  // Prepare chart data
  const complianceChartData = [
    {
      name: "Compliant",
      value: complianceData.compliantCount,
      percentage:
        complianceData.totalEmployees > 0
          ? (
              (complianceData.compliantCount / complianceData.totalEmployees) *
              100
            ).toFixed(1)
          : 0,
    },
    {
      name: "Non-Compliant",
      value: complianceData.nonCompliantCount,
      percentage:
        complianceData.totalEmployees > 0
          ? (
              (complianceData.nonCompliantCount /
                complianceData.totalEmployees) *
              100
            ).toFixed(1)
          : 0,
    },
  ];

  // Custom tooltip for compliance chart
  const ComplianceTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded border shadow-md">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm">Count: {data.value}</p>
          <p className="text-sm">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for shift distribution chart
  const ShiftTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded border shadow-md">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm">Total Employees: {data.value}</p>
          <p className="text-sm">
            Compliant: {data.complianceCount} ({data.complianceRate}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Handle click on compliance section
  const handleComplianceClick = () => {
    // Navigate to shift calendar or compliance detail page
    navigate("/shift-calendar");
  };

  if (loading) return <PageLoader />;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    // Calculate position for the label
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position labels further from the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={index === 0 ? "#34D399" : "#F87171"}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };
  return (
    <>
      <CardHeader className="pb-2">
        <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          Shift Compliance Report
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Compliance Rate Chart */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleComplianceClick}
          >
            <div className="text-lg font-medium mb-2">Compliance Rate</div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {complianceChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? COLORS.Compliant
                            : COLORS["Non-Compliant"]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ComplianceTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <div className="text-xl font-bold">
                {complianceData.complianceRate}%
              </div>
              <div className="text-sm text-gray-600">Compliance Today</div>
            </div>
          </div>

          {/* Shift Distribution */}
          <div className="flex flex-col">
            <div className="text-lg font-medium mb-2">Shift Distribution</div>
            <div className="h-64 w-full">
              {complianceData.shiftDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceData.shiftDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name.split(" ")[0]}: ${value}`
                      }
                    >
                      {complianceData.shiftDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${index * 60}, 70%, 60%)`}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ShiftTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No shift data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {complianceData.totalEmployees}
            </div>
            <div className="text-sm">Employees with Shifts</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {complianceData.compliantCount}
            </div>
            <div className="text-sm">Compliant</div>
          </div>
          <div className="bg-[#FEE2E2] p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-[#DC2626]">
              {complianceData.nonCompliantCount}
            </div>
            <div className="text-sm">Non-Compliant</div>
          </div>
        </div>

        {/* Shift details table */}
        {complianceData.shiftDistribution.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold mb-2">Shift Details</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">Shift</th>
                    <th className="text-right p-2">Employees</th>
                    <th className="text-right p-2">Compliant</th>
                    <th className="text-right p-2">Compliance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceData.shiftDistribution.map((shift, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{shift.name}</td>
                      <td className="p-2 text-right">{shift.value}</td>
                      <td className="p-2 text-right">
                        {shift.complianceCount} / {shift.value}
                      </td>
                      <td className="p-2 text-right">
                        {shift.complianceRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
};

export default ShiftComplianceWidget;
