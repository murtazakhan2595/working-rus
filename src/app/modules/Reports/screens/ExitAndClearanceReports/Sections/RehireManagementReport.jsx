// src/app/modules/Reports/screens/ExitAndClearanceReports/Sections/RehireManagementReport.jsx

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom } from "components";
import { RehireEligibilityReportColumns } from "../TableColumns/ExitClearanceTableColumns";

const RehireManagementReport = ({
  filterData = {},
  onFilterChange = () => {},
  isReady = false,
}) => {
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
                Rehire Eligibility API is currently being developed by the
                backend team. This will enable tracking of employee rehire
                eligibility based on exit reasons and HR decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Eligible for Rehire",
            value: "...",
            description: "Rehire approved",
            color: "text-green-600",
          },
          {
            title: "Not Eligible",
            value: "...",
            description: "Rehire declined",
            color: "text-red-600",
          },
          {
            title: "Under Review",
            value: "...",
            description: "Pending HR decision",
            color: "text-yellow-600",
          },
          {
            title: "Voluntary Exits",
            value: "...",
            description: "Voluntary departures",
            color: "text-blue-600",
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

      {/* Rehire Eligibility Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rehire Eligibility Management</CardTitle>
          <CardDescription>
            Track employee rehire eligibility based on exit reasons, performance
            history, and HR decisions. This comprehensive system will help
            maintain a qualified talent pool for future opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>Expected Rehire Management Features:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>
                  Automatic eligibility assessment based on exit type and reason
                </li>
                <li>HR decision tracking and approval workflows</li>
                <li>Eligibility status with conditional rehire periods</li>
                <li>
                  Integration with exit interviews and performance history
                </li>
                <li>Reporting on rehire rates and success metrics</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  ✅ Eligible Criteria
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Voluntary resignation</li>
                  <li>• Career growth/relocation</li>
                  <li>• Good performance record</li>
                  <li>• Proper notice period served</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">
                  ❌ Ineligible Criteria
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Termination for misconduct</li>
                  <li>• Policy violations</li>
                  <li>• Performance issues</li>
                  <li>• Notice period non-compliance</li>
                </ul>
              </div>
            </div>

            <TableCustom
              columns={RehireEligibilityReportColumns()}
              data={[]}
              pagination={false}
              fallbackText="Rehire Eligibility API is currently in development. Data will be available once the API is implemented."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RehireManagementReport;
