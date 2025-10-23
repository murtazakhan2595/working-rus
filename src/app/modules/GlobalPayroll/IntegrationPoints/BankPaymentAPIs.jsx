import React, { useState } from "react";
import { CreditCard, Banknote, Settings, Link, Eye, Download, CheckCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const BankPaymentAPIs = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const integrations = [
    {
      id: 1,
      name: "UAE Banks Integration",
      description: "Integration with UAE banking systems for salary payments",
      status: "Active",
      lastSync: "2025-01-21 10:30:00",
      nextSync: "2025-01-21 11:00:00",
      frequency: "Real-time",
      dataPoints: [
        "WPS file generation",
        "Bank transfer processing",
        "Payment status tracking",
        "Account validation",
        "Transaction reconciliation",
      ],
      icon: CreditCard,
      color: "blue",
    },
    {
      id: 2,
      name: "UK Banking APIs",
      description: "Integration with UK banking systems and payment gateways",
      status: "Active",
      lastSync: "2025-01-21 10:15:00",
      nextSync: "2025-01-21 10:45:00",
      frequency: "Real-time",
      dataPoints: [
        "BACS file generation",
        "Faster payments",
        "Direct debit processing",
        "Payment confirmations",
        "Error handling",
      ],
      icon: Banknote,
      color: "green",
    },
    {
      id: 3,
      name: "Africa Banking Integration",
      description: "Integration with African banking systems",
      status: "Active",
      lastSync: "2025-01-21 10:00:00",
      nextSync: "2025-01-21 10:30:00",
      frequency: "Real-time",
      dataPoints: [
        "Local bank formats",
        "Currency conversion",
        "Payment processing",
        "Compliance reporting",
        "Transaction monitoring",
      ],
      icon: CreditCard,
      color: "purple",
    },
    {
      id: 4,
      name: "Payment Gateway APIs",
      description: "Integration with payment gateway providers",
      status: "Inactive",
      lastSync: "2025-01-20 18:00:00",
      nextSync: "Manual",
      frequency: "Manual",
      dataPoints: [
        "Credit card processing",
        "Digital wallet payments",
        "Mobile payments",
        "Fraud detection",
        "Payment analytics",
      ],
      icon: Settings,
      color: "yellow",
    },
  ];

  const bankAccounts = [
    {
      bankName: "Emirates NBD",
      accountNumber: "****1234",
      accountType: "Corporate Salary Account",
      currency: "AED",
      balance: 2500000,
      status: "Active",
      lastTransaction: "2025-01-21 10:30:00",
      icon: CreditCard,
      color: "blue",
    },
    {
      bankName: "ADCB",
      accountNumber: "****5678",
      accountType: "Corporate Salary Account",
      currency: "AED",
      balance: 1800000,
      status: "Active",
      lastTransaction: "2025-01-21 10:15:00",
      icon: Banknote,
      color: "green",
    },
    {
      bankName: "HSBC UK",
      accountNumber: "****9012",
      accountType: "Corporate Salary Account",
      currency: "GBP",
      balance: 450000,
      status: "Active",
      lastTransaction: "2025-01-21 10:00:00",
      icon: CreditCard,
      color: "purple",
    },
    {
      bankName: "Standard Bank Africa",
      accountNumber: "****3456",
      accountType: "Corporate Salary Account",
      currency: "ZAR",
      balance: 3200000,
      status: "Active",
      lastTransaction: "2025-01-21 09:45:00",
      icon: Settings,
      color: "yellow",
    },
  ];

  const paymentMethods = [
    {
      method: "Bank Transfer",
      usage: "95%",
      processingTime: "1-2 business days",
      fees: "AED 5 per transaction",
      status: "Active",
      icon: CreditCard,
      color: "blue",
    },
    {
      method: "WPS (UAE)",
      usage: "85%",
      processingTime: "Same day",
      fees: "AED 2 per transaction",
      status: "Active",
      icon: Banknote,
      color: "green",
    },
    {
      method: "BACS (UK)",
      usage: "90%",
      processingTime: "3 business days",
      fees: "GBP 0.50 per transaction",
      status: "Active",
      icon: CreditCard,
      color: "purple",
    },
    {
      method: "Mobile Payment",
      usage: "15%",
      processingTime: "Instant",
      fees: "AED 1 per transaction",
      status: "Active",
      icon: Settings,
      color: "yellow",
    },
  ];

  const syncHistory = [
    {
      id: 1,
      integration: "UAE Banks Integration",
      timestamp: "2025-01-21 10:30:00",
      status: "Success",
      recordsProcessed: 150,
      errors: 0,
      duration: "2.5s",
    },
    {
      id: 2,
      integration: "UK Banking APIs",
      timestamp: "2025-01-21 10:15:00",
      status: "Success",
      recordsProcessed: 45,
      errors: 0,
      duration: "1.8s",
    },
    {
      id: 3,
      integration: "Africa Banking Integration",
      timestamp: "2025-01-21 10:00:00",
      status: "Warning",
      recordsProcessed: 28,
      errors: 1,
      duration: "3.2s",
    },
    {
      id: 4,
      integration: "UAE Banks Integration",
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
          <h1 className="text-2xl font-bold text-gray-900">Bank & Payment APIs Integration</h1>
          <p className="text-gray-600 mt-1">
            Integration with banking systems and payment gateways for salary processing
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

      {/* Bank Accounts */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bankAccounts.map((account, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <account.icon className={`w-6 h-6 text-${account.color}-600`} />
                <h3 className="font-semibold text-gray-900">{account.bankName}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-semibold">{account.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-semibold">{account.accountType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-semibold">{account.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-semibold text-green-600">{account.currency} {account.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                    {account.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Transaction:</span>
                  <span className="font-semibold">{account.lastTransaction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <method.icon className={`w-6 h-6 text-${method.color}-600`} />
                <h3 className="font-semibold text-gray-900">{method.method}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usage:</span>
                  <span className="font-semibold">{method.usage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-semibold">{method.processingTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fees:</span>
                  <span className="font-semibold">{method.fees}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(method.status)}`}>
                    {method.status}
                  </span>
                </div>
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
                      <CreditCard className="w-4 h-4 text-gray-400" />
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
            <h3 className="text-sm text-gray-600">Payment Success Rate</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">99.2%</p>
          <p className="text-sm text-gray-600 mt-1">Last 24 hours</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Transactions Processed</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">223</p>
          <p className="text-sm text-gray-600 mt-1">Today</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Banknote className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Total Amount</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">AED 2.1M</p>
          <p className="text-sm text-gray-600 mt-1">Processed today</p>
        </Card>
      </div>

      {/* Integration Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Real-time payment processing</li>
              <li>• Secure API authentication</li>
              <li>• Transaction monitoring and logging</li>
              <li>• Error handling and retry mechanisms</li>
              <li>• Compliance with banking regulations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Security Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Encrypted data transmission</li>
              <li>• Secure API key management</li>
              <li>• Multi-factor authentication</li>
              <li>• Regular security audits</li>
              <li>• Fraud detection and prevention</li>
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

export default BankPaymentAPIs;
