import React, { useState } from "react";
import { FileText, Download, Send, CheckCircle, Globe } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const GovernmentReporting = () => {
  const [selectedCountry, setSelectedCountry] = useState("GB");
  const [selectedPeriod, setSelectedPeriod] = useState("january-2025");

  const reportFormats = [
    {
      id: 1,
      country: "United Kingdom",
      countryCode: "GB",
      format: "RTI (Real Time Information)",
      frequency: "Monthly",
      deadline: "19th of each month",
      lastSubmitted: "2024-12-19",
      status: "submitted",
    },
    {
      id: 2,
      country: "United Kingdom",
      countryCode: "GB",
      format: "P11D - Benefits & Expenses",
      frequency: "Annual",
      deadline: "July 6, 2025",
      lastSubmitted: "2024-07-06",
      status: "current",
    },
    {
      id: 3,
      country: "India",
      countryCode: "IN",
      format: "Form 24Q - TDS Return",
      frequency: "Quarterly",
      deadline: "31st July 2025",
      lastSubmitted: "2024-10-31",
      status: "pending",
    },
    {
      id: 4,
      country: "India",
      countryCode: "IN",
      format: "ECR - PF Monthly Return",
      frequency: "Monthly",
      deadline: "15th of each month",
      lastSubmitted: "2024-12-15",
      status: "submitted",
    },
    {
      id: 5,
      country: "Pakistan",
      countryCode: "PK",
      format: "Monthly Tax Deduction Statement",
      frequency: "Monthly",
      deadline: "15th of each month",
      lastSubmitted: "2024-12-15",
      status: "submitted",
    },
    {
      id: 6,
      country: "South Africa",
      countryCode: "ZA",
      format: "EMP201 - Monthly Return",
      frequency: "Monthly",
      deadline: "7th of each month",
      lastSubmitted: null,
      status: "pending",
    },
  ];

  const filteredReports =
    selectedCountry === "all"
      ? reportFormats
      : reportFormats.filter((r) => r.countryCode === selectedCountry);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Government Reporting</h1>
        <p className="text-gray-600 mt-1">
          Integration with government reporting formats (RTI, Form 24Q, ECR, etc.)
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <div>
              <Label className="text-sm font-medium text-gray-700">Country</Label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Countries</option>
                <option value="GB">United Kingdom</option>
                <option value="IN">India</option>
                <option value="PK">Pakistan</option>
                <option value="ZA">South Africa</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Period</Label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="january-2025">January 2025</option>
              <option value="q4-2024">Q4 2024</option>
              <option value="fy-2024">FY 2024</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <h3 className="text-sm text-gray-600 mb-2">Submitted</h3>
          <p className="text-3xl font-bold text-green-600">
            {reportFormats.filter((r) => r.status === "submitted").length}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
          <h3 className="text-sm text-gray-600 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {reportFormats.filter((r) => r.status === "pending").length}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-sm text-gray-600 mb-2">Current</h3>
          <p className="text-3xl font-bold text-blue-600">
            {reportFormats.filter((r) => r.status === "current").length}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50">
          <h3 className="text-sm text-gray-600 mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-red-600">0</p>
        </Card>
      </div>

      {/* Report Formats */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Government Report Formats</h2>
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className={`p-4 ${
                report.status === "pending"
                  ? "bg-yellow-50 border-yellow-200"
                  : report.status === "submitted"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              } border-2`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.format}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {report.country} ({report.countryCode})
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-600">
                        Frequency: <span className="font-medium">{report.frequency}</span>
                      </span>
                      <span className="text-gray-600">
                        Deadline: <span className="font-medium">{report.deadline}</span>
                      </span>
                      {report.lastSubmitted && (
                        <span className="text-gray-600">
                          Last Submitted: <span className="font-medium">{report.lastSubmitted}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.status === "submitted"
                        ? "bg-green-100 text-green-700"
                        : report.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    {report.status === "pending" && (
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Send className="w-3 h-3 mr-1" />
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="bg-blue-600 text-white justify-start h-auto p-4">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">Generate RTI (UK)</span>
              </div>
              <p className="text-xs opacity-90">Real Time Information for HMRC</p>
            </div>
          </Button>

          <Button className="bg-green-600 text-white justify-start h-auto p-4">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">Generate Form 24Q (IN)</span>
              </div>
              <p className="text-xs opacity-90">TDS quarterly return</p>
            </div>
          </Button>

          <Button className="bg-purple-600 text-white justify-start h-auto p-4">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">Generate ECR (IN)</span>
              </div>
              <p className="text-xs opacity-90">PF monthly return</p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Info Note */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Automated Government Reporting</h3>
            <p className="text-sm text-gray-700">
              All reports are automatically generated in the required government format. The system
              validates data before submission and maintains a complete audit trail of all
              submissions.
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">Generate All Reports</Button>
        <Button className="bg-green-600 text-white">Submit All Pending</Button>
        <Button className="bg-gray-200 text-gray-700">View Submission History</Button>
      </div>
    </div>
  );
};

export default GovernmentReporting;

