import React, { useState } from "react";
import { FileText, Download, Eye, Palette, Building2, Users, Settings } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const PDFPayslips = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("corporate");
  const [isGenerating, setIsGenerating] = useState(false);

  const pdfTemplates = [
    {
      id: 1,
      name: "Corporate Template",
      type: "corporate",
      description: "Professional design with company branding",
      preview: "corporate-preview.png",
      isDefault: true,
      downloads: 1250,
    },
    {
      id: 2,
      name: "Minimal Template",
      type: "minimal",
      description: "Clean and simple design",
      preview: "minimal-preview.png",
      isDefault: false,
      downloads: 890,
    },
    {
      id: 3,
      name: "Detailed Template",
      type: "detailed",
      description: "Comprehensive breakdown with charts",
      preview: "detailed-preview.png",
      isDefault: false,
      downloads: 650,
    },
  ];

  const recentPDFs = [
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP001",
      fileName: "Payslip_EMP001_Jan2025.pdf",
      generatedAt: "2025-01-21 10:30:00",
      fileSize: "245 KB",
      template: "Corporate",
      status: "Generated",
    },
    {
      id: 2,
      employeeName: "Sarah Johnson",
      employeeId: "EMP002",
      fileName: "Payslip_EMP002_Jan2025.pdf",
      generatedAt: "2025-01-21 10:32:00",
      fileSize: "238 KB",
      template: "Minimal",
      status: "Generated",
    },
    {
      id: 3,
      employeeName: "Ahmed Ali",
      employeeId: "EMP003",
      fileName: "Payslip_EMP003_Jan2025.pdf",
      generatedAt: "2025-01-21 10:35:00",
      fileSize: "312 KB",
      template: "Detailed",
      status: "Generating",
    },
  ];

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Generated":
        return "bg-green-100 text-green-700";
      case "Generating":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
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
          <h1 className="text-2xl font-bold text-gray-900">PDF Payslips with Branding</h1>
          <p className="text-gray-600 mt-1">
            Generate branded PDF payslips with customizable templates
          </p>
        </div>
        <Button
          onClick={handleGeneratePDF}
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
              <FileText className="w-4 h-4" />
              Generate PDFs
            </>
          )}
        </Button>
      </div>

      {/* Template Selection */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">PDF Template Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pdfTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedTemplate === template.type
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedTemplate(template.type)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                {template.isDefault && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="bg-gray-100 h-32 rounded flex items-center justify-center mb-3">
                <Palette className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{template.downloads} downloads</span>
                <span>{template.type}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Branding Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Branding Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="companyLogo" className="text-sm font-medium text-gray-700">
              Company Logo
            </Label>
            <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Logo</p>
              <p className="text-xs text-gray-500">PNG, JPG (max 2MB)</p>
            </div>
          </div>

          <div>
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
              Company Name
            </Label>
            <input
              id="companyName"
              type="text"
              placeholder="Your Company Name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="primaryColor" className="text-sm font-medium text-gray-700">
              Primary Color
            </Label>
            <input
              id="primaryColor"
              type="color"
              defaultValue="#3B82F6"
              className="w-full mt-1 h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Watermark</Label>
              <Switch />
            </div>
            <p className="text-xs text-gray-600">
              Add company watermark to PDFs
            </p>
          </div>
        </div>
      </Card>

      {/* PDF Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total PDFs</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">1,247</p>
          <p className="text-sm text-gray-600 mt-1">Generated this month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Downloads</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">892</p>
          <p className="text-sm text-gray-600 mt-1">Employee downloads</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">150</p>
          <p className="text-sm text-gray-600 mt-1">Employees</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Templates</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">3</p>
          <p className="text-sm text-gray-600 mt-1">Available designs</p>
        </Card>
      </div>

      {/* Recent PDFs */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent PDF Payslips</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">File Name</th>
                <th className="p-3 text-left">Template</th>
                <th className="p-3 text-left">File Size</th>
                <th className="p-3 text-left">Generated</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPDFs.map((pdf) => (
                <tr key={pdf.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{pdf.employeeName}</p>
                      <p className="text-xs text-gray-500">{pdf.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span className="font-mono text-sm">{pdf.fileName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {pdf.template}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{pdf.fileSize}</td>
                  <td className="p-3 text-sm text-gray-600">{pdf.generatedAt}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pdf.status)}`}>
                      {pdf.status}
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
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PDF Features */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">PDF Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Branding Options</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Company logo integration</li>
              <li>• Custom color schemes</li>
              <li>• Watermark support</li>
              <li>• Footer customization</li>
              <li>• Header branding</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Security Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Password protection</li>
              <li>• Digital signatures</li>
              <li>• Print restrictions</li>
              <li>• Copy protection</li>
              <li>• Expiry dates</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate All PDFs
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Bulk Download
        </Button>
        <Button className="bg-gray-200 text-gray-700">Customize Template</Button>
      </div>
    </div>
  );
};

export default PDFPayslips;
