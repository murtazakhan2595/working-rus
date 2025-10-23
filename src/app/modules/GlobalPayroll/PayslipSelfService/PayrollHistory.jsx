import React, { useState } from "react";
import { History, Calendar, DollarSign, TrendingUp, Filter, Download, Eye } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const PayrollHistory = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("2025");

  const payrollHistory = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      payPeriod: "January 2025",
      grossSalary: 15000,
      netSalary: 12000,
      deductions: 3000,
      adjustments: 0,
      currency: "AED",
      status: "Processed",
      processedAt: "2025-01-21 10:30:00",
      adjustmentDetails: [
        {
          type: "Bonus",
          amount: 2000,
          date: "2025-01-15",
          reason: "Performance bonus",
        },
      ],
    },
    {
      id: 2,
      employeeId: "EMP001",
      employeeName: "John Doe",
      payPeriod: "December 2024",
      grossSalary: 15000,
      netSalary: 14000,
      deductions: 1000,
      adjustments: 0,
      currency: "AED",
      status: "Processed",
      processedAt: "2024-12-21 10:30:00",
      adjustmentDetails: [],
    },
    {
      id: 3,
      employeeId: "EMP001",
      employeeName: "John Doe",
      payPeriod: "November 2024",
      grossSalary: 15000,
      netSalary: 12000,
      deductions: 3000,
      adjustments: 500,
      currency: "AED",
      status: "Processed",
      processedAt: "2024-11-21 10:30:00",
      adjustmentDetails: [
        {
          type: "Overtime",
          amount: 500,
          date: "2024-11-20",
          reason: "Weekend overtime",
        },
      ],
    },
    {
      id: 4,
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      payPeriod: "January 2025",
      grossSalary: 3000,
      netSalary: 2400,
      deductions: 600,
      adjustments: 0,
      currency: "GBP",
      status: "Processed",
      processedAt: "2025-01-21 10:32:00",
      adjustmentDetails: [],
    },
  ];

  const adjustments = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      type: "Bonus",
      amount: 2000,
      currency: "AED",
      date: "2025-01-15",
      reason: "Performance bonus",
      status: "Approved",
      approvedBy: "Sarah Johnson",
    },
    {
      id: 2,
      employeeId: "EMP001",
      employeeName: "John Doe",
      type: "Overtime",
      amount: 500,
      currency: "AED",
      date: "2024-11-20",
      reason: "Weekend overtime",
      status: "Approved",
      approvedBy: "Mike Wilson",
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Ahmed Ali",
      type: "Deduction",
      amount: -300,
      currency: "PKR",
      date: "2025-01-10",
      reason: "Late arrival penalty",
      status: "Pending",
      approvedBy: "Emma Brown",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAdjustmentTypeColor = (type) => {
    switch (type) {
      case "Bonus":
        return "bg-green-100 text-green-700";
      case "Overtime":
        return "bg-blue-100 text-blue-700";
      case "Deduction":
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
          <h1 className="text-2xl font-bold text-gray-900">Payroll History & Adjustments</h1>
          <p className="text-gray-600 mt-1">
            View history of previous payrolls and adjustments
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
          <Button className="bg-green-600 text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Add Adjustment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="employee" className="text-sm font-medium text-gray-700">
              Employee
            </Label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Employees</option>
              <option value="EMP001">John Doe</option>
              <option value="EMP002">Sarah Johnson</option>
              <option value="EMP003">Ahmed Ali</option>
            </select>
          </div>

          <div>
            <Label htmlFor="period" className="text-sm font-medium text-gray-700">
              Period
            </Label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </Label>
            <select
              id="status"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="processed">Processed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button className="w-full bg-gray-200 text-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Payrolls</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">48</p>
          <p className="text-sm text-gray-600 mt-1">Processed this year</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Total Paid</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">AED 1.2M</p>
          <p className="text-sm text-gray-600 mt-1">This year</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Adjustments</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">23</p>
          <p className="text-sm text-gray-600 mt-1">This year</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Avg. Processing</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">2.3</p>
          <p className="text-sm text-gray-600 mt-1">Days</p>
        </Card>
      </div>

      {/* Payroll History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Pay Period</th>
                <th className="p-3 text-left">Gross Salary</th>
                <th className="p-3 text-left">Deductions</th>
                <th className="p-3 text-left">Adjustments</th>
                <th className="p-3 text-left">Net Salary</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollHistory.map((payroll) => (
                <tr key={payroll.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{payroll.employeeName}</p>
                      <p className="text-xs text-gray-500">{payroll.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{payroll.payPeriod}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{payroll.grossSalary.toLocaleString()} {payroll.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-red-600 font-semibold">-{payroll.deductions.toLocaleString()} {payroll.currency}</span>
                  </td>
                  <td className="p-3">
                    {payroll.adjustments > 0 ? (
                      <span className="text-green-600 font-semibold">+{payroll.adjustments.toLocaleString()} {payroll.currency}</span>
                    ) : (
                      <span className="text-gray-500">0 {payroll.currency}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-lg">{payroll.netSalary.toLocaleString()} {payroll.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payroll.status)}`}>
                      {payroll.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Adjustments */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Adjustments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Approved By</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((adjustment) => (
                <tr key={adjustment.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{adjustment.employeeName}</p>
                      <p className="text-xs text-gray-500">{adjustment.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAdjustmentTypeColor(adjustment.type)}`}>
                      {adjustment.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${adjustment.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {adjustment.amount > 0 ? '+' : ''}{adjustment.amount.toLocaleString()} {adjustment.currency}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{adjustment.date}</td>
                  <td className="p-3 text-sm text-gray-600">{adjustment.reason}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(adjustment.status)}`}>
                      {adjustment.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{adjustment.approvedBy}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <History className="w-4 h-4 mr-2" />
          View Full History
        </Button>
        <Button className="bg-green-600 text-white">
          <TrendingUp className="w-4 h-4 mr-2" />
          Add New Adjustment
        </Button>
        <Button className="bg-gray-200 text-gray-700">Export Report</Button>
      </div>
    </div>
  );
};

export default PayrollHistory;
