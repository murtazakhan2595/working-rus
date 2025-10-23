import React, { useState } from "react";
import { Award, Calendar, DollarSign, Calculator } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const GratuityCalculation = () => {
  const [calculationType, setCalculationType] = useState("uae");

  const employees = [
    {
      id: 1,
      name: "Ahmed Hassan",
      emp_id: "EMP001",
      joinDate: "2020-01-15",
      lastWorkingDay: "2025-01-31",
      serviceYears: 5,
      lastSalary: 8000,
      gratuity: 13333,
    },
    {
      id: 2,
      name: "Fatima Ali",
      emp_id: "EMP002",
      joinDate: "2018-03-10",
      lastWorkingDay: "2025-02-28",
      serviceYears: 6.9,
      lastSalary: 9500,
      gratuity: 29833,
    },
    {
      id: 3,
      name: "Mohammed Khan",
      emp_id: "EMP003",
      joinDate: "2015-06-20",
      lastWorkingDay: "2025-01-15",
      serviceYears: 9.5,
      lastSalary: 12000,
      gratuity: 76000,
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">UAE End of Service & Gratuity</h1>
        <p className="text-gray-600 mt-1">
          Calculate End of Service benefits and Gratuity as per UAE Labor Law
        </p>
      </div>

      {/* Calculation Type */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Calculation Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setCalculationType("uae")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              calculationType === "uae"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <Award className={`w-8 h-8 mb-3 ${calculationType === "uae" ? "text-blue-600" : "text-gray-600"}`} />
            <h3 className="font-semibold text-lg">UAE Labor Law</h3>
            <p className="text-sm text-gray-600 mt-2">
              21 days for 1-5 years, 30 days for 5+ years
            </p>
          </div>

          <div
            onClick={() => setCalculationType("custom")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              calculationType === "custom"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <Calculator className={`w-8 h-8 mb-3 ${calculationType === "custom" ? "text-blue-600" : "text-gray-600"}`} />
            <h3 className="font-semibold text-lg">Custom Calculation</h3>
            <p className="text-sm text-gray-600 mt-2">
              Define your own gratuity calculation rules
            </p>
          </div>
        </div>
      </Card>

      {/* Calculation Rules */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">UAE Gratuity Calculation Rules</h2>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Service Period: 1-5 Years</h3>
                <p className="text-sm text-gray-600">21 days salary for each year of service</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Service Period: 5+ Years</h3>
                <p className="text-sm text-gray-600">
                  21 days for first 5 years + 30 days for each additional year
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Calculation Formula</h3>
                <p className="text-sm text-gray-600">Gratuity = (Last Basic Salary ÷ 30) × Number of Days</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Employee Gratuity Table */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Gratuity Calculations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Emp ID</th>
                <th className="p-3 text-left">Employee Name</th>
                <th className="p-3 text-left">Join Date</th>
                <th className="p-3 text-left">Last Working Day</th>
                <th className="p-3 text-left">Service Years</th>
                <th className="p-3 text-left">Last Salary</th>
                <th className="p-3 text-left">Gratuity Amount</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{emp.emp_id}</td>
                  <td className="p-3 font-medium">{emp.name}</td>
                  <td className="p-3">{emp.joinDate}</td>
                  <td className="p-3">{emp.lastWorkingDay}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {emp.serviceYears} years
                    </span>
                  </td>
                  <td className="p-3 font-semibold">${emp.lastSalary.toLocaleString()}</td>
                  <td className="p-3 text-xl font-bold text-green-600">
                    ${emp.gratuity.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td colSpan="6" className="p-3 text-right">TOTAL GRATUITY PAYABLE:</td>
                <td className="p-3 text-2xl text-blue-600">
                  ${employees.reduce((sum, emp) => sum + emp.gratuity, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Gratuity Calculator */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gratuity Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="joinDate" className="text-sm font-medium text-gray-700">
              Join Date
            </Label>
            <input
              id="joinDate"
              type="date"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="exitDate" className="text-sm font-medium text-gray-700">
              Exit Date
            </Label>
            <input
              id="exitDate"
              type="date"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="lastSalary" className="text-sm font-medium text-gray-700">
              Last Basic Salary
            </Label>
            <input
              id="lastSalary"
              type="number"
              placeholder="Enter amount"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Calculated Gratuity</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Service Period</p>
              <p className="text-2xl font-bold text-gray-900">5.5 years</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Eligible Days</p>
              <p className="text-2xl font-bold text-blue-600">120 days</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gratuity Amount</p>
              <p className="text-2xl font-bold text-green-600">$32,000</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button className="bg-blue-600 text-white">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Gratuity
          </Button>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-green-600 text-white">Export Gratuity Report</Button>
        <Button className="bg-blue-600 text-white">Process EOS Payments</Button>
        <Button className="bg-gray-200 text-gray-700">View History</Button>
      </div>
    </div>
  );
};

export default GratuityCalculation;

