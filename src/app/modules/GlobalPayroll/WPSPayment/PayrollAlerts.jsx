import React, { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Clock, Users, Shield } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const PayrollAlerts = () => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const alerts = [
    {
      id: 1,
      type: "Mismatch",
      severity: "High",
      title: "Salary Mismatch Detected",
      description: "Employee ID EMP001 has salary mismatch between HR and Payroll systems",
      employeeId: "EMP001",
      employeeName: "John Doe",
      expectedAmount: 5000,
      actualAmount: 4500,
      difference: 500,
      currency: "AED",
      detectedAt: "2025-01-21 10:30:00",
      status: "Open",
      assignedTo: "Sarah Johnson",
    },
    {
      id: 2,
      type: "Incomplete",
      severity: "Medium",
      title: "Missing Bank Details",
      description: "3 employees have incomplete bank account information",
      employeeCount: 3,
      affectedEmployees: ["EMP045", "EMP067", "EMP089"],
      detectedAt: "2025-01-21 09:15:00",
      status: "In Progress",
      assignedTo: "Mike Wilson",
    },
    {
      id: 3,
      type: "Validation",
      severity: "Low",
      title: "Tax Calculation Warning",
      description: "Tax calculation for UK employees may need review",
      country: "UK",
      employeeCount: 15,
      detectedAt: "2025-01-21 08:45:00",
      status: "Resolved",
      assignedTo: "Emma Brown",
    },
    {
      id: 4,
      type: "System",
      severity: "High",
      title: "Bank File Upload Failed",
      description: "Failed to upload WPS SIF file to ADCB bank portal",
      bankName: "ADCB",
      fileName: "WPS_SIF_20250121_001.sif",
      errorCode: "UPLOAD_001",
      detectedAt: "2025-01-21 11:20:00",
      status: "Open",
      assignedTo: "David Lee",
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Mismatch":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "Incomplete":
        return <Users className="w-5 h-5 text-yellow-600" />;
      case "Validation":
        return <Shield className="w-5 h-5 text-blue-600" />;
      case "System":
        return <Bell className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Alerts & Notifications</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage payroll alerts for mismatches and incomplete data
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <Bell className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Alert Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Enable Alerts</Label>
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            </div>
            <p className="text-xs text-gray-600">
              Receive notifications for payroll issues
            </p>
          </div>

          <div>
            <Label htmlFor="mismatchThreshold" className="text-sm font-medium text-gray-700">
              Mismatch Threshold (AED)
            </Label>
            <input
              id="mismatchThreshold"
              type="number"
              placeholder="100"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Alert if difference exceeds this amount</p>
          </div>

          <div>
            <Label htmlFor="notificationMethod" className="text-sm font-medium text-gray-700">
              Notification Method
            </Label>
            <select
              id="notificationMethod"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="both">Email + SMS</option>
              <option value="dashboard">Dashboard Only</option>
            </select>
          </div>

          <div>
            <Label htmlFor="alertFrequency" className="text-sm font-medium text-gray-700">
              Alert Frequency
            </Label>
            <select
              id="alertFrequency"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">High Severity</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">2</p>
          <p className="text-sm text-gray-600 mt-1">Critical issues</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Medium Severity</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">1</p>
          <p className="text-sm text-gray-600 mt-1">Warning issues</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Resolved</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">1</p>
          <p className="text-sm text-gray-600 mt-1">Fixed issues</p>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Alerts</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">4</p>
          <p className="text-sm text-gray-600 mt-1">All alerts</p>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getTypeIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Detected: {alert.detectedAt}</span>
                      <span>Assigned to: {alert.assignedTo}</span>
                      {alert.employeeId && <span>Employee: {alert.employeeId}</span>}
                      {alert.difference && (
                        <span className="text-red-600 font-semibold">
                          Difference: {alert.currency} {alert.difference}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                    View Details
                  </Button>
                  {alert.status === "Open" && (
                    <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alert Types */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Types & Triggers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Mismatch Alerts</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Salary differences between systems</li>
              <li>• Bank account mismatches</li>
              <li>• Tax calculation discrepancies</li>
              <li>• Employee data inconsistencies</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Incomplete Data Alerts</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Missing bank account details</li>
              <li>• Incomplete employee information</li>
              <li>• Missing tax identification numbers</li>
              <li>• Incomplete address information</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Bell className="w-4 h-4 mr-2" />
          Configure Alert Rules
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Resolve All Alerts
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Alert History</Button>
      </div>
    </div>
  );
};

export default PayrollAlerts;
