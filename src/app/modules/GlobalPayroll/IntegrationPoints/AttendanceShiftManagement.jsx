import React, { useState } from "react";
import { Clock, Users, Calendar, Settings, Link, Eye, Download, CheckCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const AttendanceShiftManagement = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const integrations = [
    {
      id: 1,
      name: "TimeTrex Integration",
      description: "Real-time attendance data sync with TimeTrex system",
      status: "Active",
      lastSync: "2025-01-21 10:30:00",
      nextSync: "2025-01-21 11:00:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "Clock in/out times",
        "Break durations",
        "Overtime hours",
        "Shift schedules",
        "Attendance patterns",
      ],
      icon: Clock,
      color: "blue",
    },
    {
      id: 2,
      name: "Kronos Integration",
      description: "Shift management and workforce scheduling integration",
      status: "Active",
      lastSync: "2025-01-21 10:15:00",
      nextSync: "2025-01-21 10:45:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "Shift assignments",
        "Schedule changes",
        "Coverage requirements",
        "Labor costs",
        "Compliance tracking",
      ],
      icon: Calendar,
      color: "green",
    },
    {
      id: 3,
      name: "BambooHR Integration",
      description: "Employee attendance and time tracking integration",
      status: "Active",
      lastSync: "2025-01-21 10:00:00",
      nextSync: "2025-01-21 10:30:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "Employee time logs",
        "PTO balances",
        "Holiday schedules",
        "Work patterns",
        "Absence tracking",
      ],
      icon: Users,
      color: "purple",
    },
    {
      id: 4,
      name: "Custom API Integration",
      description: "Custom attendance system integration via REST API",
      status: "Inactive",
      lastSync: "2025-01-20 18:00:00",
      nextSync: "Manual",
      frequency: "Manual",
      dataPoints: [
        "Custom time entries",
        "Manual adjustments",
        "Exception handling",
        "Data validation",
        "Error reporting",
      ],
      icon: Settings,
      color: "yellow",
    },
  ];

  const syncHistory = [
    {
      id: 1,
      integration: "TimeTrex Integration",
      timestamp: "2025-01-21 10:30:00",
      status: "Success",
      recordsProcessed: 150,
      errors: 0,
      duration: "2.5s",
    },
    {
      id: 2,
      integration: "Kronos Integration",
      timestamp: "2025-01-21 10:15:00",
      status: "Success",
      recordsProcessed: 89,
      errors: 0,
      duration: "1.8s",
    },
    {
      id: 3,
      integration: "BambooHR Integration",
      timestamp: "2025-01-21 10:00:00",
      status: "Warning",
      recordsProcessed: 200,
      errors: 2,
      duration: "3.2s",
    },
    {
      id: 4,
      integration: "TimeTrex Integration",
      timestamp: "2025-01-21 09:30:00",
      status: "Success",
      recordsProcessed: 145,
      errors: 0,
      duration: "2.1s",
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
          <h1 className="text-2xl font-bold text-gray-900">Attendance & Shift Management Integration</h1>
          <p className="text-gray-600 mt-1">
            Real-time integration with attendance and shift management systems
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
                      <Clock className="w-4 h-4 text-gray-400" />
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
          <p className="text-3xl font-bold text-green-600">95%</p>
          <p className="text-sm text-gray-600 mt-1">Last 24 hours</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Records Synced</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">584</p>
          <p className="text-sm text-gray-600 mt-1">Today</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Employees Covered</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">150</p>
          <p className="text-sm text-gray-600 mt-1">Active employees</p>
        </Card>
      </div>

      {/* Integration Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Real-time sync for accurate payroll calculations</li>
              <li>• Error handling and retry mechanisms</li>
              <li>• Data validation before processing</li>
              <li>• Regular monitoring of sync status</li>
              <li>• Backup and recovery procedures</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Employee ID mapping consistency</li>
              <li>• Time zone handling for global operations</li>
              <li>• Holiday and exception day processing</li>
              <li>• Overtime calculation rules</li>
              <li>• Compliance with labor regulations</li>
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

export default AttendanceShiftManagement;
