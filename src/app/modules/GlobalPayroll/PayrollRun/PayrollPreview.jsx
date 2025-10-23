import React, { useState } from "react";
import { FileText, Download, CheckCircle, Eye, Send, DollarSign } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const PayrollPreview = () => {
  const [isFinalized, setIsFinalized] = useState(false);

  const employees = [
    { id: 1, name: "John Doe", emp_id: "EMP001", basic: 5000, allowances: 2000, deductions: 1400, net: 5600 },
    { id: 2, name: "Jane Smith", emp_id: "EMP002", basic: 4500, allowances: 1800, deductions: 1260, net: 5040 },
    { id: 3, name: "Mike Johnson", emp_id: "EMP003", basic: 5500, allowances: 2200, deductions: 1540, net: 6160 },
    { id: 4, name: "Sarah Williams", emp_id: "EMP004", basic: 4800, allowances: 1920, deductions: 1344, net: 5376 },
    { id: 5, name: "Tom Brown", emp_id: "EMP005", basic: 4200, allowances: 1680, deductions: 1176, net: 4704 },
  ];

  const handleFinalize = () => {
    if (window.confirm("Are you sure you want to finalize this payroll? This action cannot be undone.")) {
      setIsFinalized(true);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preview & Finalize Payroll</h1>
          <p className="text-gray-600 mt-1">
            Review all details before finalizing the payroll
          </p>
        </div>
        {!isFinalized ? (
          <Button
            onClick={handleFinalize}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4" />
            Finalize Payroll
          </Button>
        ) : (
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700">Payroll Finalized</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-sm text-gray-600 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">245</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <h3 className="text-sm text-gray-600 mb-2">Gross Salary</h3>
          <p className="text-3xl font-bold text-green-600">$125,000</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50">
          <h3 className="text-sm text-gray-600 mb-2">Deductions</h3>
          <p className="text-3xl font-bold text-red-600">$25,000</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50">
          <h3 className="text-sm text-gray-600 mb-2">Net Payable</h3>
          <p className="text-3xl font-bold text-purple-600">$100,000</p>
        </Card>
      </div>

      {/* Payroll Details */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payroll Details</h2>
          <div className="flex gap-2">
            <Button className="flex items-center gap-2 bg-blue-600 text-white">
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
            <Button className="flex items-center gap-2 bg-green-600 text-white">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Emp ID</th>
                <th className="p-3 text-left">Employee Name</th>
                <th className="p-3 text-left">Basic Salary</th>
                <th className="p-3 text-left">Allowances</th>
                <th className="p-3 text-left">Gross</th>
                <th className="p-3 text-left">Deductions</th>
                <th className="p-3 text-left">Net Salary</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{emp.emp_id}</td>
                  <td className="p-3 font-medium">{emp.name}</td>
                  <td className="p-3">${emp.basic.toLocaleString()}</td>
                  <td className="p-3">${emp.allowances.toLocaleString()}</td>
                  <td className="p-3 font-semibold">${(emp.basic + emp.allowances).toLocaleString()}</td>
                  <td className="p-3 text-red-600">${emp.deductions.toLocaleString()}</td>
                  <td className="p-3 font-bold text-blue-600 text-lg">${emp.net.toLocaleString()}</td>
                  <td className="p-3">
                    <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td colSpan="2" className="p-3">TOTAL</td>
                <td className="p-3">$24,000</td>
                <td className="p-3">$9,600</td>
                <td className="p-3">$33,600</td>
                <td className="p-3 text-red-600">$6,720</td>
                <td className="p-3 text-blue-600 text-xl">$26,880</td>
                <td className="p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payroll Information */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Period</p>
            <p className="font-semibold text-gray-900">January 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-semibold text-gray-900">Monthly</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Currency</p>
            <p className="font-semibold text-gray-900">USD ($)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isFinalized
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isFinalized ? "Finalized" : "Draft"}
            </span>
          </div>
        </div>
      </Card>

      {/* Finalization Checklist */}
      {!isFinalized && (
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pre-Finalization Checklist</h2>
          <div className="space-y-3">
            {[
              { id: 1, item: "All employees have complete bank details", checked: true },
              { id: 2, item: "Salary calculations are verified", checked: true },
              { id: 3, item: "Statutory deductions are accurate", checked: true },
              { id: 4, item: "Approval workflow is complete", checked: false },
              { id: 5, item: "No critical errors in validation", checked: true },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center ${
                    item.checked ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  {item.checked && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className={item.checked ? "text-gray-900" : "text-gray-500"}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex gap-3">
          {!isFinalized ? (
            <>
              <Button
                onClick={handleFinalize}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4" />
                Finalize Payroll
              </Button>
              <Button className="flex items-center gap-2 bg-blue-600 text-white">
                <Eye className="w-4 h-4" />
                Preview Report
              </Button>
              <Button className="flex items-center gap-2 bg-gray-200 text-gray-700">
                <Download className="w-4 h-4" />
                Download Draft
              </Button>
            </>
          ) : (
            <>
              <Button className="flex items-center gap-2 bg-blue-600 text-white">
                <Send className="w-4 h-4" />
                Send to Bank
              </Button>
              <Button className="flex items-center gap-2 bg-green-600 text-white">
                <Download className="w-4 h-4" />
                Download Payslips
              </Button>
              <Button className="flex items-center gap-2 bg-purple-600 text-white">
                <FileText className="w-4 h-4" />
                Generate Reports
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Success Message */}
      {isFinalized && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payroll Finalized Successfully!</h3>
              <p className="text-gray-600 mt-1">
                The payroll for January 2025 has been finalized. You can now send payments to the bank or download payslips.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PayrollPreview;

