import React, { useState } from "react";
import { Shield, DollarSign, Calendar, FileText, Download, Eye, AlertTriangle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const StatutoryReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01");

  const statutoryReports = [
    {
      id: 1,
      reportType: "WPS SIF File",
      country: "UAE",
      period: "January 2025",
      status: "Generated",
      generatedAt: "2025-01-21 10:30:00",
      totalAmount: 1250000,
      employeeCount: 75,
      currency: "AED",
      deadline: "2025-01-25",
      submittedAt: "2025-01-22 14:30:00",
      compliance: "Compliant",
    },
    {
      id: 2,
      reportType: "PAYE Tax Return",
      country: "UK",
      period: "January 2025",
      status: "Pending",
      generatedAt: null,
      totalAmount: 75000,
      employeeCount: 25,
      currency: "GBP",
      deadline: "2025-01-31",
      submittedAt: null,
      compliance: "Pending",
    },
    {
      id: 3,
      reportType: "PF Contribution",
      country: "India",
      period: "January 2025",
      status: "Generated",
      generatedAt: "2025-01-20 16:45:00",
      totalAmount: 1750000,
      employeeCount: 35,
      currency: "INR",
      deadline: "2025-02-15",
      submittedAt: "2025-01-21 09:15:00",
      compliance: "Compliant",
    },
    {
      id: 4,
      reportType: "Social Security",
      country: "Pakistan",
      period: "January 2025",
      status: "Overdue",
      generatedAt: "2025-01-18 11:20:00",
      totalAmount: 450000,
      employeeCount: 15,
      currency: "PKR",
      deadline: "2025-01-20",
      submittedAt: null,
      compliance: "Non-Compliant",
    },
  ];

  const reportTypes = [
    {
      type: "WPS SIF File",
      description: "UAE Wage Protection System file",
      icon: FileText,
      color: "blue",
      frequency: "Monthly",
      deadline: "15th of following month",
    },
    {
      type: "PAYE Tax Return",
      description: "UK Pay As You Earn tax return",
      icon: Shield,
      color: "green",
      frequency: "Monthly",
      deadline: "End of following month",
    },
    {
      type: "PF Contribution",
      description: "India Provident Fund contributions",
      icon: DollarSign,
      color: "purple",
      frequency: "Monthly",
      deadline: "15th of following month",
    },
    {
      type: "Social Security",
      description: "Pakistan Social Security payments",
      icon: AlertTriangle,
      color: "yellow",
      frequency: "Monthly",
      deadline: "20th of following month",
    },
  ];

  const complianceSummary = [
    {
      country: "UAE",
      totalReports: 12,
      compliant: 11,
      nonCompliant: 1,
      complianceRate: 91.7,
      lastSubmission: "2025-01-22",
    },
    {
      country: "UK",
      totalReports: 12,
      compliant: 10,
      nonCompliant: 2,
      complianceRate: 83.3,
      lastSubmission: "2025-01-15",
    },
    {
      country: "India",
      totalReports: 12,
      compliant: 12,
      nonCompliant: 0,
      complianceRate: 100,
      lastSubmission: "2025-01-21",
    },
    {
      country: "Pakistan",
      totalReports: 12,
      compliant: 9,
      nonCompliant: 3,
      complianceRate: 75,
      lastSubmission: "2025-01-18",
    },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Generated":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case "Compliant":
        return "bg-green-100 text-green-700";
      case "Non-Compliant":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getComplianceRateColor = (rate) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 85) return "text-yellow-600";
    if (rate >= 75) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statutory Contributions & Tax Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate and manage statutory reports for compliance across all countries
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Generate Reports
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Bulk Export
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country
            </Label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              <option value="UAE">UAE</option>
              <option value="UK">UK</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
            </select>
          </div>

          <div>
            <Label htmlFor="period" className="text-sm font-medium text-gray-700">
              Period
            </Label>
            <input
              id="period"
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="reportType" className="text-sm font-medium text-gray-700">
              Report Type
            </Label>
            <select
              id="reportType"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Report Types</option>
              <option value="WPS">WPS SIF File</option>
              <option value="PAYE">PAYE Tax Return</option>
              <option value="PF">PF Contribution</option>
              <option value="SS">Social Security</option>
            </select>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </Label>
            <select
              id="status"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="generated">Generated</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportTypes.map((report, index) => (
          <Card key={index} className={`p-6 bg-${report.color}-50 border-${report.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <report.icon className={`w-6 h-6 text-${report.color}-600`} />
              <h3 className="font-semibold text-gray-900">{report.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{report.description}</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Frequency: {report.frequency}</p>
              <p>Deadline: {report.deadline}</p>
            </div>
            <Button className="w-full mt-3 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
              Generate Report
            </Button>
          </Card>
        ))}
      </div>

      {/* Statutory Reports */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statutory Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Report Type</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Period</th>
                <th className="p-3 text-left">Total Amount</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Deadline</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Compliance</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {statutoryReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{report.reportType}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{report.country}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold">{report.period}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{report.totalAmount.toLocaleString()} {report.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{report.employeeCount}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-semibold">{report.deadline}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(report.compliance)}`}>
                      {report.compliance}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Compliance Summary */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Country-wise Compliance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceSummary.map((summary, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{summary.country}</h3>
                </div>
                <span className={`text-lg font-bold ${getComplianceRateColor(summary.complianceRate)}`}>
                  {summary.complianceRate}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Reports:</span>
                  <span className="font-semibold">{summary.totalReports}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Compliant:</span>
                  <span className="font-semibold text-green-600">{summary.compliant}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Non-Compliant:</span>
                  <span className="font-semibold text-red-600">{summary.nonCompliant}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Submission:</span>
                  <span className="font-semibold">{summary.lastSubmission}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      summary.complianceRate >= 95 ? 'bg-green-500' :
                      summary.complianceRate >= 85 ? 'bg-yellow-500' :
                      summary.complianceRate >= 75 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${summary.complianceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Reports</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">48</p>
          <p className="text-sm text-gray-600 mt-1">This year</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Compliant</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">42</p>
          <p className="text-sm text-gray-600 mt-1">87.5% compliance rate</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">4</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting submission</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Overdue</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">2</p>
          <p className="text-sm text-gray-600 mt-1">Require immediate attention</p>
        </Card>
      </div>

      {/* Compliance Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Report Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• WPS SIF files must be submitted by 15th of following month</li>
              <li>• PAYE tax returns due by end of following month</li>
              <li>• PF contributions must be submitted by 15th of following month</li>
              <li>• Social security payments due by 20th of following month</li>
              <li>• Late submissions incur penalties and fines</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Generate reports 3-5 days before deadline</li>
              <li>• Review all data for accuracy before submission</li>
              <li>• Maintain backup copies of all submissions</li>
              <li>• Set up automated reminders for deadlines</li>
              <li>• Regular compliance audits and reviews</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Shield className="w-4 h-4 mr-2" />
          Generate All Reports
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Bulk Export Reports
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Compliance History</Button>
      </div>
    </div>
  );
};

export default StatutoryReports;
