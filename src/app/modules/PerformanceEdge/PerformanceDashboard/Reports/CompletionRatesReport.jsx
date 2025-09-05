// src/app/modules/PerformanceEdge/PerformanceDashboard/Reports/CompletionRatesReport.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { TableCustom } from "components";

export function CompletionRatesReport({ dashboardData = {} }) {
  const { completion_rates = {} } = dashboardData;

  const completionData = React.useMemo(() => {
    return (
      completion_rates.by_department?.map((dept) => ({
        department: dept.dept_name,
        completed: dept.completed,
        pending: dept.pending,
        percentage: dept.percentage,
      })) || []
    );
  }, [completion_rates.by_department]);

  const columns = [
    {
      dataField: "department",
      text: "Department",
      dataSort: true,
    },
    {
      dataField: "completed",
      text: "Completed",
      dataSort: true,
      formatter: (cell) => (
        <span className="font-semibold text-green-600">{cell}</span>
      ),
    },
    {
      dataField: "pending",
      text: "Pending",
      dataSort: true,
      formatter: (cell) => (
        <span className="font-semibold text-yellow-600">{cell}</span>
      ),
    },
    {
      dataField: "percentage",
      text: "Completion %",
      dataSort: true,
      formatter: (cell) => (
        <span className="font-semibold">{cell.toFixed(1)}%</span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Completion Rates by Department</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {completionData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-neutral-800">
              <p>No completion data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <XAxis
                  dataKey="department"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#7BE0AD" name="Completed" />
                <Bar dataKey="pending" fill="#FBC02D" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rates Table</CardTitle>
        </CardHeader>
        <CardContent>
          <TableCustom
            data={completionData}
            columns={columns}
            pagination={false}
            dataTotalSize={completionData.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
