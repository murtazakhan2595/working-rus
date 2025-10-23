import React, { useState } from "react";
import { CreditCard, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle, TrendingUp, Minus } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const LoansAdvances = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedType, setSelectedType] = useState("loan");

  const loansAdvances = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      type: "Personal Loan",
      amount: 50000,
      currency: "AED",
      installmentAmount: 2500,
      totalInstallments: 20,
      paidInstallments: 8,
      remainingInstallments: 12,
      startDate: "2024-06-01",
      endDate: "2025-05-01",
      status: "Active",
      interestRate: 5.5,
      monthlyDeduction: 2500,
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      type: "Salary Advance",
      amount: 10000,
      currency: "GBP",
      installmentAmount: 2000,
      totalInstallments: 5,
      paidInstallments: 3,
      remainingInstallments: 2,
      startDate: "2024-12-01",
      endDate: "2025-04-01",
      status: "Active",
      interestRate: 0,
      monthlyDeduction: 2000,
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Ahmed Ali",
      type: "Reimbursement",
      amount: 5000,
      currency: "PKR",
      installmentAmount: 0,
      totalInstallments: 1,
      paidInstallments: 0,
      remainingInstallments: 1,
      startDate: "2025-01-15",
      endDate: "2025-01-15",
      status: "Pending",
      interestRate: 0,
      monthlyDeduction: 0,
    },
  ];

  const loanTypes = [
    {
      type: "Personal Loan",
      description: "Long-term personal loans",
      icon: CreditCard,
      color: "blue",
      maxAmount: 100000,
      interestRate: "5.5%",
      maxPeriod: "36 months",
    },
    {
      type: "Salary Advance",
      description: "Short-term salary advances",
      icon: DollarSign,
      color: "green",
      maxAmount: 20000,
      interestRate: "0%",
      maxPeriod: "6 months",
    },
    {
      type: "Reimbursement",
      description: "Expense reimbursements",
      icon: TrendingUp,
      color: "purple",
      maxAmount: 10000,
      interestRate: "0%",
      maxPeriod: "1 month",
    },
    {
      type: "Emergency Loan",
      description: "Emergency financial assistance",
      icon: AlertTriangle,
      color: "red",
      maxAmount: 50000,
      interestRate: "3%",
      maxPeriod: "12 months",
    },
  ];

  const reimbursementRequests = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      expenseType: "Travel",
      amount: 2500,
      currency: "AED",
      description: "Business trip to Dubai",
      submittedDate: "2025-01-20",
      status: "Approved",
      approvedBy: "Sarah Johnson",
      paymentDate: "2025-01-25",
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      expenseType: "Meals",
      amount: 500,
      currency: "GBP",
      description: "Client meeting dinner",
      submittedDate: "2025-01-21",
      status: "Pending",
      approvedBy: null,
      paymentDate: null,
    },
  ];

  const handleProcessLoan = (loanId) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLoanTypeColor = (type) => {
    switch (type) {
      case "Personal Loan":
        return "bg-blue-100 text-blue-700";
      case "Salary Advance":
        return "bg-green-100 text-green-700";
      case "Reimbursement":
        return "bg-purple-100 text-purple-700";
      case "Emergency Loan":
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
          <h1 className="text-2xl font-bold text-gray-900">Loans, Advances & Reimbursements Integration</h1>
          <p className="text-gray-600 mt-1">
            Manage employee loans, advances, and expense reimbursements in payroll
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Create Loan/Advance
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Process Reimbursements
          </Button>
        </div>
      </div>

      {/* Loan/Advance Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan/Advance Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Type
            </Label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="loan">Personal Loan</option>
              <option value="advance">Salary Advance</option>
              <option value="reimbursement">Reimbursement</option>
              <option value="emergency">Emergency Loan</option>
            </select>
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount
            </Label>
            <input
              id="amount"
              type="number"
              placeholder="Enter amount"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="installments" className="text-sm font-medium text-gray-700">
              Installments
            </Label>
            <input
              id="installments"
              type="number"
              placeholder="Number of installments"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
        </div>
      </Card>

      {/* Loan Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loanTypes.map((loan, index) => (
          <Card key={index} className={`p-6 bg-${loan.color}-50 border-${loan.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <loan.icon className={`w-6 h-6 text-${loan.color}-600`} />
              <h3 className="font-semibold text-gray-900">{loan.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{loan.description}</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Max Amount: {loan.maxAmount.toLocaleString()}</p>
              <p>Interest: {loan.interestRate}</p>
              <p>Max Period: {loan.maxPeriod}</p>
            </div>
            <Button className="w-full mt-3 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
              Create {loan.type}
            </Button>
          </Card>
        ))}
      </div>

      {/* Active Loans & Advances */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Loans & Advances</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Installments</th>
                <th className="p-3 text-left">Monthly Deduction</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loansAdvances.map((loan) => (
                <tr key={loan.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{loan.employeeName}</p>
                      <p className="text-xs text-gray-500">{loan.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoanTypeColor(loan.type)}`}>
                      {loan.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{loan.amount.toLocaleString()} {loan.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <p className="font-semibold">{loan.paidInstallments}/{loan.totalInstallments}</p>
                      <p className="text-xs text-gray-500">{loan.remainingInstallments} remaining</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Minus className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-600">{loan.monthlyDeduction.toLocaleString()} {loan.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        View Details
                      </Button>
                      {loan.status === "Pending" && (
                        <Button
                          onClick={() => handleProcessLoan(loan.id)}
                          disabled={isProcessing}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Process
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

      {/* Reimbursement Requests */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reimbursement Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Expense Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Submitted</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reimbursementRequests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{request.employeeName}</p>
                      <p className="text-xs text-gray-500">{request.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {request.expenseType}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{request.amount.toLocaleString()} {request.currency}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{request.description}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{request.submittedDate}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {request.status === "Pending" && (
                        <Button
                          onClick={() => handleProcessLoan(request.id)}
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

      {/* Loan Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Active Loans</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">25</p>
          <p className="text-sm text-gray-600 mt-1">Total active</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Total Amount</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">AED 1.2M</p>
          <p className="text-sm text-gray-600 mt-1">Outstanding</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">8</p>
          <p className="text-sm text-gray-600 mt-1">Reimbursements</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Monthly Deductions</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">AED 45K</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>
      </div>

      {/* Integration Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Loans & Reimbursements Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Loan Management</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Automatic monthly deductions from salary</li>
              <li>• Interest calculation and tracking</li>
              <li>• Installment schedule management</li>
              <li>• Early payment options</li>
              <li>• Loan closure and settlement</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Reimbursement Process</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Expense submission and approval</li>
              <li>• Receipt validation and verification</li>
              <li>• Payment processing and tracking</li>
              <li>• Tax implications handling</li>
              <li>• Integration with payroll system</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <CreditCard className="w-4 h-4 mr-2" />
          Create New Loan/Advance
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Process Reimbursements
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Loan History</Button>
      </div>
    </div>
  );
};

export default LoansAdvances;
