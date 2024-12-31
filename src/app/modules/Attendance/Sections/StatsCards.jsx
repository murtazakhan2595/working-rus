"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { useSelector } from "react-redux";

export function StatsCards({ attendanceData }) {
  const employees = useSelector((state) => state.emp.employees);
  const lateCount = attendanceData.filter((record) => record.is_late).length;
  const absenteCount = attendanceData.filter(
    (record) => record.is_absent
  ).length;
  const statsData = [
    { title: "Total Employees", value: employees?.length || 0 },
    { title: "Present", value: attendanceData?.length || 0 },
    { title: "Late", value: lateCount },
    { title: "Absent", value: absenteCount || 0 },
    {
      title: "Not Arrived",
      value: parseInt(employees?.length - attendanceData?.length),
    },
    { title: "Attendance Requests", value: 5 },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
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
            <p className="text-3xl font-medium text-plum-900">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
