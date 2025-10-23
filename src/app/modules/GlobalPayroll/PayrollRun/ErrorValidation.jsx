import React, { useState } from "react";
import { AlertCircle, CheckCircle, XCircle, Zap, RefreshCw } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const ErrorValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validationResults = [
    { id: 1, type: "success", category: "Data Integrity", message: "All employee records are complete", count: 245 },
    { id: 2, type: "success", category: "Calculations", message: "All salary calculations are accurate", count: 245 },
    { id: 3, type: "warning", category: "Bank Details", message: "3 employees have missing bank details", count: 3 },
    { id: 4, type: "error", category: "Tax Calculation", message: "2 employees have incorrect tax slabs", count: 2 },
    { id: 5, type: "success", category: "Compliance", message: "All statutory deductions are compliant", count: 245 },
  ];

  const anomalies = [
    { id: 1, employee: "John Doe (EMP001)", issue: "Salary increased by 45%", severity: "high", aiScore: 0.92 },
    { id: 2, employee: "Jane Smith (EMP002)", issue: "Overtime hours exceed normal by 3x", severity: "medium", aiScore: 0.78 },
    { id: 3, employee: "Mike Johnson (EMP003)", issue: "Deductions lower than usual", severity: "low", aiScore: 0.65 },
  ];

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => setIsValidating(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Error Validation & AI Anomaly Detection</h1>
          <p className="text-gray-600 mt-1">
            Validate payroll data and detect anomalies using AI
          </p>
        </div>
        <Button
          onClick={handleValidate}
          disabled={isValidating}
          className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
        >
          {isValidating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Run Validation
            </>
          )}
        </Button>
      </div>

      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-green-50">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Passed</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">3</p>
          <p className="text-sm text-gray-600 mt-1">Validation checks</p>
        </Card>

        <Card className="p-6 bg-yellow-50">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">Warnings</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">1</p>
          <p className="text-sm text-gray-600 mt-1">Needs attention</p>
        </Card>

        <Card className="p-6 bg-red-50">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-gray-900">Errors</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">1</p>
          <p className="text-sm text-gray-600 mt-1">Must be fixed</p>
        </Card>
      </div>

      {/* Validation Results */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Validation Results</h2>
        <div className="space-y-3">
          {validationResults.map((result) => (
            <div
              key={result.id}
              className={`p-4 rounded-lg border-l-4 ${
                result.type === "success"
                  ? "bg-green-50 border-green-600"
                  : result.type === "warning"
                  ? "bg-yellow-50 border-yellow-600"
                  : "bg-red-50 border-red-600"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {result.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : result.type === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{result.category}</h3>
                    <p className="text-sm text-gray-700 mt-1">{result.message}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">{result.count} records</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Anomaly Detection */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-violet-50">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Anomaly Detection</h2>
          <span className="ml-auto px-3 py-1 bg-purple-600 text-white text-sm rounded-full">POWERED BY AI</span>
        </div>
        <p className="text-gray-600 mb-4">
          AI has detected {anomalies.length} potential anomalies in this payroll run
        </p>

        <div className="space-y-3">
          {anomalies.map((anomaly) => (
            <Card key={anomaly.id} className="p-4 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{anomaly.employee}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        anomaly.severity === "high"
                          ? "bg-red-100 text-red-700"
                          : anomaly.severity === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {anomaly.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{anomaly.issue}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">AI Confidence Score:</span>
                    <div className="flex-1 max-w-[200px] bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${anomaly.aiScore * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-purple-600">{(anomaly.aiScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">Investigate</Button>
                  <Button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700">Dismiss</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">Fix All Errors</Button>
        <Button className="bg-green-600 text-white">Proceed Anyway</Button>
        <Button className="bg-gray-200 text-gray-700">Export Report</Button>
      </div>
    </div>
  );
};

export default ErrorValidation;

