import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, FileImage, Settings, Eye, Share2 } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const ExportTools = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedReports, setSelectedReports] = useState([]);

  const exportFormats = [
    {
      format: "PDF",
      description: "Portable Document Format",
      icon: FileText,
      color: "red",
      features: ["Print-ready", "Secure", "Branded"],
      fileSize: "2.5 MB",
      quality: "High",
    },
    {
      format: "Excel",
      description: "Microsoft Excel Spreadsheet",
      icon: FileSpreadsheet,
      color: "green",
      features: ["Editable", "Formulas", "Charts"],
      fileSize: "1.8 MB",
      quality: "High",
    },
    {
      format: "CSV",
      description: "Comma Separated Values",
      icon: FileText,
      color: "blue",
      features: ["Raw data", "Importable", "Lightweight"],
      fileSize: "0.8 MB",
      quality: "Medium",
    },
    {
      format: "Image",
      description: "PNG/JPEG Images",
      icon: FileImage,
      color: "purple",
      features: ["Visual", "Shareable", "Presentations"],
      fileSize: "3.2 MB",
      quality: "High",
    },
  ];

  const availableReports = [
    {
      id: 1,
      name: "Payroll Summary Report",
      type: "Summary",
      lastGenerated: "2025-01-21 10:30:00",
      size: "2.5 MB",
      format: "PDF",
      status: "Ready",
    },
    {
      id: 2,
      name: "Cost Center Analysis",
      type: "Analysis",
      lastGenerated: "2025-01-21 09:15:00",
      size: "1.8 MB",
      format: "Excel",
      status: "Ready",
    },
    {
      id: 3,
      name: "Statutory Compliance Report",
      type: "Compliance",
      lastGenerated: "2025-01-21 08:45:00",
      size: "3.2 MB",
      format: "PDF",
      status: "Ready",
    },
    {
      id: 4,
      name: "Forecast Report",
      type: "Forecast",
      lastGenerated: "2025-01-21 07:30:00",
      size: "2.1 MB",
      format: "Excel",
      status: "Ready",
    },
    {
      id: 5,
      name: "Employee Data Export",
      type: "Data",
      lastGenerated: "2025-01-20 16:30:00",
      size: "0.8 MB",
      format: "CSV",
      status: "Ready",
    },
  ];

  const exportHistory = [
    {
      id: 1,
      reportName: "Payroll Summary Report",
      format: "PDF",
      exportedAt: "2025-01-21 10:30:00",
      size: "2.5 MB",
      status: "Completed",
      downloadedBy: "John Doe",
    },
    {
      id: 2,
      reportName: "Cost Center Analysis",
      format: "Excel",
      exportedAt: "2025-01-21 09:15:00",
      size: "1.8 MB",
      status: "Completed",
      downloadedBy: "Sarah Johnson",
    },
    {
      id: 3,
      reportName: "Statutory Compliance Report",
      format: "PDF",
      exportedAt: "2025-01-21 08:45:00",
      size: "3.2 MB",
      status: "Failed",
      downloadedBy: "Mike Wilson",
    },
    {
      id: 4,
      reportName: "Forecast Report",
      format: "CSV",
      exportedAt: "2025-01-21 07:30:00",
      size: "0.8 MB",
      status: "Completed",
      downloadedBy: "Ahmed Ali",
    },
  ];

  const exportSettings = [
    {
      setting: "Auto-export",
      description: "Automatically export reports after generation",
      enabled: true,
    },
    {
      setting: "Email notifications",
      description: "Send email notifications when exports are ready",
      enabled: true,
    },
    {
      setting: "Compression",
      description: "Compress files to reduce size",
      enabled: false,
    },
    {
      setting: "Password protection",
      description: "Protect PDF files with passwords",
      enabled: true,
    },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      case "Ready":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export Tools</h1>
          <p className="text-gray-600 mt-1">
            Export reports to PDF, Excel, CSV, or image formats
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedReports.length === 0}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Selected
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share Reports
          </Button>
        </div>
      </div>

      {/* Export Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="format" className="text-sm font-medium text-gray-700">
              Export Format
            </Label>
            <select
              id="format"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="image">Image (PNG/JPEG)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="quality" className="text-sm font-medium text-gray-700">
              Quality
            </Label>
            <select
              id="quality"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High Quality</option>
              <option value="medium">Medium Quality</option>
              <option value="low">Low Quality</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <Label htmlFor="compression" className="text-sm font-medium text-gray-700">
              Compression
            </Label>
            <select
              id="compression"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">No Compression</option>
              <option value="low">Low Compression</option>
              <option value="medium">Medium Compression</option>
              <option value="high">High Compression</option>
            </select>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password Protection
            </Label>
            <input
              id="password"
              type="password"
              placeholder="Enter password (optional)"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Export Formats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {exportFormats.map((format, index) => (
          <Card key={index} className={`p-6 bg-${format.color}-50 border-${format.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <format.icon className={`w-6 h-6 text-${format.color}-600`} />
              <h3 className="font-semibold text-gray-900">{format.format}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{format.description}</p>
            <div className="space-y-1 text-xs text-gray-600 mb-3">
              <p>Size: {format.fileSize}</p>
              <p>Quality: {format.quality}</p>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              <p className="font-semibold">Features:</p>
              <ul className="list-disc list-inside">
                {format.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <Button className="w-full text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
              Select Format
            </Button>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Reports for Export</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports(availableReports.map(r => r.id));
                      } else {
                        setSelectedReports([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="p-3 text-left">Report Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Last Generated</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Format</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{report.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {report.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{report.lastGenerated}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{report.size}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{report.format}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Report Name</th>
                <th className="p-3 text-left">Format</th>
                <th className="p-3 text-left">Exported At</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Downloaded By</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exportHistory.map((exportItem) => (
                <tr key={exportItem.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{exportItem.reportName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{exportItem.format}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{exportItem.exportedAt}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{exportItem.size}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exportItem.status)}`}>
                      {exportItem.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{exportItem.downloadedBy}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Download className="w-3 h-3 mr-1" />
                        Re-download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exportSettings.map((setting, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{setting.setting}</h3>
                <div className={`w-4 h-4 rounded-full ${setting.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
              <p className="text-sm text-gray-600">{setting.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Exports</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">247</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">PDF Exports</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">156</p>
          <p className="text-sm text-gray-600 mt-1">63% of total</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <FileSpreadsheet className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Excel Exports</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">68</p>
          <p className="text-sm text-gray-600 mt-1">28% of total</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Success Rate</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">98.5%</p>
          <p className="text-sm text-gray-600 mt-1">Export success</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Selected Reports
        </Button>
        <Button className="bg-green-600 text-white">
          <Share2 className="w-4 h-4 mr-2" />
          Share Reports
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Export History</Button>
      </div>
    </div>
  );
};

export default ExportTools;
