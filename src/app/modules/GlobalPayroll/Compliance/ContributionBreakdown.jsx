import React, { useState } from "react";
import { PieChart, Users, Building2, Download } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const ContributionBreakdown = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("january-2025");

  const contributions = [
    {
      id: 1,
      component: "Provident Fund",
      employeeContribution: 28800,
      employerContribution: 28800,
      total: 57600,
      employees: 240,
    },
    {
      id: 2,
      component: "ESI",
      employeeContribution: 15937,
      employerContribution: 69094,
      total: 85031,
      employees: 85,
    },
    {
      id: 3,
      component: "National Insurance (UK)",
      employeeContribution: 23400,
      employerContribution: 26910,
      total: 50310,
      employees: 65,
    },
    {
      id: 4,
      component: "EOBI (Pakistan)",
      employeeContribution: 4800,
      employerContribution: 24000,
      total: 28800,
      employees: 40,
    },
  ];

  const totalEmployeeContrib = contributions.reduce((sum, c) => sum + c.employeeContribution, 0);
  const totalEmployerContrib = contributions.reduce((sum, c) => sum + c.employerContribution, 0);
  const grandTotal = totalEmployeeContrib + totalEmployerContrib;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contribution Breakdown</h1>
          <p className="text-gray-600 mt-1">
            Employer and employee contribution breakdown
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600 text-white">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Period Selection */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium text-gray-700">Select Period:</Label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="january-2025">January 2025</option>
            <option value="december-2024">December 2024</option>
            <option value="november-2024">November 2024</option>
          </select>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Employee Contribution</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">${totalEmployeeContrib.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Deducted from salary</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Employer Contribution</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">${totalEmployerContrib.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Company expense</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-2">
            <PieChart className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Total Contribution</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">${grandTotal.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Combined statutory payments</p>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown by Component</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Component</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Employee Contribution</th>
                <th className="p-3 text-left">Employer Contribution</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((contrib) => (
                <tr key={contrib.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{contrib.component}</td>
                  <td className="p-3">{contrib.employees}</td>
                  <td className="p-3 text-green-600 font-semibold">
                    ${contrib.employeeContribution.toLocaleString()}
                  </td>
                  <td className="p-3 text-purple-600 font-semibold">
                    ${contrib.employerContribution.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold">${contrib.total.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                      {((contrib.total / grandTotal) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold text-lg">
                <td className="p-3">TOTAL</td>
                <td className="p-3">{contributions.reduce((sum, c) => sum + c.employees, 0)}</td>
                <td className="p-3 text-green-600">${totalEmployeeContrib.toLocaleString()}</td>
                <td className="p-3 text-purple-600">${totalEmployerContrib.toLocaleString()}</td>
                <td className="p-3 text-blue-600">${grandTotal.toLocaleString()}</td>
                <td className="p-3">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visual Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">Employee vs Employer Split</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Employee (Deducted from salary)</span>
                <span className="font-semibold text-green-600">
                  {((totalEmployeeContrib / grandTotal) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${(totalEmployeeContrib / grandTotal) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Employer (Company expense)</span>
                <span className="font-semibold text-purple-600">
                  {((totalEmployerContrib / grandTotal) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-purple-600 h-4 rounded-full"
                  style={{ width: `${(totalEmployerContrib / grandTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">Contribution by Component</h3>
          <div className="space-y-3">
            {contributions.map((contrib) => (
              <div key={contrib.id}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">{contrib.component}</span>
                  <span className="font-semibold text-blue-600">
                    ${contrib.total.toLocaleString()} ({((contrib.total / grandTotal) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(contrib.total / grandTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContributionBreakdown;

