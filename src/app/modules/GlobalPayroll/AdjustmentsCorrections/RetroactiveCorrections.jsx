import React, { useState } from "react";
import { RotateCcw, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const RetroactiveCorrections = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("2024-12");

  const retroactiveCorrections = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      originalPeriod: "December 2024",
      correctionType: "Salary Increase",
      originalAmount: 15000,
      correctedAmount: 16000,
      difference: 1000,
      currency: "AED",
      reason: "Promotion effective December 1st",
      status: "Applied",
      appliedAt: "2025-01-15 10:30:00",
      impactPeriods: ["December 2024", "January 2025"],
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      originalPeriod: "November 2024",
      correctionType: "Allowance Addition",
      originalAmount: 3000,
      correctedAmount: 3200,
      difference: 200,
      currency: "GBP",
      reason: "Transport allowance missed",
      status: "Pending",
      appliedAt: null,
      impactPeriods: ["November 2024"],
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Ahmed Ali",
      originalPeriod: "October 2024",
      correctionType: "Tax Correction",
      originalAmount: 180000,
      correctedAmount: 175000,
      difference: -5000,
      currency: "PKR",
      reason: "Tax exemption applied incorrectly",
      status: "Applied",
      appliedAt: "2025-01-10 14:20:00",
      impactPeriods: ["October 2024", "November 2024", "December 2024"],
    },
  ];

  const correctionTypes = [
    {
      type: "Salary Increase",
      description: "Retroactive salary adjustments",
      icon: DollarSign,
      color: "green",
      count: 12,
    },
    {
      type: "Allowance Addition",
      description: "Missing allowances and benefits",
      icon: Calendar,
      color: "blue",
      count: 8,
    },
    {
      type: "Tax Correction",
      description: "Tax calculation corrections",
      icon: AlertTriangle,
      color: "yellow",
      count: 5,
    },
    {
      type: "Deduction Waiver",
      description: "Penalty and deduction waivers",
      icon: CheckCircle,
      color: "purple",
      count: 3,
    },
  ];

  const handleApplyCorrection = (correctionId) => {
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
      case "Failed":
        return "bg-red-100 text-red-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCorrectionTypeColor = (type) => {
    switch (type) {
      case "Salary Increase":
        return "bg-green-100 text-green-700";
      case "Allowance Addition":
        return "bg-blue-100 text-blue-700";
      case "Tax Correction":
        return "bg-yellow-100 text-yellow-700";
      case "Deduction Waiver":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retroactive Salary Corrections</h1>
          <p className="text-gray-600 mt-1">
            Apply corrections to previous payroll periods with full audit trail
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <RotateCcw className="w-4 h-4 mr-2" />
            Create Correction
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Apply Selected
          </Button>
        </div>
      </div>

      {/* Correction Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Correction Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="period" className="text-sm font-medium text-gray-700">
              Target Period
            </Label>
            <input
              id="period"
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="maxRetroPeriods" className="text-sm font-medium text-gray-700">
              Max Retro Periods
            </Label>
            <select
              id="maxRetroPeriods"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>

          <div>
            <Label htmlFor="approvalRequired" className="text-sm font-medium text-gray-700">
              Approval Required
            </Label>
            <select
              id="approvalRequired"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="always">Always</option>
              <option value="above_threshold">Above Threshold</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div>
            <Label htmlFor="threshold" className="text-sm font-medium text-gray-700">
              Auto-Approval Threshold
            </Label>
            <input
              id="threshold"
              type="number"
              placeholder="1000"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Amount below which auto-approval applies</p>
          </div>
        </div>
      </Card>

      {/* Correction Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {correctionTypes.map((correction, index) => (
          <Card key={index} className={`p-6 bg-${correction.color}-50 border-${correction.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <correction.icon className={`w-6 h-6 text-${correction.color}-600`} />
              <h3 className="font-semibold text-gray-900">{correction.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{correction.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{correction.count}</span>
              <span className="text-sm text-gray-600">This month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Retroactive Corrections */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Retroactive Corrections</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Period</th>
                <th className="p-3 text-left">Correction Type</th>
                <th className="p-3 text-left">Original Amount</th>
                <th className="p-3 text-left">Corrected Amount</th>
                <th className="p-3 text-left">Difference</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {retroactiveCorrections.map((correction) => (
                <tr key={correction.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{correction.employeeName}</p>
                      <p className="text-xs text-gray-500">{correction.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{correction.originalPeriod}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCorrectionTypeColor(correction.correctionType)}`}>
                      {correction.correctionType}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-600">
                      {correction.originalAmount.toLocaleString()} {correction.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-blue-600">
                      {correction.correctedAmount.toLocaleString()} {correction.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold text-lg ${correction.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {correction.difference > 0 ? '+' : ''}{correction.difference.toLocaleString()} {correction.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(correction.status)}`}>
                      {correction.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {correction.status === "Pending" && (
                        <Button
                          onClick={() => handleApplyCorrection(correction.id)}
                          disabled={isProcessing}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Apply
                        </Button>
                      )}
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        View Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Impact Analysis */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Correction Impact Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Positive Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Salary Increases:</span>
                <span className="font-semibold text-green-600">+AED 15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Allowance Additions:</span>
                <span className="font-semibold text-green-600">+AED 3,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Positive:</span>
                <span className="font-semibold text-green-600">+AED 18,200</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Negative Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax Corrections:</span>
                <span className="font-semibold text-red-600">-AED 5,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Deduction Waivers:</span>
                <span className="font-semibold text-red-600">-AED 1,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Negative:</span>
                <span className="font-semibold text-red-600">-AED 6,500</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Net Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Net Difference:</span>
                <span className="font-semibold text-blue-600">+AED 11,700</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Affected Periods:</span>
                <span className="font-semibold text-blue-600">6 months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employees:</span>
                <span className="font-semibold text-blue-600">28</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Correction Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Corrections</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">28</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Applied</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">25</p>
          <p className="text-sm text-gray-600 mt-1">89% success rate</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">3</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting approval</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Affected</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">28</p>
          <p className="text-sm text-gray-600 mt-1">Employees</p>
        </Card>
      </div>

      {/* Correction Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Retroactive Correction Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Allowed Corrections</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Salary increases and promotions</li>
              <li>• Missing allowances and benefits</li>
              <li>• Tax calculation errors</li>
              <li>• Deduction waivers and penalties</li>
              <li>• Overtime and bonus adjustments</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Valid business justification</li>
              <li>• Supporting documentation</li>
              <li>• Approval from authorized personnel</li>
              <li>• Impact analysis for affected periods</li>
              <li>• Complete audit trail</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <RotateCcw className="w-4 h-4 mr-2" />
          Create New Correction
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Apply Selected Corrections
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Correction History</Button>
      </div>
    </div>
  );
};

export default RetroactiveCorrections;
