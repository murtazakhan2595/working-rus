import React, { useState } from "react";
import { FileText, Download, Upload, CheckCircle, AlertCircle, Clock, Building2 } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const UAESIFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResults, setValidationResults] = useState(null);

  const sifFiles = [
    {
      id: 1,
      fileName: "WPS_SIF_20250121_001.sif",
      employeeCount: 150,
      totalAmount: 1250000,
      status: "Generated",
      generatedAt: "2025-01-21 10:30:00",
      bankCode: "ADCB",
      validationStatus: "Valid",
    },
    {
      id: 2,
      fileName: "WPS_SIF_20250120_002.sif",
      employeeCount: 89,
      totalAmount: 750000,
      status: "Pending",
      generatedAt: "2025-01-20 15:45:00",
      bankCode: "ENBD",
      validationStatus: "Valid",
    },
    {
      id: 3,
      fileName: "WPS_SIF_20250119_003.sif",
      employeeCount: 200,
      totalAmount: 1800000,
      status: "Failed",
      generatedAt: "2025-01-19 09:15:00",
      bankCode: "FAB",
      validationStatus: "Invalid",
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setValidationResults({
        totalEmployees: 150,
        validRecords: 148,
        invalidRecords: 2,
        totalAmount: 1250000,
        bankValidation: "Passed",
      });
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UAE WPS SIF File Generation</h1>
          <p className="text-gray-600 mt-1">
            Generate and validate UAE Wage Protection System (WPS) SIF files
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
        >
          {isGenerating ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate SIF File
            </>
          )}
        </Button>
      </div>

      {/* SIF Generation Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">SIF Generation Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="bankCode" className="text-sm font-medium text-gray-700">
              Bank Code
            </Label>
            <select
              id="bankCode"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ADCB">ADCB - Abu Dhabi Commercial Bank</option>
              <option value="ENBD">ENBD - Emirates NBD</option>
              <option value="FAB">FAB - First Abu Dhabi Bank</option>
              <option value="CBD">CBD - Commercial Bank of Dubai</option>
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
              <Label className="text-sm font-medium text-gray-700">Auto Validation</Label>
              <Switch defaultChecked />
            </div>
            <p className="text-xs text-gray-600">
              Automatically validate SIF file after generation
            </p>
          </div>
        </div>
      </Card>

      {/* Validation Results */}
      {validationResults && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">Validation Results</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{validationResults.totalEmployees}</p>
              <p className="text-sm text-gray-600">Total Employees</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{validationResults.validRecords}</p>
              <p className="text-sm text-gray-600">Valid Records</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{validationResults.invalidRecords}</p>
              <p className="text-sm text-gray-600">Invalid Records</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">AED {validationResults.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">✓</p>
              <p className="text-sm text-gray-600">{validationResults.bankValidation}</p>
            </div>
          </div>
        </Card>
      )}

      {/* SIF Files History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent SIF Files</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">File Name</th>
                <th className="p-3 text-left">Bank</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Amount (AED)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Validation</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sifFiles.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-sm">{file.fileName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{file.bankCode}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold">{file.employeeCount}</td>
                  <td className="p-3 font-semibold">{file.totalAmount.toLocaleString()}</td>
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
                    <div className="flex items-center gap-1">
                      {file.validationStatus === "Valid" ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-semibold">Valid</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-600 font-semibold">Invalid</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700">
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

      {/* WPS Compliance Info */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">UAE WPS Compliance Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">SIF File Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• File format: Fixed-width text (.sif)</li>
              <li>• Encoding: UTF-8</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Employee limit: 10,000 per file</li>
              <li>• Required fields: Employee ID, Name, Salary, Bank Details</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Submission Timeline</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Monthly submission deadline: 15th of each month</li>
              <li>• Processing time: 2-3 business days</li>
              <li>• Bank processing: 1-2 business days</li>
              <li>• Employee notification: Automatic SMS</li>
              <li>• Compliance reporting: Monthly</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate New SIF
        </Button>
        <Button className="bg-green-600 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload SIF File
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Compliance Report</Button>
      </div>
    </div>
  );
};

export default UAESIFGeneration;
