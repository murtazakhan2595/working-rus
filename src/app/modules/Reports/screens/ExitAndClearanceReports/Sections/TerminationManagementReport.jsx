// src/app/modules/Reports/screens/ExitAndClearanceReports/Sections/TerminationManagementReport.jsx

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom } from "components";
import { TerminationReportColumns } from "../TableColumns/ExitClearanceTableColumns";

const TerminationManagementReport = ({
  filterData = {},
  onFilterChange = () => {},
  isReady = false,
}) => {
  // Mock data structure for preview
  const mockTerminationData = [
    {
      employee_id: "E006",
      name: "Ahmed Raza",
      department: "IT",
      termination_date: "15-Jul-2025",
      termination_type: "Immediate",
      reason_for_termination: "Performance Issues",
      status: "Completed",
    },
    {
      employee_id: "E007",
      name: "Fatima Noor",
      department: "HR",
      termination_date: "20-Jul-2025",
      termination_type: "With Notice",
      reason_for_termination: "Policy Violation",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6">
      {/* API Status Banner */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <p className="font-medium text-yellow-800">
                API Development in Progress
              </p>
              <p className="text-sm text-yellow-700">
                Termination Management API is currently being developed by the
                backend team. The interface below shows the expected structure
                and functionality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Terminations",
            value: "...",
            description: "All termination records",
            color: "text-red-600",
          },
          {
            title: "Immediate Terminations",
            value: "...",
            description: "Without notice period",
            color: "text-orange-600",
          },
          {
            title: "Performance Issues",
            value: "...",
            description: "Performance related",
            color: "text-yellow-600",
          },
          {
            title: "Policy Violations",
            value: "...",
            description: "Policy breach cases",
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="flex flex-col justify-center shadow-md border rounded-lg opacity-60"
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

      {/* Termination Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Termination Records</CardTitle>
          <CardDescription>
            Comprehensive termination tracking including termination types,
            reasons, and compliance status. This table will be populated once
            the Termination Management API is available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>Expected Features:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Track immediate vs. notice period terminations</li>
                <li>
                  Categorize termination reasons (Performance, Policy,
                  Misconduct)
                </li>
                <li>Monitor termination process completion status</li>
                <li>Generate termination compliance reports</li>
              </ul>
            </div>

            <TableCustom
              columns={TerminationReportColumns()}
              data={[]} // Empty data - API not ready
              pagination={false}
              fallbackText="Termination Management API is currently in development. Data will be available once the API is implemented."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TerminationManagementReport;
