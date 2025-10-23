import React, { useState } from "react";
import { AlertTriangle, TrendingUp, Clock, Users, DollarSign, CheckCircle, Eye } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const AnomalyDetection = () => {
  const [isScanning, setIsScanning] = useState(false);

  const anomalies = [
    {
      id: 1,
      type: "Overtime Spike",
      severity: "High",
      employeeId: "EMP001",
      employeeName: "John Doe",
      description: "Overtime hours increased by 150% compared to last month",
      currentValue: 45,
      expectedValue: 18,
      deviation: "+150%",
      detectedAt: "2025-01-21 10:30:00",
      status: "Pending Review",
      impact: "High",
      recommendation: "Review workload distribution and consider additional resources",
    },
    {
      id: 2,
      type: "Missing Timesheet",
      severity: "Medium",
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      description: "Timesheet not submitted for 3 consecutive days",
      currentValue: 0,
      expectedValue: 24,
      deviation: "-100%",
      detectedAt: "2025-01-21 09:15:00",
      status: "Under Investigation",
      impact: "Medium",
      recommendation: "Contact employee and HR for immediate resolution",
    },
    {
      id: 3,
      type: "Salary Anomaly",
      severity: "Critical",
      employeeId: "EMP003",
      employeeName: "Ahmed Ali",
      description: "Salary calculation shows unusual deduction pattern",
      currentValue: 120000,
      expectedValue: 150000,
      deviation: "-20%",
      detectedAt: "2025-01-21 08:45:00",
      status: "Resolved",
      impact: "Critical",
      recommendation: "Immediate payroll correction required",
    },
    {
      id: 4,
      type: "Attendance Pattern",
      severity: "Low",
      employeeId: "EMP004",
      employeeName: "Rajesh Kumar",
      description: "Unusual late arrival pattern detected",
      currentValue: 8,
      expectedValue: 2,
      deviation: "+300%",
      detectedAt: "2025-01-21 07:30:00",
      status: "Monitoring",
      impact: "Low",
      recommendation: "Monitor pattern and consider flexible hours",
    },
  ];

  const anomalyTypes = [
    {
      type: "Overtime Spike",
      description: "Detects unusual overtime patterns",
      icon: Clock,
      color: "red",
      count: 12,
      threshold: ">50% increase",
    },
    {
      type: "Missing Timesheet",
      description: "Identifies missing or incomplete timesheets",
      icon: AlertTriangle,
      color: "yellow",
      count: 8,
      threshold: ">2 days missing",
    },
    {
      type: "Salary Anomaly",
      description: "Detects unusual salary calculations",
      icon: DollarSign,
      color: "purple",
      count: 5,
      threshold: ">15% deviation",
    },
    {
      type: "Attendance Pattern",
      description: "Identifies unusual attendance patterns",
      icon: Users,
      color: "blue",
      count: 15,
      threshold: "Pattern analysis",
    },
  ];

  const handleScanAnomalies = () => {
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
      case "Pending Review":
        return "bg-yellow-100 text-yellow-700";
      case "Under Investigation":
        return "bg-blue-100 text-blue-700";
      case "Monitoring":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
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
          <h1 className="text-2xl font-bold text-gray-900">AI-Based Payroll Anomaly Detection</h1>
          <p className="text-gray-600 mt-1">
            Detect overtime spikes, missing timesheets, and other payroll anomalies using AI
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleScanAnomalies}
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
                <AlertTriangle className="w-4 h-4" />
                Scan for Anomalies
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolve Selected
          </Button>
        </div>
      </div>

      {/* AI Detection Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Detection Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="sensitivity" className="text-sm font-medium text-gray-700">
              Detection Sensitivity
            </Label>
            <select
              id="sensitivity"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low (Major anomalies only)</option>
              <option value="medium">Medium (Standard detection)</option>
              <option value="high">High (All anomalies)</option>
              <option value="custom">Custom Thresholds</option>
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
              <option value="realtime">Real-time</option>
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <Label htmlFor="alertMethod" className="text-sm font-medium text-gray-700">
              Alert Method
            </Label>
            <select
              id="alertMethod"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="dashboard">Dashboard Only</option>
              <option value="all">All Methods</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Auto-Resolve</Label>
              <Switch />
            </div>
            <p className="text-xs text-gray-600">
              Automatically resolve low-risk anomalies
            </p>
          </div>
        </div>
      </Card>

      {/* Anomaly Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {anomalyTypes.map((anomaly, index) => (
          <Card key={index} className={`p-6 bg-${anomaly.color}-50 border-${anomaly.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <anomaly.icon className={`w-6 h-6 text-${anomaly.color}-600`} />
              <h3 className="font-semibold text-gray-900">{anomaly.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{anomaly.description}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-gray-900">{anomaly.count}</span>
              <span className="text-sm text-gray-600">This month</span>
            </div>
            <p className="text-xs text-gray-500">Threshold: {anomaly.threshold}</p>
          </Card>
        ))}
      </div>

      {/* Detected Anomalies */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detected Anomalies</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Deviation</th>
                <th className="p-3 text-left">Severity</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Impact</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((anomaly) => (
                <tr key={anomaly.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{anomaly.type}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{anomaly.employeeName}</p>
                      <p className="text-xs text-gray-500">{anomaly.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600 max-w-xs">
                    <p className="truncate">{anomaly.description}</p>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${
                      anomaly.deviation.startsWith('+') ? 'text-red-600' : 
                      anomaly.deviation.startsWith('-') ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {anomaly.deviation}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(anomaly.status)}`}>
                      {anomaly.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(anomaly.impact)}`}>
                      {anomaly.impact}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {anomaly.status !== "Resolved" && (
                        <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pattern Analysis</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Overtime spikes typically occur on Mondays and Fridays</li>
              <li>• Missing timesheets are 40% higher during month-end</li>
              <li>• Salary anomalies often correlate with new employee onboarding</li>
              <li>• Attendance patterns show seasonal variations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Predictive Recommendations</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Implement automated timesheet reminders</li>
              <li>• Consider flexible work arrangements for high overtime employees</li>
              <li>• Enhance new employee payroll verification process</li>
              <li>• Set up proactive compliance monitoring</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Anomaly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Anomalies</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">40</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Resolved</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">32</p>
          <p className="text-sm text-gray-600 mt-1">80% resolution rate</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">8</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Accuracy</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">94%</p>
          <p className="text-sm text-gray-600 mt-1">AI detection accuracy</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Run Full Scan
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Resolve All Low Risk
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Detection History</Button>
      </div>
    </div>
  );
};

export default AnomalyDetection;
