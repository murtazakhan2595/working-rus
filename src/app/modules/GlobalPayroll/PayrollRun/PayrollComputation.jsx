import React, { useState } from "react";
import { DollarSign, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const PayrollComputation = () => {
  const [isComputing, setIsComputing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const currencies = [
    { code: "USD", symbol: "$", rate: 1.0 },
    { code: "GBP", symbol: "£", rate: 0.79 },
    { code: "EUR", symbol: "€", rate: 0.92 },
    { code: "INR", symbol: "₹", rate: 83.12 },
  ];

  const handleCompute = () => {
    setIsComputing(true);
    setTimeout(() => setIsComputing(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-Time Payroll Computation</h1>
          <p className="text-gray-600 mt-1">
            Calculate payroll with real-time currency conversion
          </p>
        </div>
        <Button
          onClick={handleCompute}
          disabled={isComputing}
          className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
        >
          {isComputing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Computing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Compute Payroll
            </>
          )}
        </Button>
      </div>

      {/* Currency Selection */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Currency Settings</h2>
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium text-gray-700">Base Currency:</Label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol})
              </option>
            ))}
          </select>
          <div className="ml-auto bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Exchange Rate: </span>
            <span className="font-bold text-blue-600">
              {currencies.find((c) => c.code === selectedCurrency)?.rate}
            </span>
          </div>
        </div>
      </Card>

      {/* Computation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Total Earnings</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {currencies.find((c) => c.code === selectedCurrency)?.symbol}
            125,000
          </p>
          <p className="text-sm text-gray-600 mt-1">245 employees</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-gray-900">Total Deductions</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {currencies.find((c) => c.code === selectedCurrency)?.symbol}
            25,000
          </p>
          <p className="text-sm text-gray-600 mt-1">Taxes & Contributions</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Net Payable</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {currencies.find((c) => c.code === selectedCurrency)?.symbol}
            100,000
          </p>
          <p className="text-sm text-gray-600 mt-1">After deductions</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Avg. Salary</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {currencies.find((c) => c.code === selectedCurrency)?.symbol}
            408
          </p>
          <p className="text-sm text-gray-600 mt-1">Per employee</p>
        </Card>
      </div>

      {/* Detailed Computation */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Computation Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Component</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Amount ({selectedCurrency})</th>
                <th className="p-3 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Basic Salary</td>
                <td className="p-3">245</td>
                <td className="p-3">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}75,000
                </td>
                <td className="p-3">60%</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">HRA</td>
                <td className="p-3">230</td>
                <td className="p-3">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}30,000
                </td>
                <td className="p-3">24%</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Transport Allowance</td>
                <td className="p-3">245</td>
                <td className="p-3">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}10,000
                </td>
                <td className="p-3">8%</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Other Allowances</td>
                <td className="p-3">180</td>
                <td className="p-3">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}10,000
                </td>
                <td className="p-3">8%</td>
              </tr>
              <tr className="border-b bg-green-50">
                <td className="p-3 font-bold">Total Earnings</td>
                <td className="p-3 font-bold">245</td>
                <td className="p-3 font-bold text-green-600">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}125,000
                </td>
                <td className="p-3 font-bold">100%</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-red-600">Income Tax</td>
                <td className="p-3">245</td>
                <td className="p-3 text-red-600">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}15,000
                </td>
                <td className="p-3">12%</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-red-600">Provident Fund</td>
                <td className="p-3">245</td>
                <td className="p-3 text-red-600">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}9,000
                </td>
                <td className="p-3">7.2%</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-red-600">Professional Tax</td>
                <td className="p-3">245</td>
                <td className="p-3 text-red-600">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}1,000
                </td>
                <td className="p-3">0.8%</td>
              </tr>
              <tr className="border-b bg-red-50">
                <td className="p-3 font-bold text-red-600">Total Deductions</td>
                <td className="p-3 font-bold">245</td>
                <td className="p-3 font-bold text-red-600">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}25,000
                </td>
                <td className="p-3 font-bold">20%</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="p-3 font-bold text-blue-600">Net Payable</td>
                <td className="p-3 font-bold">245</td>
                <td className="p-3 font-bold text-blue-600 text-xl">
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}100,000
                </td>
                <td className="p-3 font-bold">80%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">Save Computation</Button>
        <Button className="bg-green-600 text-white">Export Report</Button>
        <Button className="bg-gray-200 text-gray-700">Recalculate</Button>
      </div>
    </div>
  );
};

export default PayrollComputation;

