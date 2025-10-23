import React, { useState } from "react";
import { Shield, CheckCircle, XCircle, AlertTriangle, Clock, Eye, Download } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const ComplianceChecks = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);

  const complianceChecks = [
    {
      id: 1,
      name: "WPS Compliance Check",
      description: "Verify WPS SIF file compliance before payroll release",
      status: "Passed",
      lastRun: "2025-01-21 10:30:00",
      nextRun: "2025-01-22 10:30:00",
      frequency: "Daily",
      criticality: "High",
      checks: [
        "Employee data completeness",
        "Salary calculation accuracy",
        "Bank account validation",
        "WPS file format compliance",
      ],
    },
    {
      id: 2,
      name: "Tax Compliance Verification",
      description: "Ensure tax calculations comply with local regulations",
      status: "Passed",
      lastRun: "2025-01-21 09:15:00",
      nextRun: "2025-01-22 09:15:00",
      frequency: "Daily",
      criticality: "High",
      checks: [
        "Tax rate validation",
        "Tax bracket compliance",
        "Deduction calculations",
        "Tax filing requirements",
      ],
    },
    {
      id: 3,
      name: "PF Contribution Check",
      description: "Verify Provident Fund contribution calculations",
      status: "Warning",
      lastRun: "2025-01-21 08:45:00",
      nextRun: "2025-01-22 08:45:00",
      frequency: "Daily",
      criticality: "Medium",
      checks: [
        "PF contribution rates",
        "Employee eligibility",
        "Employer matching",
        "Statutory compliance",
      ],
    },
    {
      id: 4,
      name: "Data Integrity Check",
      description: "Validate payroll data integrity and consistency",
      status: "Passed",
      lastRun: "2025-01-21 07:30:00",
      nextRun: "2025-01-22 07:30:00",
      frequency: "Hourly",
      criticality: "High",
      checks: [
        "Data consistency validation",
        "Duplicate record detection",
        "Missing data identification",
        "Referential integrity",
      ],
    },
    {
      id: 5,
      name: "Security Compliance Check",
      description: "Verify security policies and access controls",
      status: "Failed",
      lastRun: "2025-01-21 06:30:00",
      nextRun: "2025-01-21 12:30:00",
      frequency: "Every 6 hours",
      criticality: "Critical",
      checks: [
        "User access validation",
        "Permission verification",
        "Security policy compliance",
        "Audit trail integrity",
      ],
    },
  ];

  const checkResults = [
    {
      checkId: 1,
      checkName: "WPS Compliance Check",
      result: "Passed",
      details: "All WPS compliance requirements met",
      issues: [],
      recommendations: ["Continue current process"],
      executionTime: "2.5s",
    },
    {
      checkId: 2,
      checkName: "Tax Compliance Verification",
      result: "Passed",
      details: "Tax calculations are compliant",
      issues: [],
      recommendations: ["Monitor for rate changes"],
      executionTime: "1.8s",
    },
    {
      checkId: 3,
      checkName: "PF Contribution Check",
      result: "Warning",
      details: "Minor discrepancies found in PF calculations",
      issues: ["2 employees have incorrect PF rates"],
      recommendations: ["Review PF rate assignments", "Update employee records"],
      executionTime: "3.2s",
    },
    {
      checkId: 4,
      checkName: "Data Integrity Check",
      result: "Passed",
      details: "Data integrity maintained",
      issues: [],
      recommendations: ["Continue monitoring"],
      executionTime: "4.1s",
    },
    {
      checkId: 5,
      checkName: "Security Compliance Check",
      result: "Failed",
      details: "Security compliance issues detected",
      issues: ["3 users have excessive permissions", "Audit trail gaps detected"],
      recommendations: ["Review user permissions", "Fix audit trail gaps", "Implement additional controls"],
      executionTime: "5.7s",
    },
  ];

  const handleRunChecks = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Passed":
        return "bg-green-100 text-green-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      case "Warning":
        return "bg-yellow-100 text-yellow-700";
      case "Running":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Checks</h1>
          <p className="text-gray-600 mt-1">
            Automated compliance checks before payroll release
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleRunChecks}
            disabled={isRunning}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running Checks...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Run All Checks
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Compliance Checks */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Checks</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Check Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Criticality</th>
                <th className="p-3 text-left">Frequency</th>
                <th className="p-3 text-left">Last Run</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complianceChecks.map((check) => (
                <tr key={check.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{check.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{check.description}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                      {check.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(check.criticality)}`}>
                      {check.criticality}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{check.frequency}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{check.lastRun}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setSelectedCheck(check)}
                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Run
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Check Details */}
      {selectedCheck && (
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Check Details: {selectedCheck.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Check Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">{selectedCheck.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-semibold">{selectedCheck.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCheck.status)}`}>
                    {selectedCheck.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Criticality:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(selectedCheck.criticality)}`}>
                    {selectedCheck.criticality}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold">{selectedCheck.frequency}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Check Items</h3>
              <div className="space-y-1">
                {selectedCheck.checks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button className="bg-blue-600 text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Run This Check
            </Button>
            <Button onClick={() => setSelectedCheck(null)} className="bg-gray-200 text-gray-700">
              Close Details
            </Button>
          </div>
        </Card>
      )}

      {/* Check Results */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Check Results</h2>
        <div className="space-y-4">
          {checkResults.map((result) => (
            <div key={result.checkId} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{result.checkName}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.result)}`}>
                    {result.result}
                  </span>
                  <span className="text-sm text-gray-600">Executed in {result.executionTime}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{result.details}</p>
              {result.issues.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-semibold text-red-700 text-sm mb-1">Issues Found:</h4>
                  <ul className="text-sm text-red-600 list-disc list-inside">
                    {result.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-green-700 text-sm mb-1">Recommendations:</h4>
                <ul className="text-sm text-green-600 list-disc list-inside">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
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
            <h3 className="text-sm text-gray-600">Total Checks</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-sm text-gray-600 mt-1">Active checks</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Passed</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">3</p>
          <p className="text-sm text-gray-600 mt-1">60% success rate</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Warnings</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">1</p>
          <p className="text-sm text-gray-600 mt-1">Require attention</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Failed</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">1</p>
          <p className="text-sm text-gray-600 mt-1">Critical issues</p>
        </Card>
      </div>

      {/* Compliance Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pre-Release Checks</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All compliance checks must pass before payroll release</li>
              <li>• Critical checks cannot be bypassed</li>
              <li>• Failed checks require immediate resolution</li>
              <li>• Warning checks need review and approval</li>
              <li>• Compliance reports must be generated</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Compliance Standards</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• WPS compliance for UAE operations</li>
              <li>• Tax compliance for all jurisdictions</li>
              <li>• PF compliance for applicable countries</li>
              <li>• Data integrity and security standards</li>
              <li>• Audit trail and documentation requirements</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Shield className="w-4 h-4 mr-2" />
          Run All Compliance Checks
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Compliance Report
        </Button>
        <Button className="bg-gray-200 text-gray-700">Configure Check Settings</Button>
      </div>
    </div>
  );
};

export default ComplianceChecks;
