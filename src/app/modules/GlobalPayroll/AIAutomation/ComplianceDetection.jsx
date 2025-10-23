import React, { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Clock, Users, FileText } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const ComplianceDetection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("all");

  const complianceGaps = [
    {
      id: 1,
      country: "UAE",
      complianceType: "PF Registration",
      gap: "Missing PF registration for 5 employees",
      severity: "Critical",
      affectedEmployees: 5,
      deadline: "2025-02-15",
      status: "Open",
      detectedAt: "2025-01-21 10:30:00",
      actionRequired: "Register employees with PF authority immediately",
      penalty: "AED 5,000 per employee",
    },
    {
      id: 2,
      country: "UK",
      complianceType: "PAYE Registration",
      gap: "Incomplete PAYE registration documentation",
      severity: "High",
      affectedEmployees: 12,
      deadline: "2025-01-31",
      status: "In Progress",
      detectedAt: "2025-01-21 09:15:00",
      actionRequired: "Complete PAYE registration forms",
      penalty: "GBP 500 per month delay",
    },
    {
      id: 3,
      country: "India",
      complianceType: "ESI Registration",
      gap: "ESI contribution not calculated for new employees",
      severity: "Medium",
      affectedEmployees: 8,
      deadline: "2025-02-10",
      status: "Open",
      detectedAt: "2025-01-21 08:45:00",
      actionRequired: "Calculate and submit ESI contributions",
      penalty: "INR 10,000 per employee",
    },
    {
      id: 4,
      country: "Pakistan",
      complianceType: "Social Security",
      gap: "Social security registration missing for contract workers",
      severity: "High",
      affectedEmployees: 15,
      deadline: "2025-02-05",
      status: "Resolved",
      detectedAt: "2025-01-20 16:30:00",
      actionRequired: "Register contract workers with social security",
      penalty: "PKR 25,000 per employee",
    },
  ];

  const complianceTypes = [
    {
      type: "PF Registration",
      description: "Provident Fund registration compliance",
      icon: Shield,
      color: "blue",
      countries: ["UAE", "India", "Pakistan"],
      count: 8,
    },
    {
      type: "Tax Registration",
      description: "Tax authority registration requirements",
      icon: FileText,
      color: "green",
      countries: ["UK", "UAE", "India"],
      count: 12,
    },
    {
      type: "Social Security",
      description: "Social security compliance",
      icon: Users,
      color: "purple",
      countries: ["Pakistan", "India", "UK"],
      count: 15,
    },
    {
      type: "Labor Law",
      description: "Labor law compliance requirements",
      icon: CheckCircle,
      color: "yellow",
      countries: ["All Countries"],
      count: 20,
    },
  ];

  const complianceStatus = [
    {
      country: "UAE",
      totalRequirements: 15,
      compliant: 12,
      nonCompliant: 3,
      complianceRate: 80,
      lastAudit: "2025-01-15",
    },
    {
      country: "UK",
      totalRequirements: 18,
      compliant: 16,
      nonCompliant: 2,
      complianceRate: 89,
      lastAudit: "2025-01-10",
    },
    {
      country: "India",
      totalRequirements: 22,
      compliant: 18,
      nonCompliant: 4,
      complianceRate: 82,
      lastAudit: "2025-01-12",
    },
    {
      country: "Pakistan",
      totalRequirements: 20,
      compliant: 17,
      nonCompliant: 3,
      complianceRate: 85,
      lastAudit: "2025-01-08",
    },
  ];

  const handleScanCompliance = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Open":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Monitoring":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getComplianceRateColor = (rate) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    if (rate >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auto-Detection of Compliance Gaps</h1>
          <p className="text-gray-600 mt-1">
            AI-powered detection of missing PF registration and other compliance requirements
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleScanCompliance}
            disabled={isScanning}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Scan Compliance
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolve All Critical
          </Button>
        </div>
      </div>

      {/* Compliance Scan Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Scan Configuration</h2>
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
            <Label htmlFor="complianceType" className="text-sm font-medium text-gray-700">
              Compliance Type
            </Label>
            <select
              id="complianceType"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="pf">PF Registration</option>
              <option value="tax">Tax Registration</option>
              <option value="social">Social Security</option>
              <option value="labor">Labor Law</option>
            </select>
          </div>

          <div>
            <Label htmlFor="severity" className="text-sm font-medium text-gray-700">
              Severity Filter
            </Label>
            <select
              id="severity"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High & Critical</option>
              <option value="medium">Medium & Above</option>
            </select>
          </div>

          <div>
            <Label htmlFor="scanFrequency" className="text-sm font-medium text-gray-700">
              Scan Frequency
            </Label>
            <select
              id="scanFrequency"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="manual">Manual Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Compliance Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {complianceTypes.map((compliance, index) => (
          <Card key={index} className={`p-6 bg-${compliance.color}-50 border-${compliance.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <compliance.icon className={`w-6 h-6 text-${compliance.color}-600`} />
              <h3 className="font-semibold text-gray-900">{compliance.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{compliance.description}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-gray-900">{compliance.count}</span>
              <span className="text-sm text-gray-600">Gaps found</span>
            </div>
            <p className="text-xs text-gray-500">Countries: {compliance.countries.join(", ")}</p>
          </Card>
        ))}
      </div>

      {/* Compliance Gaps */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detected Compliance Gaps</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Compliance Type</th>
                <th className="p-3 text-left">Gap Description</th>
                <th className="p-3 text-left">Affected Employees</th>
                <th className="p-3 text-left">Severity</th>
                <th className="p-3 text-left">Deadline</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complianceGaps.map((gap) => (
                <tr key={gap.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{gap.country}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {gap.complianceType}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600 max-w-xs">
                    <p className="truncate">{gap.gap}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{gap.affectedEmployees}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                      {gap.severity}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-semibold">{gap.deadline}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gap.status)}`}>
                      {gap.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {gap.status !== "Resolved" && (
                        <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        View Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Country-wise Compliance Status */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Country-wise Compliance Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceStatus.map((status, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{status.country}</h3>
                <span className={`text-lg font-bold ${getComplianceRateColor(status.complianceRate)}`}>
                  {status.complianceRate}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Requirements:</span>
                  <span className="font-semibold">{status.totalRequirements}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Compliant:</span>
                  <span className="font-semibold text-green-600">{status.compliant}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Non-Compliant:</span>
                  <span className="font-semibold text-red-600">{status.nonCompliant}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Audit:</span>
                  <span className="font-semibold">{status.lastAudit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      status.complianceRate >= 90 ? 'bg-green-500' :
                      status.complianceRate >= 80 ? 'bg-yellow-500' :
                      status.complianceRate >= 70 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${status.complianceRate}%` }}
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
            <h3 className="text-sm text-gray-600">Total Gaps</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">55</p>
          <p className="text-sm text-gray-600 mt-1">Detected this month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Resolved</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">42</p>
          <p className="text-sm text-gray-600 mt-1">76% resolution rate</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Critical</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">8</p>
          <p className="text-sm text-gray-600 mt-1">Urgent attention</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Deadlines</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">12</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>
      </div>

      {/* Compliance Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Critical Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• PF registration within 30 days of employment</li>
              <li>• Tax registration before first payroll</li>
              <li>• Social security compliance for all employees</li>
              <li>• Labor law compliance documentation</li>
              <li>• Regular compliance audits and updates</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Penalty Prevention</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Automated deadline tracking and alerts</li>
              <li>• Proactive compliance monitoring</li>
              <li>• Regular compliance training for HR team</li>
              <li>• Documentation and record keeping</li>
              <li>• Legal consultation for complex cases</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Shield className="w-4 h-4 mr-2" />
          Run Full Compliance Scan
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Resolve All Critical Gaps
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Compliance History</Button>
      </div>
    </div>
  );
};

export default ComplianceDetection;
