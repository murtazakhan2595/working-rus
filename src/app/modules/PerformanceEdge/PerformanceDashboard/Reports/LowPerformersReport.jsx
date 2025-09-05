// src/app/modules/PerformanceEdge/PerformanceDashboard/Reports/LowPerformersReport.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { TableCustom } from "components";

export function LowPerformersReport({ dashboardData = {} }) {
  const { low_performers = [] } = dashboardData;

  const columns = [
    {
      dataField: "name",
      text: "Employee Name",
      dataSort: true,
    },
    {
      dataField: "department",
      text: "Department",
      dataSort: true,
    },
    {
      dataField: "final_score",
      text: "Final Score",
      dataSort: true,
      formatter: (cell) => (
        <span className="font-semibold text-red-600">{cell}</span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Performer Identification</CardTitle>
        <p className="text-sm text-neutral-600">
          Employees who may need additional support or development
        </p>
      </CardHeader>
      <CardContent>
        {low_performers.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-neutral-800">
            <p>No low performers data available</p>
          </div>
        ) : (
          <TableCustom
            data={low_performers}
            columns={columns}
            pagination={true}
            dataTotalSize={low_performers.length}
          />
        )}
      </CardContent>
    </Card>
  );
}
