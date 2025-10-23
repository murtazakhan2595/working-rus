import React, { useState } from "react";
import { Calendar, Users, DollarSign, AlertTriangle, CheckCircle, Clock, Minus } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const LeaveAdjustments = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("unpaid");

  const leaveAdjustments = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      leaveType: "Unpaid Leave",
      days: 3,
      startDate: "2025-01-15",
      endDate: "2025-01-17",
      dailySalary: 500,
      deduction: 1500,
      currency: "AED",
      reason: "Personal emergency",
      status: "Applied",
      appliedAt: "2025-01-18 10:30:00",
      approvedBy: "Sarah Johnson",
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      leaveType: "Sick Leave",
      days: 2,
      startDate: "2025-01-20",
      endDate: "2025-01-21",
      dailySalary: 400,
      deduction: 0,
      currency: "GBP",
      reason: "Medical emergency",
      status: "Pending",
      appliedAt: "2025-01-21 09:15:00",
      approvedBy: "Mike Wilson",
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Ahmed Ali",
      leaveType: "Maternity Leave",
      days: 90,
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      dailySalary: 600,
      deduction: 0,
      currency: "PKR",
      reason: "Maternity leave",
      status: "Applied",
      appliedAt: "2025-01-01 08:00:00",
      approvedBy: "Emma Brown",
    },
  ];

  const leaveTypes = [
    {
      type: "Unpaid Leave",
      description: "Leave without pay",
      icon: Minus,
      color: "red",
      deduction: "Full daily salary",
      maxDays: 30,
    },
    {
      type: "Sick Leave",
      description: "Medical leave with pay",
      icon: AlertTriangle,
      color: "blue",
      deduction: "None",
      maxDays: 15,
    },
    {
      type: "Maternity Leave",
      description: "Maternity leave with pay",
      icon: Users,
      color: "green",
      deduction: "None",
      maxDays: 90,
    },
    {
      type: "Emergency Leave",
      description: "Emergency leave with partial pay",
      icon: Clock,
      color: "yellow",
      deduction: "50% daily salary",
      maxDays: 5,
    },
  ];

  const leaveBalances = [
    {
      employeeId: "EMP001",
      employeeName: "John Doe",
      annualLeave: 25,
      sickLeave: 15,
      maternityLeave: 0,
      unpaidLeave: 30,
      usedAnnual: 5,
      usedSick: 2,
      usedMaternity: 0,
      usedUnpaid: 3,
    },
    {
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      annualLeave: 30,
      sickLeave: 20,
      maternityLeave: 0,
      unpaidLeave: 30,
      usedAnnual: 8,
      usedSick: 5,
      usedMaternity: 0,
      usedUnpaid: 0,
    },
  ];

  const handleProcessAdjustment = (adjustmentId) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Unpaid Leave":
        return "bg-red-100 text-red-700";
      case "Sick Leave":
        return "bg-blue-100 text-blue-700";
      case "Maternity Leave":
        return "bg-green-100 text-green-700";
      case "Emergency Leave":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Adjustments & Unpaid Leave Handling</h1>
          <p className="text-gray-600 mt-1">
            Manage leave adjustments and unpaid leave deductions in payroll
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Create Adjustment
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Process Selected
          </Button>
        </div>
      </div>

      {/* Leave Adjustment Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Adjustment Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="leaveType" className="text-sm font-medium text-gray-700">
              Leave Type
            </Label>
            <select
              id="leaveType"
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="unpaid">Unpaid Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="emergency">Emergency Leave</option>
            </select>
          </div>

          <div>
            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
              Start Date
            </Label>
            <input
              id="startDate"
              type="date"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
              End Date
            </Label>
            <input
              id="endDate"
              type="date"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
              Reason
            </Label>
            <input
              id="reason"
              type="text"
              placeholder="Enter reason for leave"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Leave Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {leaveTypes.map((leave, index) => (
          <Card key={index} className={`p-6 bg-${leave.color}-50 border-${leave.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <leave.icon className={`w-6 h-6 text-${leave.color}-600`} />
              <h3 className="font-semibold text-gray-900">{leave.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{leave.description}</p>
            <p className="text-xs text-gray-600 mb-2">Deduction: {leave.deduction}</p>
            <p className="text-xs text-gray-600 mb-4">Max Days: {leave.maxDays}</p>
            <Button className="w-full text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
              Apply Leave
            </Button>
          </Card>
        ))}
      </div>

      {/* Leave Balances */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Leave Balances</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Annual Leave</th>
                <th className="p-3 text-left">Sick Leave</th>
                <th className="p-3 text-left">Maternity Leave</th>
                <th className="p-3 text-left">Unpaid Leave</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveBalances.map((balance) => (
                <tr key={balance.employeeId} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{balance.employeeName}</p>
                      <p className="text-xs text-gray-500">{balance.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{balance.usedAnnual}/{balance.annualLeave}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(balance.usedAnnual / balance.annualLeave) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{balance.usedSick}/{balance.sickLeave}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(balance.usedSick / balance.sickLeave) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{balance.usedMaternity}/{balance.maternityLeave}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${balance.maternityLeave > 0 ? (balance.usedMaternity / balance.maternityLeave) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{balance.usedUnpaid}/{balance.unpaidLeave}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${(balance.usedUnpaid / balance.unpaidLeave) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Leave Adjustments */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Adjustments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Daily Salary</th>
                <th className="p-3 text-left">Deduction</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveAdjustments.map((adjustment) => (
                <tr key={adjustment.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{adjustment.employeeName}</p>
                      <p className="text-xs text-gray-500">{adjustment.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(adjustment.leaveType)}`}>
                      {adjustment.leaveType}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold">{adjustment.days} days</p>
                        <p className="text-xs text-gray-500">{adjustment.startDate} to {adjustment.endDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{adjustment.dailySalary} {adjustment.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold text-lg ${adjustment.deduction > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {adjustment.deduction > 0 ? '-' : '+'}{adjustment.deduction} {adjustment.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(adjustment.status)}`}>
                      {adjustment.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {adjustment.status === "Pending" && (
                        <Button
                          onClick={() => handleProcessAdjustment(adjustment.id)}
                          disabled={isProcessing}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Apply
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

      {/* Leave Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Adjustments</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">45</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Applied</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">42</p>
          <p className="text-sm text-gray-600 mt-1">93% success rate</p>
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
            <Minus className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Total Deductions</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">AED 15K</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>
      </div>

      {/* Leave Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Adjustment Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Leave Types</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Unpaid Leave: Full salary deduction</li>
              <li>• Sick Leave: No deduction (with medical certificate)</li>
              <li>• Maternity Leave: No deduction (statutory)</li>
              <li>• Emergency Leave: Partial deduction (50%)</li>
              <li>• Annual Leave: No deduction (earned)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Processing Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Manager approval required</li>
              <li>• HR validation of leave balance</li>
              <li>• Medical certificate for sick leave</li>
              <li>• Proper documentation</li>
              <li>• Payroll integration</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Calendar className="w-4 h-4 mr-2" />
          Create Leave Adjustment
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Process Selected Adjustments
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Leave History</Button>
      </div>
    </div>
  );
};

export default LeaveAdjustments;
