// src/app/modules/Reports/screens/ExitAndClearanceReports/Sections/ExitProcessingComplianceReport.jsx

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom } from "components";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import {
  ClearancePendingReportColumns,
  ExitInterviewReportColumns,
  NoticePeriodComplianceColumns,
} from "../TableColumns/ExitClearanceTableColumns";

const ExitProcessingComplianceReport = ({
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
                Multiple APIs Development in Progress
              </p>
              <p className="text-sm text-yellow-700">
                Clearance Pending, Exit Interview, and Notice Period Compliance
                APIs are currently being developed. Expected completion today
                according to backend team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Pending Clearances",
            value: "...",
            description: "Awaiting clearance",
            color: "text-yellow-600",
          },
          {
            title: "Asset Returns",
            value: "...",
            description: "Pending assets",
            color: "text-blue-600",
          },
          {
            title: "Exit Interviews",
            value: "...",
            description: "Completed interviews",
            color: "text-green-600",
          },
          {
            title: "Notice Compliance",
            value: "...",
            description: "Compliant employees",
            color: "text-purple-600",
          },
          {
            title: "Non-Compliant",
            value: "...",
            description: "Notice violations",
            color: "text-red-600",
          },
          {
            title: "Avg Rating",
            value: "...",
            description: "Exit interview rating",
            color: "text-indigo-600",
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

      {/* Multi-Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Exit Processing & Compliance Tracking</CardTitle>
          <CardDescription>
            Comprehensive exit process management including clearance status,
            exit interviews, and notice period compliance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clearance_pending">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="clearance_pending">
                Clearance Pending
              </TabsTrigger>
              <TabsTrigger value="exit_interviews">Exit Interviews</TabsTrigger>
              <TabsTrigger value="notice_compliance">
                Notice Compliance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clearance_pending">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <strong>Clearance Pending Features:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Track asset returns (Laptop, Badge, Equipment)</li>
                    <li>Monitor payroll final settlements</li>
                    <li>Manage HR documentation completion</li>
                    <li>Overall clearance status tracking</li>
                  </ul>
                </div>

                <TableCustom
                  columns={ClearancePendingReportColumns()}
                  data={[]}
                  pagination={false}
                  fallbackText="Clearance Pending API is currently in development."
                />
              </div>
            </TabsContent>

            <TabsContent value="exit_interviews">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <strong>Exit Interview Features:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Capture exit reasons and feedback</li>
                    <li>Record interviewer and ratings (1-5 scale)</li>
                    <li>Generate feedback summaries and insights</li>
                    <li>Track completion rates by department</li>
                  </ul>
                </div>

                <TableCustom
                  columns={ExitInterviewReportColumns()}
                  data={[]}
                  pagination={false}
                  fallbackText="Exit Interview API is currently in development."
                />
              </div>
            </TabsContent>

            <TabsContent value="notice_compliance">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <strong>Notice Period Compliance Features:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Track notice period start and end dates</li>
                    <li>Calculate required vs. served notice days</li>
                    <li>Monitor compliance status (Compliant/Non-Compliant)</li>
                    <li>Generate compliance reports by department</li>
                  </ul>
                </div>

                <TableCustom
                  columns={NoticePeriodComplianceColumns()}
                  data={[]}
                  pagination={false}
                  fallbackText="Notice Period Compliance API is currently in development."
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExitProcessingComplianceReport;
