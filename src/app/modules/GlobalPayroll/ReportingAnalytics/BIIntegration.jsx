import React, { useState } from "react";
import { Database, Code, Settings, Link, Eye, Download, Play } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const BIIntegration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState("all");

  const apiEndpoints = [
    {
      id: 1,
      name: "Payroll Summary API",
      endpoint: "/api/v1/payroll/summary",
      method: "GET",
      description: "Retrieve payroll summary data",
      status: "Active",
      lastUsed: "2025-01-21 10:30:00",
      usage: 156,
      rateLimit: "1000/hour",
      authentication: "Bearer Token",
    },
    {
      id: 2,
      name: "Cost Center Analysis API",
      endpoint: "/api/v1/payroll/cost-centers",
      method: "GET",
      description: "Get cost center analysis data",
      status: "Active",
      lastUsed: "2025-01-21 09:15:00",
      usage: 89,
      rateLimit: "500/hour",
      authentication: "Bearer Token",
    },
    {
      id: 3,
      name: "Statutory Reports API",
      endpoint: "/api/v1/payroll/statutory",
      method: "GET",
      description: "Access statutory compliance reports",
      status: "Active",
      lastUsed: "2025-01-21 08:45:00",
      usage: 234,
      rateLimit: "2000/hour",
      authentication: "Bearer Token",
    },
    {
      id: 4,
      name: "Forecast Data API",
      endpoint: "/api/v1/payroll/forecast",
      method: "GET",
      description: "Retrieve forecast and budgeting data",
      status: "Active",
      lastUsed: "2025-01-21 07:30:00",
      usage: 67,
      rateLimit: "300/hour",
      authentication: "Bearer Token",
    },
  ];

  const biConnectors = [
    {
      name: "Power BI",
      description: "Microsoft Power BI connector",
      status: "Connected",
      lastSync: "2025-01-21 10:30:00",
      dataSource: "Payroll Database",
      refreshRate: "Daily",
      icon: Database,
      color: "yellow",
    },
    {
      name: "Tableau",
      description: "Tableau data connector",
      status: "Connected",
      lastSync: "2025-01-21 09:15:00",
      dataSource: "Payroll Database",
      refreshRate: "Real-time",
      icon: Database,
      color: "blue",
    },
    {
      name: "QlikView",
      description: "QlikView data integration",
      status: "Disconnected",
      lastSync: "2025-01-20 16:30:00",
      dataSource: "Payroll Database",
      refreshRate: "Weekly",
      icon: Database,
      color: "green",
    },
    {
      name: "Looker",
      description: "Looker BI platform",
      status: "Connected",
      lastSync: "2025-01-21 08:45:00",
      dataSource: "Payroll Database",
      refreshRate: "Hourly",
      icon: Database,
      color: "purple",
    },
  ];

  const dataSchemas = [
    {
      table: "payroll_summary",
      description: "Payroll summary data",
      fields: 15,
      records: 1200,
      lastUpdated: "2025-01-21 10:30:00",
      size: "2.5 MB",
    },
    {
      table: "cost_centers",
      description: "Cost center analysis data",
      fields: 12,
      records: 45,
      lastUpdated: "2025-01-21 09:15:00",
      size: "0.8 MB",
    },
    {
      table: "statutory_reports",
      description: "Statutory compliance data",
      fields: 20,
      records: 480,
      lastUpdated: "2025-01-21 08:45:00",
      size: "3.2 MB",
    },
    {
      table: "forecast_data",
      description: "Forecast and budgeting data",
      fields: 18,
      records: 240,
      lastUpdated: "2025-01-21 07:30:00",
      size: "1.8 MB",
    },
  ];

  const integrationLogs = [
    {
      id: 1,
      timestamp: "2025-01-21 10:30:00",
      action: "Data Sync",
      source: "Power BI",
      status: "Success",
      records: 1200,
      duration: "2.5s",
    },
    {
      id: 2,
      timestamp: "2025-01-21 09:15:00",
      action: "API Call",
      source: "Tableau",
      status: "Success",
      records: 89,
      duration: "1.2s",
    },
    {
      id: 3,
      timestamp: "2025-01-21 08:45:00",
      action: "Data Refresh",
      source: "Looker",
      status: "Success",
      records: 234,
      duration: "3.8s",
    },
    {
      id: 4,
      timestamp: "2025-01-21 07:30:00",
      action: "Connection Test",
      source: "QlikView",
      status: "Failed",
      records: 0,
      duration: "0.5s",
    },
  ];

  const handleGenerateAPI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Connected":
        return "bg-green-100 text-green-700";
      case "Disconnected":
        return "bg-red-100 text-red-700";
      case "Success":
        return "bg-green-100 text-green-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-700";
      case "POST":
        return "bg-blue-100 text-blue-700";
      case "PUT":
        return "bg-yellow-100 text-yellow-700";
      case "DELETE":
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
          <h1 className="text-2xl font-bold text-gray-900">BI Integration-Ready APIs</h1>
          <p className="text-gray-600 mt-1">
            RESTful APIs and connectors for Business Intelligence platforms
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateAPI}
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
                <Code className="w-4 h-4" />
                Generate API
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Schema
          </Button>
        </div>
      </div>

      {/* API Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="api" className="text-sm font-medium text-gray-700">
              API Endpoint
            </Label>
            <select
              id="api"
              value={selectedAPI}
              onChange={(e) => setSelectedAPI(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All APIs</option>
              <option value="payroll">Payroll Summary API</option>
              <option value="cost">Cost Center API</option>
              <option value="statutory">Statutory Reports API</option>
              <option value="forecast">Forecast Data API</option>
            </select>
          </div>

          <div>
            <Label htmlFor="version" className="text-sm font-medium text-gray-700">
              API Version
            </Label>
            <select
              id="version"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="v1">v1.0</option>
              <option value="v2">v2.0</option>
              <option value="beta">Beta</option>
            </select>
          </div>

          <div>
            <Label htmlFor="format" className="text-sm font-medium text-gray-700">
              Response Format
            </Label>
            <select
              id="format"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div>
            <Label htmlFor="auth" className="text-sm font-medium text-gray-700">
              Authentication
            </Label>
            <select
              id="auth"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bearer">Bearer Token</option>
              <option value="api-key">API Key</option>
              <option value="oauth">OAuth 2.0</option>
            </select>
          </div>
        </div>
      </Card>

      {/* API Endpoints */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available API Endpoints</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">API Name</th>
                <th className="p-3 text-left">Endpoint</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Usage</th>
                <th className="p-3 text-left">Rate Limit</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((api) => (
                <tr key={api.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{api.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{api.endpoint}</code>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(api.method)}`}>
                      {api.method}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{api.description}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(api.status)}`}>
                      {api.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{api.usage}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{api.rateLimit}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Test
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Download className="w-3 h-3 mr-1" />
                        Docs
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* BI Connectors */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">BI Platform Connectors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {biConnectors.map((connector, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <connector.icon className={`w-6 h-6 text-${connector.color}-600`} />
                  <h3 className="font-semibold text-gray-900">{connector.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connector.status)}`}>
                  {connector.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{connector.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Data Source:</span>
                  <span className="font-semibold">{connector.dataSource}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Refresh Rate:</span>
                  <span className="font-semibold">{connector.refreshRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-semibold">{connector.lastSync}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                  <Link className="w-3 h-3 mr-1" />
                  Connect
                </Button>
                <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Schemas */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Schemas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Table Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Fields</th>
                <th className="p-3 text-left">Records</th>
                <th className="p-3 text-left">Last Updated</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataSchemas.map((schema, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-semibold">{schema.table}</code>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{schema.description}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{schema.fields}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{schema.records.toLocaleString()}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{schema.lastUpdated}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{schema.size}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Schema
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

      {/* Integration Logs */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Activity Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Records</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {integrationLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{log.timestamp}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{log.action}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{log.source}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{log.records}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{log.duration}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Play className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* API Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Code className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total APIs</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">4</p>
          <p className="text-sm text-gray-600 mt-1">Active endpoints</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">BI Connectors</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">3</p>
          <p className="text-sm text-gray-600 mt-1">Connected platforms</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Link className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">API Calls</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">546</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Success Rate</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">99.2%</p>
          <p className="text-sm text-gray-600 mt-1">API reliability</p>
        </Card>
      </div>

      {/* Integration Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">BI Integration Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">API Usage</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use Bearer token authentication for all API calls</li>
              <li>• Respect rate limits to avoid throttling</li>
              <li>• Implement proper error handling and retry logic</li>
              <li>• Use pagination for large datasets</li>
              <li>• Monitor API usage and performance metrics</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">BI Platform Setup</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Configure data refresh schedules appropriately</li>
              <li>• Use appropriate data transformation rules</li>
              <li>• Implement data validation and quality checks</li>
              <li>• Set up monitoring and alerting for failures</li>
              <li>• Maintain data lineage and documentation</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Code className="w-4 h-4 mr-2" />
          Generate API Keys
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export API Documentation
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Integration Status</Button>
      </div>
    </div>
  );
};

export default BIIntegration;
