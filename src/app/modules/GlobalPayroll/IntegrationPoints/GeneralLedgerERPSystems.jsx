import React, { useState } from "react";
import { Database, BarChart3, Settings, Link, Eye, Download, CheckCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const GeneralLedgerERPSystems = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const integrations = [
    {
      id: 1,
      name: "SAP ERP Integration",
      description: "Enterprise resource planning and general ledger integration",
      status: "Active",
      lastSync: "2025-01-21 10:30:00",
      nextSync: "2025-01-21 11:00:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "Chart of accounts",
        "Journal entries",
        "Cost center mapping",
        "Financial reporting",
        "Budget allocations",
      ],
      icon: Database,
      color: "blue",
    },
    {
      id: 2,
      name: "Oracle Financials",
      description: "Financial management and accounting system integration",
      status: "Active",
      lastSync: "2025-01-21 10:15:00",
      nextSync: "2025-01-21 10:45:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "General ledger entries",
        "Account reconciliation",
        "Financial statements",
        "Tax calculations",
        "Audit trails",
      ],
      icon: BarChart3,
      color: "green",
    },
    {
      id: 3,
      name: "Microsoft Dynamics",
      description: "Business management and accounting integration",
      status: "Active",
      lastSync: "2025-01-21 10:00:00",
      nextSync: "2025-01-21 10:30:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "Payroll journal entries",
        "Employee cost tracking",
        "Department allocations",
        "Budget monitoring",
        "Financial analytics",
      ],
      icon: Database,
      color: "purple",
    },
    {
      id: 4,
      name: "Custom ERP System",
      description: "Custom enterprise resource planning integration",
      status: "Inactive",
      lastSync: "2025-01-20 18:00:00",
      nextSync: "Manual",
      frequency: "Manual",
      dataPoints: [
        "Custom account structures",
        "Manual journal entries",
        "Exception handling",
        "Policy overrides",
        "Reporting data",
      ],
      icon: Settings,
      color: "yellow",
    },
  ];

  const accountMappings = [
    {
      payrollAccount: "Payroll Expense",
      glAccount: "6000-001",
      description: "Employee salary and wages",
      costCenter: "HR-001",
      department: "Human Resources",
      status: "Active",
      icon: Database,
      color: "blue",
    },
    {
      payrollAccount: "Benefits Expense",
      glAccount: "6000-002",
      description: "Employee benefits and allowances",
      costCenter: "HR-002",
      department: "Human Resources",
      status: "Active",
      icon: BarChart3,
      color: "green",
    },
    {
      payrollAccount: "Tax Payable",
      glAccount: "2000-001",
      description: "Employee tax deductions",
      costCenter: "FIN-001",
      department: "Finance",
      status: "Active",
      icon: Database,
      color: "purple",
    },
    {
      payrollAccount: "Social Security Payable",
      glAccount: "2000-002",
      description: "Social security contributions",
      costCenter: "FIN-002",
      department: "Finance",
      status: "Active",
      icon: Settings,
      color: "yellow",
    },
  ];

  const syncHistory = [
    {
      id: 1,
      integration: "SAP ERP Integration",
      timestamp: "2025-01-21 10:30:00",
      status: "Success",
      recordsProcessed: 45,
      errors: 0,
      duration: "3.2s",
    },
    {
      id: 2,
      integration: "Oracle Financials",
      timestamp: "2025-01-21 10:15:00",
      status: "Success",
      recordsProcessed: 38,
      errors: 0,
      duration: "2.8s",
    },
    {
      id: 3,
      integration: "Microsoft Dynamics",
      timestamp: "2025-01-21 10:00:00",
      status: "Warning",
      recordsProcessed: 42,
      errors: 1,
      duration: "3.5s",
    },
    {
      id: 4,
      integration: "SAP ERP Integration",
      timestamp: "2025-01-21 09:30:00",
      status: "Success",
      recordsProcessed: 40,
      errors: 0,
      duration: "2.9s",
    },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
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
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General Ledger / ERP Accounting Systems Integration</h1>
          <p className="text-gray-600 mt-1">
            Integration with enterprise resource planning and accounting systems
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isSyncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Link className="w-4 h-4" />
                Sync All Systems
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
                  <Link className="w-3 h-3 mr-1" />
                  Sync Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Account Mappings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Mappings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Payroll Account</th>
                <th className="p-3 text-left">GL Account</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Cost Center</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accountMappings.map((mapping, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <mapping.icon className={`w-4 h-4 text-${mapping.color}-600`} />
                      <span className="font-semibold">{mapping.payrollAccount}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{mapping.glAccount}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{mapping.description}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {mapping.costCenter}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{mapping.department}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mapping.status)}`}>
                      {mapping.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Settings className="w-3 h-3 mr-1" />
                        Edit
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
                      <Database className="w-4 h-4 text-gray-400" />
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
            <h3 className="text-sm text-gray-600">Sync Success Rate</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">96%</p>
          <p className="text-sm text-gray-600 mt-1">Last 24 hours</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Journal Entries</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">165</p>
          <p className="text-sm text-gray-600 mt-1">Synced today</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Account Mappings</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">4</p>
          <p className="text-sm text-gray-600 mt-1">Active mappings</p>
        </Card>
      </div>

      {/* Integration Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Real-time journal entry synchronization</li>
              <li>• Accurate cost center mapping</li>
              <li>• Automated account reconciliation</li>
              <li>• Financial reporting integration</li>
              <li>• Compliance with accounting standards</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Chart of accounts consistency</li>
              <li>• Cost center validation</li>
              <li>• Department mapping accuracy</li>
              <li>• Financial period alignment</li>
              <li>• Audit trail maintenance</li>
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

export default GeneralLedgerERPSystems;
