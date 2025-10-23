import React, { useState } from "react";
import { BarChart3, PieChart, Globe, TrendingUp, Users, DollarSign, Download } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const ConsolidatedDashboard = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");

  const payrollSummary = [
    {
      country: "United Kingdom",
      countryCode: "GB",
      currency: "GBP",
      employees: 65,
      grossSalary: 256750,
      deductions: 51350,
      netSalary: 205400,
      baseCurrencyNet: 260000,
    },
    {
      country: "India",
      countryCode: "IN",
      currency: "INR",
      employees: 120,
      grossSalary: 49872000,
      deductions: 9974400,
      netSalary: 39897600,
      baseCurrencyNet: 480000,
    },
    {
      country: "Pakistan",
      countryCode: "PK",
      currency: "PKR",
      employees: 40,
      grossSalary: 11114000,
      deductions: 2222800,
      netSalary: 8891200,
      baseCurrencyNet: 32000,
    },
    {
      country: "South Africa",
      countryCode: "ZA",
      currency: "ZAR",
      employees: 20,
      grossSalary: 1865000,
      deductions: 373000,
      netSalary: 1492000,
      baseCurrencyNet: 80000,
    },
  ];

  const totalEmployees = payrollSummary.reduce((sum, c) => sum + c.employees, 0);
  const totalNetInBase = payrollSummary.reduce((sum, c) => sum + c.baseCurrencyNet, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consolidated Multi-Country Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Unified reporting across all currencies and countries
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600 text-white">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Base Currency Selector */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-4">
          <DollarSign className="w-6 h-6 text-blue-600" />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Display in Base Currency
            </label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - US Dollar ($)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="EUR">EUR - Euro (€)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Global Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Employees</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalEmployees}</p>
          <p className="text-sm text-gray-600 mt-1">Across 4 countries</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Total Gross Salary</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">${totalNetInBase * 1.25}</p>
          <p className="text-sm text-gray-600 mt-1">In {baseCurrency}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Total Deductions</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">${(totalNetInBase * 0.25).toFixed(0)}</p>
          <p className="text-sm text-gray-600 mt-1">All currencies</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Net Payable</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">${totalNetInBase.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Consolidated</p>
        </Card>
      </div>

      {/* Country-wise Breakdown */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Country-wise Payroll Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Gross (Local)</th>
                <th className="p-3 text-left">Deductions (Local)</th>
                <th className="p-3 text-left">Net (Local)</th>
                <th className="p-3 text-left">Net ({baseCurrency})</th>
              </tr>
            </thead>
            <tbody>
              {payrollSummary.map((summary) => (
                <tr key={summary.countryCode} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{summary.country}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">
                      {summary.currency}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{summary.employees}</td>
                  <td className="p-3">{summary.grossSalary.toLocaleString()}</td>
                  <td className="p-3 text-red-600">{summary.deductions.toLocaleString()}</td>
                  <td className="p-3 font-bold">{summary.netSalary.toLocaleString()}</td>
                  <td className="p-3 font-bold text-blue-600 text-lg">
                    ${summary.baseCurrencyNet.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold text-lg">
                <td className="p-3" colSpan="2">
                  TOTAL
                </td>
                <td className="p-3">{totalEmployees}</td>
                <td className="p-3">-</td>
                <td className="p-3">-</td>
                <td className="p-3">-</td>
                <td className="p-3 text-blue-600 text-2xl">${totalNetInBase.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visual Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Distribution by Country</h3>
          </div>
          <div className="space-y-3">
            {payrollSummary.map((summary) => (
              <div key={summary.countryCode}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">{summary.country}</span>
                  <span className="font-semibold text-blue-600">
                    {((summary.baseCurrencyNet / totalNetInBase) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${(summary.baseCurrencyNet / totalNetInBase) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Employee Distribution</h3>
          </div>
          <div className="space-y-3">
            {payrollSummary.map((summary) => (
              <div key={summary.countryCode}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">{summary.country}</span>
                  <span className="font-semibold text-green-600">
                    {summary.employees} ({((summary.employees / totalEmployees) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${(summary.employees / totalEmployees) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Month-over-Month Comparison */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Month-over-Month Comparison</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Current Month</p>
            <p className="text-2xl font-bold text-gray-900">${totalNetInBase.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">January 2025</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Previous Month</p>
            <p className="text-2xl font-bold text-gray-900">$848,000</p>
            <p className="text-xs text-gray-500 mt-1">December 2024</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Change</p>
            <p className="text-2xl font-bold text-green-600">+$4,000</p>
            <p className="text-xs text-green-600 mt-1">+0.47%</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">YTD Total</p>
            <p className="text-2xl font-bold text-blue-600">$852,000</p>
            <p className="text-xs text-gray-500 mt-1">2025</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">Refresh Data</Button>
        <Button className="bg-green-600 text-white">Export Consolidated Report</Button>
        <Button className="bg-purple-600 text-white">View Detailed Analytics</Button>
      </div>
    </div>
  );
};

export default ConsolidatedDashboard;

