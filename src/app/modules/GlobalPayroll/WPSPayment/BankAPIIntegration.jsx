import React, { useState } from "react";
import { Link, Settings, CheckCircle, AlertCircle, Building2, Zap, Globe } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const BankAPIIntegration = () => {
  const [selectedBank, setSelectedBank] = useState("ADCB");
  const [isTesting, setIsTesting] = useState(false);

  const bankIntegrations = [
    {
      id: 1,
      bankName: "ADCB",
      country: "UAE",
      currency: "AED",
      apiStatus: "Connected",
      lastSync: "2025-01-21 10:30:00",
      transactionsCount: 150,
      successRate: 98.5,
      apiVersion: "v2.1",
      endpoints: 5,
      status: "Active",
    },
    {
      id: 2,
      bankName: "Barclays Bank",
      country: "UK",
      currency: "GBP",
      apiStatus: "Connected",
      lastSync: "2025-01-21 09:15:00",
      transactionsCount: 75,
      successRate: 96.2,
      apiVersion: "v1.8",
      endpoints: 3,
      status: "Active",
    },
    {
      id: 3,
      bankName: "Standard Bank",
      country: "South Africa",
      currency: "ZAR",
      apiStatus: "Disconnected",
      lastSync: "2025-01-20 16:45:00",
      transactionsCount: 45,
      successRate: 94.1,
      apiVersion: "v1.5",
      endpoints: 4,
      status: "Inactive",
    },
    {
      id: 4,
      bankName: "First Bank",
      country: "Nigeria",
      currency: "NGN",
      apiStatus: "Testing",
      lastSync: "Never",
      transactionsCount: 0,
      successRate: 0,
      apiVersion: "v1.0",
      endpoints: 2,
      status: "Testing",
    },
  ];

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => setIsTesting(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      case "Testing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAPIColor = (apiStatus) => {
    switch (apiStatus) {
      case "Connected":
        return "bg-green-100 text-green-700";
      case "Disconnected":
        return "bg-red-100 text-red-700";
      case "Testing":
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
          <h1 className="text-2xl font-bold text-gray-900">Bank API Integration</h1>
          <p className="text-gray-600 mt-1">
            API-ready integration with banks and payment gateways
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <Link className="w-4 h-4 mr-2" />
            Add Bank API
          </Button>
          <Button className="bg-green-600 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Test All APIs
          </Button>
        </div>
      </div>

      {/* API Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="bankSelect" className="text-sm font-medium text-gray-700">
              Select Bank
            </Label>
            <select
              id="bankSelect"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ADCB">ADCB - Abu Dhabi Commercial Bank</option>
              <option value="BARCLAYS">Barclays Bank</option>
              <option value="STANDARD">Standard Bank</option>
              <option value="FIRST">First Bank</option>
            </select>
          </div>

          <div>
            <Label htmlFor="apiEndpoint" className="text-sm font-medium text-gray-700">
              API Endpoint
            </Label>
            <input
              id="apiEndpoint"
              type="url"
              placeholder="https://api.bank.com/v2/payments"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
              API Key
            </Label>
            <input
              id="apiKey"
              type="password"
              placeholder="Enter API key"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Auto Sync</Label>
              <Switch defaultChecked />
            </div>
            <p className="text-xs text-gray-600">
              Automatically sync with bank APIs
            </p>
          </div>
        </div>
      </Card>

      {/* Bank Integrations */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank API Integrations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Bank</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">API Status</th>
                <th className="p-3 text-left">Transactions</th>
                <th className="p-3 text-left">Success Rate</th>
                <th className="p-3 text-left">Last Sync</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankIntegrations.map((bank) => (
                <tr key={bank.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-semibold">{bank.bankName}</p>
                        <p className="text-xs text-gray-500">{bank.apiVersion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{bank.country}</span>
                      <span className="text-xs text-gray-500">({bank.currency})</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAPIColor(bank.apiStatus)}`}>
                      {bank.apiStatus}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{bank.transactionsCount}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {bank.successRate > 95 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className="font-semibold">{bank.successRate}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{bank.lastSync}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bank.status)}`}>
                      {bank.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
                      >
                        {isTesting ? "Testing..." : "Test"}
                      </Button>
                      <Button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700">
                        <Settings className="w-3 h-3 mr-1" />
                        Config
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* API Endpoints */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available API Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Payment Endpoints</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">POST /payments/create</p>
                  <p className="text-xs text-gray-600">Create payment batch</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">GET /payments/status</p>
                  <p className="text-xs text-gray-600">Check payment status</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">POST /payments/cancel</p>
                  <p className="text-xs text-gray-600">Cancel payment batch</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Account Endpoints</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">GET /accounts/balance</p>
                  <p className="text-xs text-gray-600">Check account balance</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">GET /accounts/transactions</p>
                  <p className="text-xs text-gray-600">Get transaction history</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">POST /accounts/validate</p>
                  <p className="text-xs text-gray-600">Validate account details</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Active</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Connected Banks</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">2</p>
          <p className="text-sm text-gray-600 mt-1">Active integrations</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Testing</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">1</p>
          <p className="text-sm text-gray-600 mt-1">In testing phase</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Disconnected</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">1</p>
          <p className="text-sm text-gray-600 mt-1">Needs attention</p>
        </Card>
      </div>

      {/* API Documentation */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Integration Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Authentication</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• API Key authentication</li>
              <li>• OAuth 2.0 support</li>
              <li>• JWT token validation</li>
              <li>• Rate limiting: 1000 requests/hour</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• HTTPS encryption</li>
              <li>• IP whitelisting</li>
              <li>• Request signing</li>
              <li>• Audit logging</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Link className="w-4 h-4 mr-2" />
          Add New Bank API
        </Button>
        <Button className="bg-green-600 text-white">
          <Zap className="w-4 h-4 mr-2" />
          Test All Connections
        </Button>
        <Button className="bg-gray-200 text-gray-700">View API Documentation</Button>
      </div>
    </div>
  );
};

export default BankAPIIntegration;
