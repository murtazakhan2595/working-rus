import React, { useState } from "react";
import { RefreshCw, Database, CheckCircle, AlertCircle, Clock, Play, Settings as SettingsIcon } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const EmployeeMasterSyncSettings = () => {
  const [syncSettings, setSyncSettings] = useState({
    autoSyncEnabled: true,
    syncFrequency: "hourly",
    lastSyncTime: "2025-01-21 10:30:00",
    syncStatus: "success",
    syncOnEmployeeCreation: true,
    syncOnEmployeeUpdate: true,
    syncOnEmployeeTermination: true,
    realTimeSync: false,
    batchSync: true,
  });

  const [syncHistory, setSyncHistory] = useState([
    {
      id: 1,
      timestamp: "2025-01-21 10:30:00",
      status: "success",
      recordsSynced: 245,
      duration: "2m 15s",
      type: "Scheduled",
    },
    {
      id: 2,
      timestamp: "2025-01-21 08:30:00",
      status: "success",
      recordsSynced: 12,
      duration: "0m 45s",
      type: "Manual",
    },
    {
      id: 3,
      timestamp: "2025-01-21 06:30:00",
      status: "partial",
      recordsSynced: 230,
      duration: "3m 05s",
      type: "Scheduled",
      errors: 3,
    },
    {
      id: 4,
      timestamp: "2025-01-20 22:30:00",
      status: "failed",
      recordsSynced: 0,
      duration: "0m 10s",
      type: "Scheduled",
      errors: 15,
    },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSettingChange = (key, value) => {
    setSyncSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      const newSync = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        status: "success",
        recordsSynced: Math.floor(Math.random() * 300),
        duration: `${Math.floor(Math.random() * 5)}m ${Math.floor(Math.random() * 60)}s`,
        type: "Manual",
      };
      setSyncHistory([newSync, ...syncHistory]);
      setSyncSettings((prev) => ({
        ...prev,
        lastSyncTime: newSync.timestamp,
        syncStatus: "success",
      }));
    }, 3000);
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
        return <Clock className="w-5 h-5 text-gray-600" />;
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
          <h1 className="text-2xl font-bold text-gray-900">Employee Master Sync</h1>
          <p className="text-gray-600 mt-1">
            Automatic synchronization with Employee Master data
          </p>
        </div>
        <Button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Manual Sync
            </>
          )}
        </Button>
      </div>

      {/* Sync Status Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
              <p className="text-sm text-gray-600">
                Last synced: {syncSettings.lastSyncTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(syncSettings.syncStatus)}
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                syncSettings.syncStatus
              )}`}
            >
              {syncSettings.syncStatus === "success" ? "All Systems Operational" : "Check Logs"}
            </span>
          </div>
        </div>
      </Card>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto Sync Configuration */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Auto Sync Configuration</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">Enable Auto Sync</Label>
                <p className="text-xs text-gray-600 mt-1">
                  Automatically sync employee data at scheduled intervals
                </p>
              </div>
              <Switch
                checked={syncSettings.autoSyncEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoSyncEnabled", checked)
                }
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <Label htmlFor="frequency" className="text-sm font-medium text-gray-900">
                Sync Frequency
              </Label>
              <select
                id="frequency"
                value={syncSettings.syncFrequency}
                onChange={(e) => handleSettingChange("syncFrequency", e.target.value)}
                disabled={!syncSettings.autoSyncEnabled}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="realtime">Real-time (Instant)</option>
                <option value="15min">Every 15 Minutes</option>
                <option value="30min">Every 30 Minutes</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">Real-Time Sync</Label>
                <p className="text-xs text-gray-600 mt-1">Sync immediately on data changes</p>
              </div>
              <Switch
                checked={syncSettings.realTimeSync}
                onCheckedChange={(checked) => handleSettingChange("realTimeSync", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">Batch Sync</Label>
                <p className="text-xs text-gray-600 mt-1">Process multiple records at once</p>
              </div>
              <Switch
                checked={syncSettings.batchSync}
                onCheckedChange={(checked) => handleSettingChange("batchSync", checked)}
              />
            </div>
          </div>
        </Card>

        {/* Sync Triggers */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sync Triggers</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Sync on Employee Creation
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Automatically sync when new employees are added
                </p>
              </div>
              <Switch
                checked={syncSettings.syncOnEmployeeCreation}
                onCheckedChange={(checked) =>
                  handleSettingChange("syncOnEmployeeCreation", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Sync on Employee Update
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Automatically sync when employee data is updated
                </p>
              </div>
              <Switch
                checked={syncSettings.syncOnEmployeeUpdate}
                onCheckedChange={(checked) =>
                  handleSettingChange("syncOnEmployeeUpdate", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Sync on Employee Termination
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Automatically sync when employees are terminated
                </p>
              </div>
              <Switch
                checked={syncSettings.syncOnEmployeeTermination}
                onCheckedChange={(checked) =>
                  handleSettingChange("syncOnEmployeeTermination", checked)
                }
              />
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Real-time sync may impact system performance. Use batch
                sync for better efficiency with large datasets.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sync History */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sync History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Records Synced
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Errors
                </th>
              </tr>
            </thead>
            <tbody>
              {syncHistory.map((sync) => (
                <tr key={sync.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(sync.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          sync.status
                        )}`}
                      >
                        {sync.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{sync.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {sync.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {sync.recordsSynced}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{sync.duration}</td>
                  <td className="py-3 px-4">
                    {sync.errors ? (
                      <span className="text-sm font-medium text-red-600">{sync.errors}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeMasterSyncSettings;

