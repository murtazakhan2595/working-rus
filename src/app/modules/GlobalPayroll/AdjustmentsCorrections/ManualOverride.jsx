import React, { useState } from "react";
import { Edit3, CheckCircle, Clock, AlertCircle, UserCheck } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const ManualOverride = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const overrideRequests = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      overrideType: "Salary Adjustment",
      amount: 2000,
      currency: "AED",
      reason: "Performance bonus adjustment",
      requestedBy: "Sarah Johnson",
      requestedAt: "2025-01-21 10:30:00",
      status: "Pending Approval",
      approver: "Mike Wilson",
      priority: "High",
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      overrideType: "Deduction Waiver",
      amount: -500,
      currency: "GBP",
      reason: "Late arrival penalty waiver",
      requestedBy: "Emma Brown",
      requestedAt: "2025-01-21 09:15:00",
      status: "Approved",
      approver: "David Lee",
      priority: "Medium",
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Ahmed Ali",
      overrideType: "Overtime Addition",
      amount: 1500,
      currency: "PKR",
      reason: "Weekend overtime missed in payroll",
      requestedBy: "Lisa Davis",
      requestedAt: "2025-01-21 08:45:00",
      status: "Rejected",
      approver: "Tom Wilson",
      priority: "Low",
    },
  ];

  const approvalWorkflow = [
    {
      step: 1,
      name: "Request Submission",
      description: "Employee/Manager submits override request",
      status: "Completed",
      completedAt: "2025-01-21 10:30:00",
    },
    {
      step: 2,
      name: "Manager Review",
      description: "Direct manager reviews and validates request",
      status: "Completed",
      completedAt: "2025-01-21 11:00:00",
    },
    {
      step: 3,
      name: "HR Approval",
      description: "HR team reviews compliance and policy",
      status: "In Progress",
      completedAt: null,
    },
    {
      step: 4,
      name: "Finance Approval",
      description: "Finance team approves budget impact",
      status: "Pending",
      completedAt: null,
    },
    {
      step: 5,
      name: "Implementation",
      description: "Override applied to payroll system",
      status: "Pending",
      completedAt: null,
    },
  ];

  const handleProcessOverride = (overrideId) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  const getStepStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
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
          <h1 className="text-2xl font-bold text-gray-900">Manual Override with Approval Workflow</h1>
          <p className="text-gray-600 mt-1">
            Manage manual payroll overrides with multi-level approval process
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <Edit3 className="w-4 h-4 mr-2" />
            Create Override
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Bulk Approve
          </Button>
        </div>
      </div>

      {/* Override Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Override Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="maxOverrideAmount" className="text-sm font-medium text-gray-700">
              Max Override Amount
            </Label>
            <input
              id="maxOverrideAmount"
              type="number"
              placeholder="10000"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum amount per override</p>
          </div>

          <div>
            <Label htmlFor="approvalLevels" className="text-sm font-medium text-gray-700">
              Approval Levels
            </Label>
            <select
              id="approvalLevels"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2">2 Levels (Manager + HR)</option>
              <option value="3">3 Levels (Manager + HR + Finance)</option>
              <option value="4">4 Levels (Manager + HR + Finance + CEO)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="autoApprovalThreshold" className="text-sm font-medium text-gray-700">
              Auto Approval Threshold
            </Label>
            <input
              id="autoApprovalThreshold"
              type="number"
              placeholder="500"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Amount below which auto-approval applies</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Require Justification</Label>
              <Switch defaultChecked />
            </div>
            <p className="text-xs text-gray-600">
              Mandatory reason for all overrides
            </p>
          </div>
        </div>
      </Card>

      {/* Approval Workflow */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {approvalWorkflow.map((step) => (
            <div key={step.step} className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                step.status === "Completed" ? "bg-green-100" : 
                step.status === "In Progress" ? "bg-blue-100" : "bg-gray-100"
              }`}>
                {step.status === "Completed" ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : step.status === "In Progress" ? (
                  <Clock className="w-6 h-6 text-blue-600" />
                ) : (
                  <span className="text-gray-600 font-bold">{step.step}</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{step.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{step.description}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium mt-2 inline-block ${getStepStatusColor(step.status)}`}>
                {step.status}
              </span>
              {step.completedAt && (
                <p className="text-xs text-gray-500 mt-1">{step.completedAt}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Override Requests */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Override Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Override Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Approver</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {overrideRequests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{request.employeeName}</p>
                      <p className="text-xs text-gray-500">{request.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{request.overrideType}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold text-lg ${request.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {request.amount > 0 ? '+' : ''}{request.amount.toLocaleString()} {request.currency}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{request.reason}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{request.approver}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {request.status === "Pending Approval" && (
                        <Button
                          onClick={() => handleProcessOverride(request.id)}
                          disabled={isProcessing}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                      )}
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Override Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Edit3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Overrides</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">47</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Approved</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">42</p>
          <p className="text-sm text-gray-600 mt-1">89% approval rate</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">3</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting approval</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Rejected</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">2</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>
      </div>

      {/* Override Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Override Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Allowed Override Types</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Salary adjustments (bonuses, increments)</li>
              <li>• Deduction waivers (penalties, late fees)</li>
              <li>• Overtime additions (missed calculations)</li>
              <li>• Allowance adjustments (travel, meal)</li>
              <li>• Tax corrections (exemptions, deductions)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Approval Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Valid business justification required</li>
              <li>• Supporting documentation needed</li>
              <li>• Multi-level approval workflow</li>
              <li>• Audit trail maintained</li>
              <li>• Compliance with company policies</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Edit3 className="w-4 h-4 mr-2" />
          Create New Override
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Bulk Approve Selected
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Override History</Button>
      </div>
    </div>
  );
};

export default ManualOverride;
