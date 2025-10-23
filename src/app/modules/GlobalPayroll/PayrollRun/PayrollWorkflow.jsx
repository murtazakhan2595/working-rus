import React, { useState } from "react";
import { FileText, CheckCircle, Clock, XCircle, User } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const PayrollWorkflow = () => {
  const [currentStatus, setCurrentStatus] = useState("draft");

  const workflowStages = [
    { id: 1, name: "Draft", status: "completed", user: "HR Manager", date: "2025-01-20 10:00" },
    { id: 2, name: "Review", status: "in_progress", user: "Finance Team", date: null },
    { id: 3, name: "Approval", status: "pending", user: "CFO", date: null },
    { id: 4, name: "Final", status: "pending", user: "System", date: null },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Workflow</h1>
        <p className="text-gray-600 mt-1">
          Draft, review, and approval workflow for payroll processing
        </p>
      </div>

      {/* Workflow Status */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Current Status: Review</h2>
            <p className="text-gray-600 mt-1">Payroll is currently under review by Finance Team</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-600">Pending since: 2 hours ago</span>
          </div>
        </div>
      </Card>

      {/* Workflow Timeline */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Workflow Timeline</h2>
        <div className="space-y-6">
          {workflowStages.map((stage, index) => (
            <div key={stage.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    stage.status === "completed"
                      ? "bg-green-600"
                      : stage.status === "in_progress"
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >
                  {stage.status === "completed" ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : stage.status === "in_progress" ? (
                    <Clock className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold">{stage.id}</span>
                  )}
                </div>
                {index < workflowStages.length - 1 && (
                  <div className={`w-0.5 h-16 ${stage.status === "completed" ? "bg-green-600" : "bg-gray-300"}`} />
                )}
              </div>

              <div className="flex-1 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Assigned to: <span className="font-medium">{stage.user}</span>
                    </p>
                    {stage.date && (
                      <p className="text-sm text-gray-500 mt-1">
                        {stage.status === "completed" ? "Completed" : "Started"}: {stage.date}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      stage.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : stage.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {stage.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payroll Summary */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">245</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Gross Amount</p>
            <p className="text-2xl font-bold text-gray-900">$125,000</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Net Payable</p>
            <p className="text-2xl font-bold text-blue-600">$100,000</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex gap-3">
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button className="bg-red-600 text-white">
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button className="bg-blue-600 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Request Changes
          </Button>
          <Button className="bg-gray-200 text-gray-700">Save as Draft</Button>
        </div>
      </Card>

      {/* Comments Section */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments & Notes</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">HR Manager</span>
              <span className="text-sm text-gray-500">2025-01-20 10:00</span>
            </div>
            <p className="text-gray-700">Payroll computation completed and ready for review.</p>
          </div>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Add a comment..."
          />
          <Button className="bg-blue-600 text-white">Add Comment</Button>
        </div>
      </Card>
    </div>
  );
};

export default PayrollWorkflow;

