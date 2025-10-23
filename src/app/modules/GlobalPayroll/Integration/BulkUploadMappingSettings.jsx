import React, { useState } from "react";
import { Upload, Download, FileText, CheckCircle, AlertCircle, ArrowRight, Settings as SettingsIcon } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const BulkUploadMappingSettings = () => {
  const [uploadHistory, setUploadHistory] = useState([
    {
      id: 1,
      fileName: "employees_jan_2025.xlsx",
      uploadDate: "2025-01-21 10:30:00",
      status: "success",
      recordsProcessed: 245,
      recordsSuccess: 245,
      recordsFailed: 0,
      uploadedBy: "John Doe",
    },
    {
      id: 2,
      fileName: "salary_components_dec.csv",
      uploadDate: "2025-01-15 14:20:00",
      status: "partial",
      recordsProcessed: 150,
      recordsSuccess: 145,
      recordsFailed: 5,
      uploadedBy: "Jane Smith",
    },
    {
      id: 3,
      fileName: "contractor_data.xlsx",
      uploadDate: "2025-01-10 09:15:00",
      status: "failed",
      recordsProcessed: 50,
      recordsSuccess: 0,
      recordsFailed: 50,
      uploadedBy: "Mike Johnson",
    },
  ]);

  const [fieldMappings, setFieldMappings] = useState([
    {
      id: 1,
      sourceField: "emp_id",
      targetField: "employee_id",
      dataType: "String",
      required: true,
      enabled: true,
    },
    {
      id: 2,
      sourceField: "full_name",
      targetField: "employee_name",
      dataType: "String",
      required: true,
      enabled: true,
    },
    {
      id: 3,
      sourceField: "basic_pay",
      targetField: "basic_salary",
      dataType: "Number",
      required: true,
      enabled: true,
    },
    {
      id: 4,
      sourceField: "email_address",
      targetField: "email",
      dataType: "String",
      required: false,
      enabled: true,
    },
    {
      id: 5,
      sourceField: "department_name",
      targetField: "department",
      dataType: "String",
      required: false,
      enabled: true,
    },
  ]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      const newUpload = {
        id: Date.now(),
        fileName: selectedFile.name,
        uploadDate: new Date().toLocaleString(),
        status: "success",
        recordsProcessed: Math.floor(Math.random() * 300),
        recordsSuccess: Math.floor(Math.random() * 290) + 10,
        recordsFailed: Math.floor(Math.random() * 10),
        uploadedBy: "Current User",
      };
      setUploadHistory([newUpload, ...uploadHistory]);
      setSelectedFile(null);
      setIsUploading(false);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    // Simulate template download
    alert("Downloading Excel template with mapped fields...");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "partial":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "partial":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Upload & Mapping</h1>
          <p className="text-gray-600 mt-1">
            Upload employee data in bulk with field mapping support
          </p>
        </div>
        <Button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="w-4 h-4" />
          Download Template
        </Button>
      </div>

      {/* Upload Section */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Upload Employee Data</h3>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: .xlsx, .xls, .csv (Max size: 10MB)
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-medium transition-colors">
                Select File
              </span>
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedFile(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
                >
                  {isUploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please ensure your file follows the template format and
              all required fields are populated before uploading.
            </p>
          </div>
        </div>
      </Card>

      {/* Field Mapping */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Field Mapping Configuration</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Source Field (Excel/CSV)
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  <ArrowRight className="w-5 h-5 mx-auto" />
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Target Field (System)
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Data Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Required
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {fieldMappings.map((mapping) => (
                <tr key={mapping.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                      {mapping.sourceField}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                      {mapping.targetField}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {mapping.dataType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        mapping.required
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {mapping.required ? "Required" : "Optional"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
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

      {/* Upload History */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Upload History</h3>
        </div>

        <div className="space-y-3">
          {uploadHistory.map((upload) => (
            <Card
              key={upload.id}
              className="p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(upload.status)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{upload.fileName}</h4>
                    <p className="text-xs text-gray-600">
                      Uploaded by {upload.uploadedBy} on {upload.uploadDate}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    upload.status
                  )}`}
                >
                  {upload.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-600">Total Processed</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {upload.recordsProcessed}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Successful</p>
                  <p className="text-lg font-semibold text-green-600">{upload.recordsSuccess}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Failed</p>
                  <p className="text-lg font-semibold text-red-600">{upload.recordsFailed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Success Rate</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {((upload.recordsSuccess / upload.recordsProcessed) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {upload.recordsFailed > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                    <Download className="w-3 h-3 mr-1" />
                    Download Error Report
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* Quick Guide */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Download Template</h4>
              <p className="text-sm text-gray-600">
                Get the Excel template with pre-mapped field headers
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Fill Employee Data</h4>
              <p className="text-sm text-gray-600">
                Populate the template with employee information
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Upload & Verify</h4>
              <p className="text-sm text-gray-600">
                Upload the file and verify the mapped data
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BulkUploadMappingSettings;

