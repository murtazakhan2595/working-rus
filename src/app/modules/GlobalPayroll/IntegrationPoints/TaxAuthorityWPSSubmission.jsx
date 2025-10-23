import React, { useState } from "react";
import { FileText, Upload, Settings, Link, Eye, Download, CheckCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const TaxAuthorityWPSSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const integrations = [
    {
      id: 1,
      name: "UAE WPS Portal",
      description: "Integration with UAE WPS (Wage Protection System) portal",
      status: "Active",
      lastSync: "2025-01-21 10:30:00",
      nextSync: "2025-01-21 11:00:00",
      frequency: "Monthly",
      dataPoints: [
        "SIF file generation",
        "Employee data validation",
        "Salary information",
        "Bank account details",
        "Submission status",
      ],
      icon: FileText,
      color: "blue",
    },
    {
      id: 2,
      name: "UK HMRC Portal",
      description: "Integration with UK HMRC (Her Majesty's Revenue and Customs)",
      status: "Active",
      lastSync: "2025-01-21 10:15:00",
      nextSync: "2025-01-21 10:45:00",
      frequency: "Monthly",
      dataPoints: [
        "PAYE submissions",
        "Tax calculations",
        "Employee records",
        "Pension contributions",
        "Compliance reporting",
      ],
      icon: Upload,
      color: "green",
    },
    {
      id: 3,
      name: "India Income Tax Portal",
      description: "Integration with India Income Tax Department portal",
      status: "Active",
      lastSync: "2025-01-21 10:00:00",
      nextSync: "2025-01-21 10:30:00",
      frequency: "Monthly",
      dataPoints: [
        "TDS submissions",
        "Form 16 generation",
        "Tax deductions",
        "Employee PAN validation",
        "Annual returns",
      ],
      icon: FileText,
      color: "purple",
    },
    {
      id: 4,
      name: "Pakistan FBR Portal",
      description: "Integration with Pakistan FBR (Federal Board of Revenue)",
      status: "Inactive",
      lastSync: "2025-01-20 18:00:00",
      nextSync: "Manual",
      frequency: "Manual",
      dataPoints: [
        "Tax submissions",
        "Employee records",
        "Salary information",
        "Deduction calculations",
        "Compliance reporting",
      ],
      icon: Settings,
      color: "yellow",
    },
  ];

  const submissionStatus = [
    {
      authority: "UAE WPS",
      lastSubmission: "2025-01-21 10:30:00",
      status: "Success",
      recordsSubmitted: 150,
      errors: 0,
      nextSubmission: "2025-02-21 10:30:00",
      icon: FileText,
      color: "blue",
    },
    {
      authority: "UK HMRC",
      lastSubmission: "2025-01-21 10:15:00",
      status: "Success",
      recordsSubmitted: 45,
      errors: 0,
      nextSubmission: "2025-02-21 10:15:00",
      icon: Upload,
      color: "green",
    },
    {
      authority: "India Income Tax",
      lastSubmission: "2025-01-21 10:00:00",
      status: "Warning",
      recordsSubmitted: 28,
      errors: 1,
      nextSubmission: "2025-02-21 10:00:00",
      icon: FileText,
      color: "purple",
    },
    {
      authority: "Pakistan FBR",
      lastSubmission: "2025-01-20 18:00:00",
      status: "Pending",
      recordsSubmitted: 0,
      errors: 0,
      nextSubmission: "Manual",
      icon: Settings,
      color: "yellow",
    },
  ];

  const complianceRequirements = [
    {
      country: "UAE",
      requirement: "WPS SIF File",
      frequency: "Monthly",
      deadline: "15th of each month",
      status: "Compliant",
      lastSubmission: "2025-01-15 10:30:00",
      icon: FileText,
      color: "blue",
    },
    {
      country: "UK",
      requirement: "PAYE Submission",
      frequency: "Monthly",
      deadline: "19th of each month",
      status: "Compliant",
      lastSubmission: "2025-01-19 10:15:00",
      icon: Upload,
      color: "green",
    },
    {
      country: "India",
      requirement: "TDS Submission",
      frequency: "Monthly",
      deadline: "7th of each month",
      status: "Compliant",
      lastSubmission: "2025-01-07 10:00:00",
      icon: FileText,
      color: "purple",
    },
    {
      country: "Pakistan",
      requirement: "Tax Return",
      frequency: "Annual",
      deadline: "September 30th",
      status: "Pending",
      lastSubmission: "2024-09-30 18:00:00",
      icon: Settings,
      color: "yellow",
    },
  ];

  const syncHistory = [
    {
      id: 1,
      integration: "UAE WPS Portal",
      timestamp: "2025-01-21 10:30:00",
      status: "Success",
      recordsProcessed: 150,
      errors: 0,
      duration: "2.5s",
    },
    {
      id: 2,
      integration: "UK HMRC Portal",
      timestamp: "2025-01-21 10:15:00",
      status: "Success",
      recordsProcessed: 45,
      errors: 0,
      duration: "1.8s",
    },
    {
      id: 3,
      integration: "India Income Tax Portal",
      timestamp: "2025-01-21 10:00:00",
      status: "Warning",
      recordsProcessed: 28,
      errors: 1,
      duration: "3.2s",
    },
    {
      id: 4,
      integration: "UAE WPS Portal",
      timestamp: "2025-01-20 18:00:00",
      status: "Success",
      recordsProcessed: 145,
      errors: 0,
      duration: "2.1s",
    },
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      case "Success":
        return "bg-green-100 text-green-700";
      case "Warning":
        return "bg-yellow-100 text-yellow-700";
      case "Error":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Compliant":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Authority / WPS Submission Portals</h1>
          <p className="text-gray-600 mt-1">
            Integration with tax authorities and WPS submission portals for compliance
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Submit All Portals
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Integration Systems */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <integration.icon className={`w-6 h-6 text-${integration.color}-600`} />
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-semibold">{integration.lastSync}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Sync:</span>
                  <span className="font-semibold">{integration.nextSync}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold">{integration.frequency}</span>
                </div>
              </div>
              <div className="mt-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Data Points:</h4>
                <div className="space-y-1">
                  {integration.dataPoints.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => setSelectedIntegration(integration)}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                  <Upload className="w-3 h-3 mr-1" />
                  Submit Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Submission Status */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissionStatus.map((status, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <status.icon className={`w-6 h-6 text-${status.color}-600`} />
                <h3 className="font-semibold text-gray-900">{status.authority}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Submission:</span>
                  <span className="font-semibold">{status.lastSubmission}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}>
                    {status.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Records Submitted:</span>
                  <span className="font-semibold">{status.recordsSubmitted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Errors:</span>
                  <span className={status.errors > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                    {status.errors}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Submission:</span>
                  <span className="font-semibold">{status.nextSubmission}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Requirements */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Requirements</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Requirement</th>
                <th className="p-3 text-left">Frequency</th>
                <th className="p-3 text-left">Deadline</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Last Submission</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complianceRequirements.map((requirement, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <requirement.icon className={`w-4 h-4 text-${requirement.color}-600`} />
                      <span className="font-semibold">{requirement.country}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{requirement.requirement}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{requirement.frequency}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{requirement.deadline}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                      {requirement.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{requirement.lastSubmission}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Upload className="w-3 h-3 mr-1" />
                        Submit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Integration Details */}
      {selectedIntegration && (
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Details: {selectedIntegration.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Configuration</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIntegration.status)}`}>
                    {selectedIntegration.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-semibold">{selectedIntegration.lastSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Sync:</span>
                  <span className="font-semibold">{selectedIntegration.nextSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold">{selectedIntegration.frequency}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Data Mapping</h3>
              <div className="space-y-1">
                {selectedIntegration.dataPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button className="bg-blue-600 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Configure Integration
            </Button>
            <Button onClick={() => setSelectedIntegration(null)} className="bg-gray-200 text-gray-700">
              Close Details
            </Button>
          </div>
        </Card>
      )}

      {/* Sync History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sync History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Integration</th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Records</th>
                <th className="p-3 text-left">Errors</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {syncHistory.map((sync) => (
                <tr key={sync.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{sync.integration}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{sync.timestamp}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sync.status)}`}>
                      {sync.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{sync.recordsProcessed}</span>
                  </td>
                  <td className="p-3">
                    <span className={sync.errors > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                      {sync.errors}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{sync.duration}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
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

      {/* Integration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Link className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Active Integrations</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">3</p>
          <p className="text-sm text-gray-600 mt-1">Systems connected</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Submission Success Rate</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">98%</p>
          <p className="text-sm text-gray-600 mt-1">Last 24 hours</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Records Submitted</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">223</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Compliance Rate</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">100%</p>
          <p className="text-sm text-gray-600 mt-1">All requirements met</p>
        </Card>
      </div>

      {/* Integration Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Automated submission scheduling</li>
              <li>• Data validation before submission</li>
              <li>• Error handling and retry mechanisms</li>
              <li>• Compliance monitoring and alerts</li>
              <li>• Audit trail maintenance</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Compliance Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Country-specific submission formats</li>
              <li>• Deadline monitoring and alerts</li>
              <li>• Data accuracy validation</li>
              <li>• Regulatory compliance tracking</li>
              <li>• Submission confirmation handling</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Link className="w-4 h-4 mr-2" />
          Configure New Integration
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Integration Report
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Integration Logs</Button>
      </div>
    </div>
  );
};

export default TaxAuthorityWPSSubmission;
