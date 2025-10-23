import React, { useState } from "react";
import { History, RotateCcw, Eye, Download, Clock, User, FileText } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const ChangeHistory = () => {
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);

  const changeHistory = [
    {
      id: 1,
      timestamp: "2025-01-21 10:30:00",
      user: "John Doe",
      action: "Updated Employee Salary",
      entity: "Employee EMP001",
      field: "Basic Salary",
      oldValue: "AED 15,000",
      newValue: "AED 18,000",
      reason: "Annual salary increment",
      status: "Applied",
      canRollback: true,
    },
    {
      id: 2,
      timestamp: "2025-01-21 09:15:00",
      user: "Sarah Johnson",
      action: "Modified Payroll Period",
      entity: "Payroll Run PR001",
      field: "Pay Period",
      oldValue: "January 1-31, 2025",
      newValue: "January 1-30, 2025",
      reason: "Month-end adjustment",
      status: "Applied",
      canRollback: true,
    },
    {
      id: 3,
      timestamp: "2025-01-21 08:45:00",
      user: "Mike Wilson",
      action: "Changed Cost Center",
      entity: "Employee EMP002",
      field: "Cost Center",
      oldValue: "IT-001",
      newValue: "IT-002",
      reason: "Department transfer",
      status: "Applied",
      canRollback: true,
    },
    {
      id: 4,
      timestamp: "2025-01-21 07:30:00",
      user: "Ahmed Ali",
      action: "Updated Tax Settings",
      entity: "Tax Configuration",
      field: "Tax Rate",
      oldValue: "5%",
      newValue: "5.5%",
      reason: "Tax law update",
      status: "Applied",
      canRollback: false,
    },
    {
      id: 5,
      timestamp: "2025-01-21 06:30:00",
      user: "Rajesh Kumar",
      action: "Modified Allowance",
      entity: "Employee EMP003",
      field: "Transport Allowance",
      oldValue: "AED 500",
      newValue: "AED 750",
      reason: "Policy update",
      status: "Applied",
      canRollback: true,
    },
  ];

  const rollbackOptions = [
    {
      type: "Single Change",
      description: "Rollback a specific change",
      icon: RotateCcw,
      color: "blue",
      complexity: "Low",
    },
    {
      type: "Bulk Rollback",
      description: "Rollback multiple changes",
      icon: History,
      color: "green",
      complexity: "Medium",
    },
    {
      type: "Time-based Rollback",
      description: "Rollback to a specific date/time",
      icon: Clock,
      color: "purple",
      complexity: "High",
    },
    {
      type: "Entity Rollback",
      description: "Rollback all changes for an entity",
      icon: FileText,
      color: "yellow",
      complexity: "High",
    },
  ];

  const handleRollback = (changeId) => {
    setIsRollingBack(true);
    setTimeout(() => {
      setIsRollingBack(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-green-100 text-green-700";
      case "Rolled Back":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "Low":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "High":
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
          <h1 className="text-2xl font-bold text-gray-900">Change History & Rollback Options</h1>
          <p className="text-gray-600 mt-1">
            Track all changes and rollback options for payroll data modifications
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => handleRollback(selectedChange?.id)}
            disabled={isRollingBack || !selectedChange?.canRollback}
            className="flex items-center gap-2 bg-red-600 text-white disabled:bg-gray-300"
          >
            {isRollingBack ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Rolling Back...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Rollback Selected
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
        </div>
      </div>

      {/* Rollback Options */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rollback Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {rollbackOptions.map((option, index) => (
            <Card key={index} className={`p-6 bg-${option.color}-50 border-${option.color}-200`}>
              <div className="flex items-center gap-3 mb-3">
                <option.icon className={`w-6 h-6 text-${option.color}-600`} />
                <h3 className="font-semibold text-gray-900">{option.type}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{option.description}</p>
              <div className="space-y-1 text-xs text-gray-600 mb-3">
                <p>Complexity: <span className={`px-2 py-1 rounded text-xs font-medium ${getComplexityColor(option.complexity)}`}>{option.complexity}</span></p>
              </div>
              <Button className="w-full text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                Select Option
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Change History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Entity</th>
                <th className="p-3 text-left">Field</th>
                <th className="p-3 text-left">Old Value</th>
                <th className="p-3 text-left">New Value</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {changeHistory.map((change) => (
                <tr key={change.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input 
                      type="checkbox" 
                      checked={selectedChange?.id === change.id}
                      onChange={() => setSelectedChange(change)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">{change.timestamp}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{change.user}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{change.action}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {change.entity}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{change.field}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-red-600 font-semibold">{change.oldValue}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-green-600 font-semibold">{change.newValue}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(change.status)}`}>
                      {change.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {change.canRollback && (
                        <Button 
                          onClick={() => handleRollback(change.id)}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-700"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Rollback
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

      {/* Change Details */}
      {selectedChange && (
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Change Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-semibold">{selectedChange.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User:</span>
                  <span className="font-semibold">{selectedChange.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Action:</span>
                  <span className="font-semibold">{selectedChange.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entity:</span>
                  <span className="font-semibold">{selectedChange.entity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Field:</span>
                  <span className="font-semibold">{selectedChange.field}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Value Changes</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Old Value:</span>
                  <span className="font-semibold text-red-600">{selectedChange.oldValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Value:</span>
                  <span className="font-semibold text-green-600">{selectedChange.newValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reason:</span>
                  <span className="font-semibold">{selectedChange.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedChange.status)}`}>
                    {selectedChange.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Can Rollback:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedChange.canRollback ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedChange.canRollback ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            {selectedChange.canRollback && (
              <Button 
                onClick={() => handleRollback(selectedChange.id)}
                className="bg-red-600 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Rollback This Change
              </Button>
            )}
            <Button onClick={() => setSelectedChange(null)} className="bg-gray-200 text-gray-700">
              Close Details
            </Button>
          </div>
        </Card>
      )}

      {/* Change Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Changes</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">247</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Rollbacks</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">12</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">45</p>
          <p className="text-sm text-gray-600 mt-1">Making changes</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Entities Modified</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">89</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>
      </div>

      {/* Rollback Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rollback Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Rollback Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Always backup data before rollback</li>
              <li>• Test rollback procedures in staging environment</li>
              <li>• Document rollback reasons and approvals</li>
              <li>• Notify affected users before rollback</li>
              <li>• Monitor system after rollback completion</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Rollback Limitations</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Some changes cannot be rolled back</li>
              <li>• Rollback may affect dependent data</li>
              <li>• Time-sensitive rollbacks have deadlines</li>
              <li>• Complex rollbacks require approval</li>
              <li>• Rollback logs are maintained for audit</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-red-600 text-white">
          <RotateCcw className="w-4 h-4 mr-2" />
          Bulk Rollback
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Change History
        </Button>
        <Button className="bg-gray-200 text-gray-700">Configure Rollback Settings</Button>
      </div>
    </div>
  );
};

export default ChangeHistory;
