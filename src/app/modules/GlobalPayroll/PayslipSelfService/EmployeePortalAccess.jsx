import React, { useState } from "react";
import { Shield, Eye, Lock, Users, Clock, CheckCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const EmployeePortalAccess = () => {
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [isGeneratingAccess, setIsGeneratingAccess] = useState(false);

  const portalUsers = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      email: "john.doe@company.com",
      lastLogin: "2025-01-21 09:30:00",
      accessLevel: "Full",
      status: "Active",
      payslipsAccessed: 12,
      securityScore: 95,
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      lastLogin: "2025-01-20 16:45:00",
      accessLevel: "Full",
      status: "Active",
      payslipsAccessed: 8,
      securityScore: 88,
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Ahmed Ali",
      email: "ahmed.ali@company.com",
      lastLogin: "Never",
      accessLevel: "Limited",
      status: "Pending",
      payslipsAccessed: 0,
      securityScore: 0,
    },
    {
      id: 4,
      employeeId: "EMP004",
      employeeName: "Rajesh Kumar",
      email: "rajesh.kumar@company.com",
      lastLogin: "2025-01-19 14:20:00",
      accessLevel: "Full",
      status: "Suspended",
      payslipsAccessed: 15,
      securityScore: 45,
    },
  ];

  const securityFeatures = [
    {
      name: "Two-Factor Authentication",
      enabled: true,
      description: "SMS/Email verification for login",
    },
    {
      name: "Password Policy",
      enabled: true,
      description: "Strong password requirements",
    },
    {
      name: "Session Timeout",
      enabled: true,
      description: "Auto-logout after 30 minutes",
    },
    {
      name: "IP Restrictions",
      enabled: false,
      description: "Limit access to specific IP ranges",
    },
    {
      name: "Audit Logging",
      enabled: true,
      description: "Track all portal activities",
    },
  ];

  const handleGenerateAccess = () => {
    setIsGeneratingAccess(true);
    setTimeout(() => setIsGeneratingAccess(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case "Full":
        return "bg-blue-100 text-blue-700";
      case "Limited":
        return "bg-yellow-100 text-yellow-700";
      case "Restricted":
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
          <h1 className="text-2xl font-bold text-gray-900">Employee Portal Access</h1>
          <p className="text-gray-600 mt-1">
            Secure employee portal access to payslips and payroll information
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateAccess}
            disabled={isGeneratingAccess}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isGeneratingAccess ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Generate Access
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Users className="w-4 h-4 mr-2" />
            Bulk Enable
          </Button>
        </div>
      </div>

      {/* Portal Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Portal Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Portal Enabled</Label>
              <Switch checked={portalEnabled} onCheckedChange={setPortalEnabled} />
            </div>
            <p className="text-xs text-gray-600">
              Allow employees to access their payslips
            </p>
          </div>

          <div>
            <Label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700">
              Session Timeout (minutes)
            </Label>
            <input
              id="sessionTimeout"
              type="number"
              placeholder="30"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="maxLoginAttempts" className="text-sm font-medium text-gray-700">
              Max Login Attempts
            </Label>
            <input
              id="maxLoginAttempts"
              type="number"
              placeholder="5"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="accessLevel" className="text-sm font-medium text-gray-700">
              Default Access Level
            </Label>
            <select
              id="accessLevel"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Full">Full Access</option>
              <option value="Limited">Limited Access</option>
              <option value="Restricted">Restricted Access</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Security Features */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h2>
        <div className="space-y-3">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{feature.name}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
              <Switch checked={feature.enabled} />
            </div>
          ))}
        </div>
      </Card>

      {/* Portal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">150</p>
          <p className="text-sm text-gray-600 mt-1">Registered employees</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">142</p>
          <p className="text-sm text-gray-600 mt-1">Currently active</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">5</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting activation</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Suspended</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-sm text-gray-600 mt-1">Security issues</p>
        </Card>
      </div>

      {/* Employee Access List */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Portal Access</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Access Level</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Last Login</th>
                <th className="p-3 text-left">Security Score</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portalUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{user.employeeName}</p>
                      <p className="text-xs text-gray-500">{user.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{user.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(user.accessLevel)}`}>
                      {user.accessLevel}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{user.securityScore}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Shield className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Portal Features */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Portal Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Employee Access</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• View current and historical payslips</li>
              <li>• Download PDF payslips</li>
              <li>• Access year-end statements</li>
              <li>• View tax and contribution summaries</li>
              <li>• Update personal information</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Security Measures</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Two-factor authentication</li>
              <li>• Encrypted data transmission</li>
              <li>• Session management</li>
              <li>• Audit trail logging</li>
              <li>• Role-based access control</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Shield className="w-4 h-4 mr-2" />
          Generate All Access
        </Button>
        <Button className="bg-green-600 text-white">
          <Users className="w-4 h-4 mr-2" />
          Bulk Enable Access
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Security Logs</Button>
      </div>
    </div>
  );
};

export default EmployeePortalAccess;
