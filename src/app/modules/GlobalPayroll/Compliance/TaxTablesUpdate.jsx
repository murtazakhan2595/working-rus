import React, { useState } from "react";
import { RefreshCw, CheckCircle, Clock, AlertCircle, Download, Upload } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";

const TaxTablesUpdate = () => {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const taxTables = [
    {
      id: 1,
      country: "United Kingdom",
      countryCode: "GB",
      tableName: "PAYE Tax Rates 2024/25",
      lastUpdated: "2024-04-06",
      version: "2024.1",
      status: "current",
      nextUpdate: "2025-04-06",
    },
    {
      id: 2,
      country: "India",
      countryCode: "IN",
      tableName: "Income Tax Slabs FY 2024-25",
      lastUpdated: "2024-04-01",
      version: "2024.1",
      status: "current",
      nextUpdate: "2025-04-01",
    },
    {
      id: 3,
      country: "Pakistan",
      countryCode: "PK",
      tableName: "Income Tax Rates FY 2024",
      lastUpdated: "2024-07-01",
      version: "2024.2",
      status: "current",
      nextUpdate: "2025-07-01",
    },
    {
      id: 4,
      country: "South Africa",
      countryCode: "ZA",
      tableName: "SARS Tax Tables 2024/25",
      lastUpdated: "2024-03-01",
      version: "2024.1",
      status: "outdated",
      nextUpdate: "2025-03-01",
    },
  ];

  const updateHistory = [
    {
      id: 1,
      date: "2024-04-06",
      country: "United Kingdom",
      description: "Updated PAYE tax rates for 2024/25",
      type: "Automatic",
      status: "success",
    },
    {
      id: 2,
      date: "2024-04-01",
      country: "India",
      description: "Updated income tax slabs",
      type: "Automatic",
      status: "success",
    },
    {
      id: 3,
      date: "2024-03-15",
      country: "Pakistan",
      description: "Updated tax rates",
      type: "Manual",
      status: "success",
    },
  ];

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Tables Auto-Update</h1>
          <p className="text-gray-600 mt-1">
            Auto-update of tax tables and statutory percentages
          </p>
        </div>
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Check for Updates
            </>
          )}
        </Button>
      </div>

      {/* Auto-Update Settings */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Auto-Update Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">
              Automatically check and update tax tables when government releases new rates
            </p>
          </div>
          <Switch
            checked={autoUpdate}
            onCheckedChange={(checked) => setAutoUpdate(checked)}
          />
        </div>
      </Card>

      {/* Tax Tables Status */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Tables Status</h2>
        <div className="space-y-4">
          {taxTables.map((table) => (
            <Card
              key={table.id}
              className={`p-4 ${
                table.status === "outdated"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-green-50 border-green-200"
              } border-2`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {table.status === "current" ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{table.tableName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {table.country} ({table.countryCode})
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-600">
                        Version: <span className="font-medium">{table.version}</span>
                      </span>
                      <span className="text-gray-600">
                        Last Updated: <span className="font-medium">{table.lastUpdated}</span>
                      </span>
                      <span className="text-gray-600">
                        Next Update: <span className="font-medium">{table.nextUpdate}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      table.status === "current"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {table.status === "current" ? "Up to Date" : "Update Available"}
                  </span>
                  {table.status === "outdated" && (
                    <Button className="bg-blue-600 text-white text-sm">Update Now</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Update History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Update History</h2>
        <div className="space-y-3">
          {updateHistory.map((update) => (
            <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">{update.description}</h4>
                  <p className="text-sm text-gray-600">
                    {update.country} • {update.date} • {update.type}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {update.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Manual Update Option */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Update</h2>
        <p className="text-gray-600 mb-4">Upload custom tax tables or rates</p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 mb-2">Upload Tax Table File</p>
          <p className="text-sm text-gray-500 mb-4">Supported formats: .xlsx, .csv, .json</p>
          <Button className="bg-blue-600 text-white">Browse Files</Button>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Update All Tables
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export All Tables
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Logs</Button>
      </div>
    </div>
  );
};

export default TaxTablesUpdate;

