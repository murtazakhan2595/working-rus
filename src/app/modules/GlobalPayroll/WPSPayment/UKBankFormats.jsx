import React, { useState } from "react";
import { FileSpreadsheet, Download, Upload, Building2, PoundSterling } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const UKBankFormats = () => {
  const [selectedFormat, setSelectedFormat] = useState("CSV");
  const [isGenerating, setIsGenerating] = useState(false);

  const bankFiles = [
    {
      id: 1,
      fileName: "UK_Payroll_20250121.csv",
      bankName: "Barclays Bank",
      employeeCount: 75,
      totalAmount: 125000,
      format: "CSV",
      status: "Generated",
      generatedAt: "2025-01-21 10:30:00",
    },
    {
      id: 2,
      fileName: "UK_Payroll_20250120.xml",
      bankName: "HSBC UK",
      employeeCount: 120,
      totalAmount: 200000,
      format: "XML",
      status: "Pending",
      generatedAt: "2025-01-20 15:45:00",
    },
    {
      id: 3,
      fileName: "UK_Payroll_20250119.csv",
      bankName: "Lloyds Bank",
      employeeCount: 95,
      totalAmount: 150000,
      format: "CSV",
      status: "Failed",
      generatedAt: "2025-01-19 09:15:00",
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UK Bank Transfer Formats</h1>
          <p className="text-gray-600 mt-1">
            Generate CSV and XML files for UK bank transfers
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              Generate File
            </>
          )}
        </Button>
      </div>

      {/* File Format Selection */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">File Format Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="format" className="text-sm font-medium text-gray-700">
              File Format
            </Label>
            <select
              id="format"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CSV">CSV Format</option>
              <option value="XML">XML Format</option>
            </select>
          </div>

          <div>
            <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
              Bank Name
            </Label>
            <select
              id="bankName"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BARCLAYS">Barclays Bank</option>
              <option value="HSBC">HSBC UK</option>
              <option value="LLOYDS">Lloyds Bank</option>
              <option value="NATWEST">NatWest</option>
              <option value="SANTANDER">Santander UK</option>
            </select>
          </div>

          <div>
            <Label htmlFor="payPeriod" className="text-sm font-medium text-gray-700">
              Pay Period
            </Label>
            <input
              id="payPeriod"
              type="month"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="2025-01"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Auto Upload</Label>
              <Switch />
            </div>
            <p className="text-xs text-gray-600">
              Automatically upload to bank portal
            </p>
          </div>
        </div>
      </Card>

      {/* Format Preview */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedFormat} Format Preview
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          {selectedFormat === "CSV" ? (
            <pre>{`EmployeeID,FirstName,LastName,AccountNumber,SortCode,Amount,Reference
EMP001,John,Doe,12345678,20-12-34,2500.00,SALARY-JAN2025
EMP002,Jane,Smith,87654321,40-56-78,3200.00,SALARY-JAN2025
EMP003,Bob,Johnson,11223344,60-78-90,2800.00,SALARY-JAN2025`}</pre>
          ) : (
            <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<payroll>
  <employee>
    <id>EMP001</id>
    <name>John Doe</name>
    <account>12345678</account>
    <sortcode>20-12-34</sortcode>
    <amount>2500.00</amount>
    <reference>SALARY-JAN2025</reference>
  </employee>
  <employee>
    <id>EMP002</id>
    <name>Jane Smith</name>
    <account>87654321</account>
    <sortcode>40-56-78</sortcode>
    <amount>3200.00</amount>
    <reference>SALARY-JAN2025</reference>
  </employee>
</payroll>`}</pre>
          )}
        </div>
      </Card>

      {/* Bank Files History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bank Files</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">File Name</th>
                <th className="p-3 text-left">Bank</th>
                <th className="p-3 text-left">Format</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Amount (£)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankFiles.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-sm">{file.fileName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{file.bankName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {file.format}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{file.employeeCount}</td>
                  <td className="p-3 font-semibold">
                    <div className="flex items-center gap-1">
                      <PoundSterling className="w-3 h-3" />
                      {file.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        file.status === "Generated"
                          ? "bg-green-100 text-green-700"
                          : file.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {file.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* UK Banking Standards */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">UK Banking Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">CSV Format Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Encoding: UTF-8</li>
              <li>• Delimiter: Comma (,)</li>
              <li>• Headers: Required</li>
              <li>• Sort Code: XX-XX-XX format</li>
              <li>• Account Number: 8 digits</li>
              <li>• Amount: Decimal format (2 places)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">XML Format Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• XML Version: 1.0</li>
              <li>• Encoding: UTF-8</li>
              <li>• Schema: Bank-specific</li>
              <li>• Validation: XSD schema</li>
              <li>• Namespace: Required</li>
              <li>• Elements: Case-sensitive</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Generate {selectedFormat} File
        </Button>
        <Button className="bg-green-600 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload to Bank
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Bank Standards</Button>
      </div>
    </div>
  );
};

export default UKBankFormats;
