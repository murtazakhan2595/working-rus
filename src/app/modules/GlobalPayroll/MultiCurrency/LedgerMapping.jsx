import React, { useState } from "react";
import { BookOpen, Plus, Edit2, Trash2, Save, DollarSign } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const LedgerMapping = () => {
  const [isEditing, setIsEditing] = useState(false);

  const ledgerMappings = [
    {
      id: 1,
      currency: "USD",
      symbol: "$",
      salaryAccount: "5000-USD-SAL",
      taxAccount: "2100-USD-TAX",
      pfAccount: "2200-USD-PF",
      expenseAccount: "6000-USD-EXP",
      enabled: true,
    },
    {
      id: 2,
      currency: "GBP",
      symbol: "£",
      salaryAccount: "5000-GBP-SAL",
      taxAccount: "2100-GBP-TAX",
      pfAccount: "2200-GBP-NI",
      expenseAccount: "6000-GBP-EXP",
      enabled: true,
    },
    {
      id: 3,
      currency: "INR",
      symbol: "₹",
      salaryAccount: "5000-INR-SAL",
      taxAccount: "2100-INR-TAX",
      pfAccount: "2200-INR-PF",
      expenseAccount: "6000-INR-EXP",
      enabled: true,
    },
    {
      id: 4,
      currency: "PKR",
      symbol: "₨",
      salaryAccount: "5000-PKR-SAL",
      taxAccount: "2100-PKR-TAX",
      pfAccount: "2200-PKR-EOBI",
      expenseAccount: "6000-PKR-EXP",
      enabled: true,
    },
  ];

  const [currentMapping, setCurrentMapping] = useState({
    currency: "",
    symbol: "",
    salaryAccount: "",
    taxAccount: "",
    pfAccount: "",
    expenseAccount: "",
    enabled: true,
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ledger Mapping by Currency</h1>
          <p className="text-gray-600 mt-1">
            Separate ledger mapping for each currency
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Currency Mapping
        </Button>
      </div>

      {/* Ledger Mappings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ledgerMappings.map((mapping) => (
          <Card key={mapping.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{mapping.symbol}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mapping.currency}</h3>
                  <p className="text-sm text-gray-600">Currency Ledger</p>
                </div>
              </div>
              <Switch checked={mapping.enabled} />
            </div>

            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Salary Payable Account</p>
                <p className="font-mono font-semibold text-green-700">{mapping.salaryAccount}</p>
              </div>

              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Tax Payable Account</p>
                <p className="font-mono font-semibold text-red-700">{mapping.taxAccount}</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">PF/Social Security Account</p>
                <p className="font-mono font-semibold text-blue-700">{mapping.pfAccount}</p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Payroll Expense Account</p>
                <p className="font-mono font-semibold text-purple-700">{mapping.expenseAccount}</p>
              </div>

              <div className="pt-3 border-t">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mapping.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {mapping.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Ledger Accounts Summary */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ledger Accounts Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Salary Payable</th>
                <th className="p-3 text-left">Tax Payable</th>
                <th className="p-3 text-left">PF/Social Security</th>
                <th className="p-3 text-left">Expense Account</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {ledgerMappings.map((mapping) => (
                <tr key={mapping.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mapping.symbol}</span>
                      <span className="font-semibold">{mapping.currency}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-sm text-green-700">{mapping.salaryAccount}</td>
                  <td className="p-3 font-mono text-sm text-red-700">{mapping.taxAccount}</td>
                  <td className="p-3 font-mono text-sm text-blue-700">{mapping.pfAccount}</td>
                  <td className="p-3 font-mono text-sm text-purple-700">{mapping.expenseAccount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mapping.enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {mapping.enabled ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Account Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Coding Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Account Format</h3>
            <p className="text-sm text-gray-700">Format: [Account Code]-[Currency]-[Type]</p>
            <p className="text-sm text-gray-600 mt-1">Example: 5000-USD-SAL</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Account Types</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• SAL - Salary Payable</li>
              <li>• TAX - Tax Payable</li>
              <li>• PF - Provident Fund</li>
              <li>• EXP - Payroll Expense</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">Save All Mappings</Button>
        <Button className="bg-green-600 text-white">Sync with Accounting System</Button>
        <Button className="bg-gray-200 text-gray-700">Export Mappings</Button>
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Currency Ledger Mapping</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                  Currency
                </Label>
                <select
                  id="currency"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Currency</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                </select>
              </div>

              <div>
                <Label htmlFor="salaryAccount" className="text-sm font-medium text-gray-700">
                  Salary Payable Account
                </Label>
                <input
                  id="salaryAccount"
                  type="text"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g., 5000-AED-SAL"
                />
              </div>

              <div>
                <Label htmlFor="taxAccount" className="text-sm font-medium text-gray-700">
                  Tax Payable Account
                </Label>
                <input
                  id="taxAccount"
                  type="text"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g., 2100-AED-TAX"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white">
                <Save className="w-4 h-4" />
                Save Mapping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerMapping;

