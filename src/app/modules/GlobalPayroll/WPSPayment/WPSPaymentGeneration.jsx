import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { generateWPSFile } from "state/slices/GlobalPayrollSlice";
import { Download, FileText, CheckCircle, AlertTriangle, Upload } from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Badge } from "components/ui/badge";
import { validateWPSData } from "utils/payrollUtils";
import { toast } from "react-toastify";

const WPSPaymentGeneration = () => {
  const dispatch = useDispatch();
  const [selectedPayrollRun, setSelectedPayrollRun] = useState("");
  const [fileFormat, setFileFormat] = useState("SIF");
  const [validationResult, setValidationResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock payroll runs
  const payrollRuns = [
    { id: 1, period: "December 2024", country: "UAE", employees: 150 },
    { id: 2, period: "November 2024", country: "UAE", employees: 145 },
  ];

  // Mock WPS files
  const wpsFiles = [
    {
      id: 1,
      filename: "WPS_DEC2024_UAE.sif",
      period: "December 2024",
      employees: 150,
      amount: 2500000,
      status: "Generated",
      generated_at: "2024-12-25 10:30 AM",
    },
    {
      id: 2,
      filename: "WPS_NOV2024_UAE.sif",
      period: "November 2024",
      employees: 145,
      amount: 2450000,
      status: "Downloaded",
      generated_at: "2024-11-25 09:15 AM",
    },
  ];

  const handleValidate = () => {
    // Mock validation
    const mockEmployees = [
      { employee_id: "E001", salary: 15000, iban: "AE070331234567890123456" },
      { employee_id: "E002", salary: 12000, iban: "AE070331234567890123457" },
    ];

    const validation = validateWPSData(mockEmployees);
    setValidationResult(validation);

    if (validation.isValid) {
      toast.success("Validation successful! Ready to generate WPS file.");
    } else {
      toast.error(`Validation failed with ${validation.errors.length} errors`);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      await dispatch(generateWPSFile({
        payroll_run_id: selectedPayrollRun,
        format: fileFormat,
      })).unwrap();
      
      toast.success("WPS file generated successfully!");
      setValidationResult(null);
    } catch (error) {
      toast.error("Failed to generate WPS file");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          WPS & International Payment File Generation
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Generate WPS files for UAE and payment files for UK & Africa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Payment File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Payroll Run *</Label>
                <Select value={selectedPayrollRun} onValueChange={setSelectedPayrollRun}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payroll run" />
                  </SelectTrigger>
                  <SelectContent>
                    {payrollRuns.map((run) => (
                      <SelectItem key={run.id} value={run.id.toString()}>
                        {run.period} - {run.country} ({run.employees} employees)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>File Format</Label>
                <Select value={fileFormat} onValueChange={setFileFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIF">SIF (UAE WPS)</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="XML">XML</SelectItem>
                    <SelectItem value="BACS">BACS (UK)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleValidate}
                  disabled={!selectedPayrollRun}
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Validate Data
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedPayrollRun || !validationResult?.isValid || isGenerating}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {isGenerating ? "Generating..." : "Generate File"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Validation Results */}
          {validationResult && (
            <Card className={validationResult.isValid ? "border-green-500" : "border-red-500"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {validationResult.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  Validation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Records</p>
                    <p className="text-2xl font-bold">{validationResult.totalRecords}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Valid Records</p>
                    <p className="text-2xl font-bold text-green-600">
                      {validationResult.validRecords}
                    </p>
                  </div>
                </div>

                {validationResult.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
                    <div className="space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">
                          Row {error.row}: {error.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-yellow-600 mb-2">Warnings:</h4>
                    <div className="space-y-1">
                      {validationResult.warnings.map((warning, index) => (
                        <p key={index} className="text-sm text-yellow-600">
                          Row {warning.row}: {warning.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Generated Files */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wpsFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-semibold">{file.filename}</p>
                        <p className="text-sm text-gray-500">
                          {file.period} · {file.employees} employees · AED{" "}
                          {file.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">{file.generated_at}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          file.status === "Generated"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }
                      >
                        {file.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WPS Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">UAE WPS Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Valid Employee ID</li>
                  <li>Valid IBAN (23 characters)</li>
                  <li>Salary breakdown required</li>
                  <li>Payment date within allowed window</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">UK BACS Format:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Sort code (6 digits)</li>
                  <li>Account number (8 digits)</li>
                  <li>Payment reference</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Approval</span>
                  <Badge variant="secondary">2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ready for Payment</span>
                  <Badge className="bg-green-500">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processed</span>
                  <Badge className="bg-blue-500">12</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WPSPaymentGeneration;

