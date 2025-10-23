import React, { useState } from "react";
import { DollarSign, Globe, Eye } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";

const CurrencyDisplay = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [showDualCurrency, setShowDualCurrency] = useState(true);

  const employees = [
    {
      id: 1,
      name: "John Doe",
      country: "United Kingdom",
      localCurrency: "GBP",
      localSalary: 3950,
      baseSalary: 5000,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      country: "India",
      localCurrency: "INR",
      localSalary: 415600,
      baseSalary: 5000,
    },
    {
      id: 3,
      name: "Ahmed Ali",
      country: "Pakistan",
      localCurrency: "PKR",
      localSalary: 1389250,
      baseSalary: 5000,
    },
    {
      id: 4,
      name: "Sarah Williams",
      country: "South Africa",
      localCurrency: "ZAR",
      localSalary: 93250,
      baseSalary: 5000,
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Currency Display Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure base currency and local currency display
        </p>
      </div>

      {/* Display Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="baseCurrency" className="text-sm font-medium text-gray-700">
              Base Currency
            </Label>
            <select
              id="baseCurrency"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - US Dollar ($)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="EUR">EUR - Euro (€)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              All amounts will be calculated and reported in this currency
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Show Dual Currency</Label>
              <Switch
                checked={showDualCurrency}
                onCheckedChange={(checked) => setShowDualCurrency(checked)}
              />
            </div>
            <p className="text-xs text-gray-600">
              Display both base currency and local currency for employees
            </p>
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Display Preview</h2>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Preview Mode</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Country</th>
                {showDualCurrency ? (
                  <>
                    <th className="p-3 text-left">Local Currency Salary</th>
                    <th className="p-3 text-left">Base Currency ({baseCurrency})</th>
                  </>
                ) : (
                  <th className="p-3 text-left">Salary ({baseCurrency})</th>
                )}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{emp.name}</td>
                  <td className="p-3">{emp.country}</td>
                  {showDualCurrency ? (
                    <>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-600">
                            {emp.localCurrency === "GBP" && "£"}
                            {emp.localCurrency === "INR" && "₹"}
                            {emp.localCurrency === "PKR" && "₨"}
                            {emp.localCurrency === "ZAR" && "R"}
                            {emp.localSalary.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">({emp.localCurrency})</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-600">
                            ${emp.baseSalary.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">({baseCurrency})</span>
                        </div>
                      </td>
                    </>
                  ) : (
                    <td className="p-3">
                      <span className="font-bold text-gray-900 text-lg">
                        ${emp.baseSalary.toLocaleString()}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Display Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="font-semibold text-gray-900 mb-2">Base Currency Mode</h3>
          <p className="text-sm text-gray-600">All amounts displayed in {baseCurrency}</p>
          <div className="mt-4 bg-white p-3 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">$5,000</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <h3 className="font-semibold text-gray-900 mb-2">Local Currency Mode</h3>
          <p className="text-sm text-gray-600">Amounts in employee's local currency</p>
          <div className="mt-4 bg-white p-3 rounded-lg">
            <p className="text-2xl font-bold text-green-600">£3,950</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50">
          <h3 className="font-semibold text-gray-900 mb-2">Dual Currency Mode</h3>
          <p className="text-sm text-gray-600">Show both currencies</p>
          <div className="mt-4 bg-white p-3 rounded-lg">
            <p className="text-lg font-bold text-purple-600">£3,950 ($5,000)</p>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">Save Display Settings</Button>
        <Button className="bg-gray-200 text-gray-700">Reset to Default</Button>
      </div>
    </div>
  );
};

export default CurrencyDisplay;

