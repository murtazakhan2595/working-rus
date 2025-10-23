import React, { useState } from "react";
import { PlayCircle, Calendar, Users, DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const OffCyclePayroll = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const offCyclePayrolls = [
    {
      id: 1,
      payrollName: "January Bonus Run",
      payrollType: "Bonus",
      payPeriod: "2025-01-15 to 2025-01-21",
      employeeCount: 25,
      totalAmount: 125000,
      currency: "AED",
      status: "Completed",
      processedAt: "2025-01-21 14:30:00",
      processedBy: "Sarah Johnson",
      reason: "Q4 Performance Bonus",
    },
    {
      id: 2,
      payrollName: "Emergency Salary Advance",
      payrollType: "Advance",
      payPeriod: "2025-01-20 to 2025-01-20",
      employeeCount: 8,
      totalAmount: 40000,
      currency: "AED",
      status: "Processing",
      processedAt: null,
      processedBy: "Mike Wilson",
      reason: "Emergency salary advance for selected employees",
    },
    {
      id: 3,
      payrollName: "Termination Settlement",
      payrollType: "Termination",
      payPeriod: "2025-01-18 to 2025-01-18",
      employeeCount: 3,
      totalAmount: 45000,
      currency: "AED",
      status: "Pending",
      processedAt: null,
      processedBy: "Emma Brown",
      reason: "Final settlement for terminated employees",
    },
  ];

  const payrollTypes = [
    {
      type: "Bonus",
      description: "Performance bonuses and incentives",
      icon: DollarSign,
      color: "green",
      frequency: "As needed",
    },
    {
      type: "Advance",
      description: "Salary advances and emergency payments",
      icon: Clock,
      color: "blue",
      frequency: "Emergency",
    },
    {
      type: "Termination",
      description: "Final settlements and severance",
      icon: AlertTriangle,
      color: "red",
      frequency: "As needed",
    },
    {
      type: "Correction",
      description: "Payroll corrections and adjustments",
      icon: CheckCircle,
      color: "yellow",
      frequency: "As needed",
    },
  ];

  const employees = [
    {
      id: "EMP001",
      name: "John Doe",
      department: "IT",
      salary: 15000,
      currency: "AED",
      selected: false,
    },
    {
      id: "EMP002",
      name: "Sarah Johnson",
      department: "HR",
      salary: 12000,
      currency: "AED",
      selected: false,
    },
    {
      id: "EMP003",
      name: "Ahmed Ali",
      department: "Finance",
      salary: 18000,
      currency: "AED",
      selected: false,
    },
  ];

  const handleProcessPayroll = (payrollId) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPayrollTypeColor = (type) => {
    switch (type) {
      case "Bonus":
        return "bg-green-100 text-green-700";
      case "Advance":
        return "bg-blue-100 text-blue-700";
      case "Termination":
        return "bg-red-100 text-red-700";
      case "Correction":
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
          <h1 className="text-2xl font-bold text-gray-900">Off-Cycle Payroll Run Support</h1>
          <p className="text-gray-600 mt-1">
            Process payroll outside regular cycles for bonuses, advances, and settlements
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <PlayCircle className="w-4 h-4 mr-2" />
            Create Off-Cycle Run
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Process Selected
          </Button>
        </div>
      </div>

      {/* Off-Cycle Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Off-Cycle Payroll Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="payrollType" className="text-sm font-medium text-gray-700">
              Payroll Type
            </Label>
            <select
              id="payrollType"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bonus">Bonus</option>
              <option value="advance">Advance</option>
              <option value="termination">Termination</option>
              <option value="correction">Correction</option>
            </select>
          </div>

          <div>
            <Label htmlFor="payPeriod" className="text-sm font-medium text-gray-700">
              Pay Period
            </Label>
            <input
              id="payPeriod"
              type="date"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="paymentDate" className="text-sm font-medium text-gray-700">
              Payment Date
            </Label>
            <input
              id="paymentDate"
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
              placeholder="Enter reason for off-cycle payroll"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Payroll Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {payrollTypes.map((payroll, index) => (
          <Card key={index} className={`p-6 bg-${payroll.color}-50 border-${payroll.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <payroll.icon className={`w-6 h-6 text-${payroll.color}-600`} />
              <h3 className="font-semibold text-gray-900">{payroll.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{payroll.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{payroll.frequency}</span>
              <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                Create
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Employee Selection */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Selection</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Current Salary</th>
                <th className="p-3 text-left">Off-Cycle Amount</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.id}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {employee.department}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">
                      {employee.salary.toLocaleString()} {employee.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                      Calculate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Off-Cycle Payroll Runs */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Off-Cycle Payroll Runs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Payroll Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Pay Period</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Total Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Processed By</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offCyclePayrolls.map((payroll) => (
                <tr key={payroll.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{payroll.payrollName}</p>
                      <p className="text-xs text-gray-500">{payroll.reason}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPayrollTypeColor(payroll.payrollType)}`}>
                      {payroll.payrollType}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{payroll.payPeriod}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{payroll.employeeCount}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{payroll.totalAmount.toLocaleString()} {payroll.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payroll.status)}`}>
                      {payroll.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{payroll.processedBy}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {payroll.status === "Pending" && (
                        <Button
                          onClick={() => handleProcessPayroll(payroll.id)}
                          disabled={isProcessing}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700"
                        >
                          <PlayCircle className="w-3 h-3 mr-1" />
                          Process
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

      {/* Off-Cycle Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <PlayCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Runs</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">10</p>
          <p className="text-sm text-gray-600 mt-1">83% success rate</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Processing</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">1</p>
          <p className="text-sm text-gray-600 mt-1">In progress</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Total Amount</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">AED 210K</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>
      </div>

      {/* Off-Cycle Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Off-Cycle Payroll Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Allowed Off-Cycle Types</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Performance bonuses and incentives</li>
              <li>• Emergency salary advances</li>
              <li>• Termination settlements</li>
              <li>• Payroll corrections</li>
              <li>• Special allowances</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Valid business justification</li>
              <li>• Manager approval required</li>
              <li>• HR and Finance approval</li>
              <li>• Complete documentation</li>
              <li>• Audit trail maintained</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <PlayCircle className="w-4 h-4 mr-2" />
          Create Off-Cycle Run
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Process Selected Runs
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Run History</Button>
      </div>
    </div>
  );
};

export default OffCyclePayroll;
