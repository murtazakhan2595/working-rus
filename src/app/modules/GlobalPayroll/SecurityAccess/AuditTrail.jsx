import React, { useState } from "react";
import { FileText, User, Clock, Eye, Download, Search, Filter } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const AuditTrail = () => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedUser, setSelectedUser] = useState("all");

  const auditLogs = [
    {
      id: 1,
      timestamp: "2025-01-21 10:30:00",
      user: "John Doe",
      role: "Payroll Admin",
      action: "Processed Payroll",
      description: "Processed January 2025 payroll for 150 employees",
      module: "Payroll Processing",
      ipAddress: "192.168.1.100",
      status: "Success",
      details: "Payroll run completed successfully with total amount AED 2.1M",
    },
    {
      id: 2,
      timestamp: "2025-01-21 09:15:00",
      user: "Sarah Johnson",
      role: "Finance",
      action: "Approved Payroll",
      description: "Approved January 2025 payroll run",
      module: "Payroll Approval",
      ipAddress: "192.168.1.101",
      status: "Success",
      details: "Payroll approved for release to employees",
    },
    {
      id: 3,
      timestamp: "2025-01-21 08:45:00",
      user: "Mike Wilson",
      role: "HR",
      action: "Updated Employee Data",
      description: "Updated salary information for employee EMP001",
      module: "Employee Management",
      ipAddress: "192.168.1.102",
      status: "Success",
      details: "Employee salary updated from AED 15,000 to AED 18,000",
    },
    {
      id: 4,
      timestamp: "2025-01-21 07:30:00",
      user: "Ahmed Ali",
      role: "Compliance",
      action: "Generated Statutory Report",
      description: "Generated WPS SIF file for January 2025",
      module: "Compliance Reporting",
      ipAddress: "192.168.1.103",
      status: "Success",
      details: "WPS SIF file generated and submitted successfully",
    },
    {
      id: 5,
      timestamp: "2025-01-21 06:30:00",
      user: "Rajesh Kumar",
      role: "Employee",
      action: "Viewed Payslip",
      description: "Downloaded January 2025 payslip",
      module: "Employee Self Service",
      ipAddress: "192.168.1.104",
      status: "Success",
      details: "Payslip downloaded in PDF format",
    },
  ];

  const auditSummary = [
    {
      category: "Payroll Processing",
      count: 45,
      lastActivity: "2025-01-21 10:30:00",
      icon: FileText,
      color: "blue",
    },
    {
      category: "User Management",
      count: 23,
      lastActivity: "2025-01-21 09:15:00",
      icon: User,
      color: "green",
    },
    {
      category: "Data Access",
      count: 156,
      lastActivity: "2025-01-21 08:45:00",
      icon: Eye,
      color: "purple",
    },
    {
      category: "System Changes",
      count: 12,
      lastActivity: "2025-01-21 07:30:00",
      icon: Clock,
      color: "yellow",
    },
  ];

  const handleFilterAudit = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setIsFiltering(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      case "Warning":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Payroll Admin":
        return "bg-red-100 text-red-700";
      case "Finance":
        return "bg-green-100 text-green-700";
      case "HR":
        return "bg-blue-100 text-blue-700";
      case "Compliance":
        return "bg-purple-100 text-purple-700";
      case "Employee":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600 mt-1">
            Complete audit trail for every payroll transaction and system activity
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleFilterAudit}
            disabled={isFiltering}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isFiltering ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Filtering...
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                Apply Filters
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Audit Log
          </Button>
        </div>
      </div>

      {/* Filter Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="user" className="text-sm font-medium text-gray-700">
              User
            </Label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="john">John Doe</option>
              <option value="sarah">Sarah Johnson</option>
              <option value="mike">Mike Wilson</option>
              <option value="ahmed">Ahmed Ali</option>
            </select>
          </div>

          <div>
            <Label htmlFor="dateRange" className="text-sm font-medium text-gray-700">
              Date Range
            </Label>
            <input
              id="dateRange"
              type="date"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="action" className="text-sm font-medium text-gray-700">
              Action Type
            </Label>
            <select
              id="action"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="view">View</option>
              <option value="export">Export</option>
            </select>
          </div>

          <div>
            <Label htmlFor="module" className="text-sm font-medium text-gray-700">
              Module
            </Label>
            <select
              id="module"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Modules</option>
              <option value="payroll">Payroll Processing</option>
              <option value="employee">Employee Management</option>
              <option value="compliance">Compliance Reporting</option>
              <option value="reports">Reports & Analytics</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Audit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {auditSummary.map((summary, index) => (
          <Card key={index} className={`p-6 bg-${summary.color}-50 border-${summary.color}-200`}>
            <div className="flex items-center gap-3 mb-2">
              <summary.icon className={`w-6 h-6 text-${summary.color}-600`} />
              <h3 className="text-sm text-gray-600">{summary.category}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{summary.count}</p>
            <p className="text-sm text-gray-600 mt-1">Last: {summary.lastActivity}</p>
          </Card>
        ))}
      </div>

      {/* Audit Logs */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Module</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">IP Address</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-semibold">{log.user}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(log.role)}`}>
                          {log.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{log.action}</p>
                      <p className="text-xs text-gray-500">{log.description}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {log.module}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{log.ipAddress}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Logs</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">1,247</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">45</p>
          <p className="text-sm text-gray-600 mt-1">This week</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Failed Actions</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">12</p>
          <p className="text-sm text-gray-600 mt-1">Require attention</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Data Access</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">856</p>
          <p className="text-sm text-gray-600 mt-1">View operations</p>
        </Card>
      </div>

      {/* Audit Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Audit Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All payroll transactions must be logged</li>
              <li>• User actions tracked with timestamps</li>
              <li>• IP addresses recorded for security</li>
              <li>• Data changes tracked with before/after values</li>
              <li>• Audit logs retained for minimum 7 years</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Compliance Standards</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• SOX compliance for financial data</li>
              <li>• GDPR compliance for personal data</li>
              <li>• Industry-specific audit requirements</li>
              <li>• Regular audit log reviews</li>
              <li>• Secure storage and backup of logs</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Search className="w-4 h-4 mr-2" />
          Search Audit Logs
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Audit Report
        </Button>
        <Button className="bg-gray-200 text-gray-700">Configure Audit Settings</Button>
      </div>
    </div>
  );
};

export default AuditTrail;
