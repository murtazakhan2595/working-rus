import React, { useState } from "react";
import { CheckCircle, Clock, AlertCircle, Users, DollarSign, PlayCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const PaymentBatchApprovals = () => {
  const [isApproving, setIsApproving] = useState(false);

  const paymentBatches = [
    {
      id: 1,
      batchName: "January 2025 Payroll",
      country: "UAE",
      currency: "AED",
      employeeCount: 150,
      totalAmount: 1250000,
      status: "Pending Approval",
      createdBy: "John Smith",
      createdAt: "2025-01-21 10:30:00",
      approver: "Sarah Johnson",
      approvalDeadline: "2025-01-22 18:00:00",
      priority: "High",
      errors: 0,
      warnings: 2,
    },
    {
      id: 2,
      batchName: "UK Monthly Payroll",
      country: "UK",
      currency: "GBP",
      employeeCount: 75,
      totalAmount: 125000,
      status: "Approved",
      createdBy: "Mike Wilson",
      createdAt: "2025-01-20 15:45:00",
      approver: "Emma Brown",
      approvalDeadline: "2025-01-21 18:00:00",
      priority: "Medium",
      errors: 0,
      warnings: 0,
    },
    {
      id: 3,
      batchName: "South Africa Payroll",
      country: "South Africa",
      currency: "ZAR",
      employeeCount: 45,
      totalAmount: 450000,
      status: "Rejected",
      createdBy: "David Lee",
      createdAt: "2025-01-19 09:15:00",
      approver: "Lisa Davis",
      approvalDeadline: "2025-01-20 18:00:00",
      priority: "Low",
      errors: 3,
      warnings: 1,
    },
  ];

  const handleApprove = (batchId) => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Batch Approvals</h1>
          <p className="text-gray-600 mt-1">
            Review, approve, and track payment batches across all countries
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <PlayCircle className="w-4 h-4 mr-2" />
            Create Batch
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Bulk Approve
          </Button>
        </div>
      </div>

      {/* Approval Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="autoApproval" className="text-sm font-medium text-gray-700">
              Auto Approval Threshold
            </Label>
            <input
              id="autoApproval"
              type="number"
              placeholder="50000"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Amount below which auto-approval applies</p>
          </div>

          <div>
            <Label htmlFor="approvalTimeout" className="text-sm font-medium text-gray-700">
              Approval Timeout (Hours)
            </Label>
            <input
              id="approvalTimeout"
              type="number"
              placeholder="24"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-escalate after this time</p>
          </div>

          <div>
            <Label htmlFor="maxBatchSize" className="text-sm font-medium text-gray-700">
              Max Batch Size
            </Label>
            <input
              id="maxBatchSize"
              type="number"
              placeholder="1000"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum employees per batch</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Auto Escalation</Label>
              <Switch defaultChecked />
            </div>
            <p className="text-xs text-gray-600">
              Automatically escalate overdue approvals
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Batches */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Batches</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Batch Name</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Issues</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentBatches.map((batch) => (
                <tr key={batch.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{batch.batchName}</p>
                      <p className="text-xs text-gray-500">by {batch.createdBy}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">
                        {batch.country}
                      </span>
                      <span className="text-xs text-gray-500">{batch.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{batch.employeeCount}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{batch.totalAmount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(batch.priority)}`}>
                      {batch.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {batch.errors > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-600 font-semibold">{batch.errors}</span>
                        </div>
                      )}
                      {batch.warnings > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-yellow-600 font-semibold">{batch.warnings}</span>
                        </div>
                      )}
                      {batch.errors === 0 && batch.warnings === 0 && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {batch.status === "Pending Approval" && (
                        <Button
                          onClick={() => handleApprove(batch.id)}
                          disabled={isApproving}
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

      {/* Approval Workflow */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">Create Batch</p>
            <p className="text-xs text-gray-600">Generate payment file</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">Validation</p>
            <p className="text-xs text-gray-600">Check for errors</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">Review</p>
            <p className="text-xs text-gray-600">Manager approval</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-sm font-bold">4</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">Approve</p>
            <p className="text-xs text-gray-600">Final approval</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-sm font-bold">5</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">Process</p>
            <p className="text-xs text-gray-600">Send to bank</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <PlayCircle className="w-4 h-4 mr-2" />
          Create New Batch
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Bulk Approve Selected
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Approval History</Button>
      </div>
    </div>
  );
};

export default PaymentBatchApprovals;
