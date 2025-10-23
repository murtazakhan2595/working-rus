import React, { useState } from "react";
import { FileText, Download, Calendar, Shield, TrendingUp, Users, CheckCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const YearEndStatements = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [isGenerating, setIsGenerating] = useState(false);

  const yearEndStatements = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      year: "2024",
      totalEarnings: 180000,
      totalTax: 18000,
      totalPF: 21600,
      totalContributions: 5400,
      currency: "AED",
      status: "Generated",
      generatedAt: "2025-01-15 10:30:00",
      documents: [
        { type: "Tax Statement", size: "245 KB", status: "Ready" },
        { type: "PF Statement", size: "189 KB", status: "Ready" },
        { type: "Contribution Summary", size: "156 KB", status: "Ready" },
      ],
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      year: "2024",
      totalEarnings: 36000,
      totalTax: 7200,
      totalPF: 4320,
      totalContributions: 1080,
      currency: "GBP",
      status: "Generated",
      generatedAt: "2025-01-15 10:32:00",
      documents: [
        { type: "Tax Statement", size: "198 KB", status: "Ready" },
        { type: "PF Statement", size: "167 KB", status: "Ready" },
        { type: "Contribution Summary", size: "134 KB", status: "Ready" },
      ],
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Ahmed Ali",
      year: "2024",
      totalEarnings: 1800000,
      totalTax: 180000,
      totalPF: 216000,
      totalContributions: 54000,
      currency: "PKR",
      status: "Generating",
      generatedAt: "2025-01-15 10:35:00",
      documents: [
        { type: "Tax Statement", size: "0 KB", status: "Processing" },
        { type: "PF Statement", size: "0 KB", status: "Processing" },
        { type: "Contribution Summary", size: "0 KB", status: "Processing" },
      ],
    },
  ];

  const statementTypes = [
    {
      type: "Tax Statement",
      description: "Annual tax summary and calculations",
      icon: Shield,
      color: "blue",
    },
    {
      type: "PF Statement",
      description: "Provident Fund contributions and balance",
      icon: TrendingUp,
      color: "green",
    },
    {
      type: "Contribution Summary",
      description: "All statutory contributions breakdown",
      icon: Users,
      color: "purple",
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Generated":
        return "bg-green-100 text-green-700";
      case "Generating":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Year-End Statements</h1>
          <p className="text-gray-600 mt-1">
            Generate tax, PF, and contribution statements for employees
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
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
                <FileText className="w-4 h-4" />
                Generate Statements
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Bulk Download
          </Button>
        </div>
      </div>

      {/* Year Selection */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statement Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="year" className="text-sm font-medium text-gray-700">
              Tax Year
            </Label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <Label htmlFor="statementType" className="text-sm font-medium text-gray-700">
              Statement Type
            </Label>
            <select
              id="statementType"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statements</option>
              <option value="tax">Tax Statement Only</option>
              <option value="pf">PF Statement Only</option>
              <option value="contributions">Contributions Only</option>
            </select>
          </div>

          <div>
            <Label htmlFor="format" className="text-sm font-medium text-gray-700">
              Format
            </Label>
            <select
              id="format"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button className="w-full bg-gray-200 text-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Generate All
            </Button>
          </div>
        </div>
      </Card>

      {/* Statement Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statementTypes.map((statement, index) => (
          <Card key={index} className={`p-6 bg-${statement.color}-50 border-${statement.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <statement.icon className={`w-6 h-6 text-${statement.color}-600`} />
              <h3 className="font-semibold text-gray-900">{statement.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{statement.description}</p>
            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700">
                Generate
              </Button>
              <Button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700">
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Statements</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">450</p>
          <p className="text-sm text-gray-600 mt-1">Generated for {selectedYear}</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">420</p>
          <p className="text-sm text-gray-600 mt-1">Ready for download</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Processing</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">30</p>
          <p className="text-sm text-gray-600 mt-1">In progress</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Employees</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">150</p>
          <p className="text-sm text-gray-600 mt-1">Total employees</p>
        </Card>
      </div>

      {/* Year-End Statements */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Year-End Statements ({selectedYear})</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Total Earnings</th>
                <th className="p-3 text-left">Tax Paid</th>
                <th className="p-3 text-left">PF Contributions</th>
                <th className="p-3 text-left">Other Contributions</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Documents</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {yearEndStatements.map((statement) => (
                <tr key={statement.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{statement.employeeName}</p>
                      <p className="text-xs text-gray-500">{statement.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-green-600">
                      {statement.totalEarnings.toLocaleString()} {statement.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-red-600">
                      {statement.totalTax.toLocaleString()} {statement.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-blue-600">
                      {statement.totalPF.toLocaleString()} {statement.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-purple-600">
                      {statement.totalContributions.toLocaleString()} {statement.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(statement.status)}`}>
                      {statement.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      {statement.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{doc.type}</span>
                          <span className={`px-1 py-0.5 rounded text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
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

      {/* Compliance Information */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tax Statement Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Annual gross salary breakdown</li>
              <li>• Tax deductions and exemptions</li>
              <li>• Net taxable income</li>
              <li>• Tax paid during the year</li>
              <li>• Refund or additional tax due</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">PF Statement Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Monthly PF contributions</li>
              <li>• Employer contributions</li>
              <li>• Interest earned</li>
              <li>• Total PF balance</li>
              <li>• Withdrawal history</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate All Statements
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Bulk Download
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Compliance Report</Button>
      </div>
    </div>
  );
};

export default YearEndStatements;
