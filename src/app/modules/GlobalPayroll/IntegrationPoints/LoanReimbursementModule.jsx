import React, { useState } from "react";
import { DollarSign, CreditCard, Users, Settings, Link, Eye, Download, CheckCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const LoanReimbursementModule = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const integrations = [
    {
      id: 1,
      name: "SAP Integration",
      description: "Loan management and reimbursement processing integration",
      status: "Active",
      lastSync: "2025-01-21 10:30:00",
      nextSync: "2025-01-21 11:00:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "Loan applications",
        "Approval workflows",
        "Payment schedules",
        "Interest calculations",
        "Outstanding balances",
      ],
      icon: DollarSign,
      color: "blue",
    },
    {
      id: 2,
      name: "Oracle Financials",
      description: "Financial management and reimbursement tracking",
      status: "Active",
      lastSync: "2025-01-21 10:15:00",
      nextSync: "2025-01-21 10:45:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "Expense claims",
        "Reimbursement requests",
        "Approval processes",
        "Payment processing",
        "Tax implications",
      ],
      icon: CreditCard,
      color: "green",
    },
    {
      id: 3,
      name: "Workday Integration",
      description: "Employee loans and expense management",
      status: "Active",
      lastSync: "2025-01-21 10:00:00",
      nextSync: "2025-01-21 10:30:00",
      frequency: "Every 30 minutes",
      dataPoints: [
        "Personal loans",
        "Advance payments",
        "Expense reimbursements",
        "Deduction schedules",
        "Balance tracking",
      ],
      icon: Users,
      color: "purple",
    },
    {
      id: 4,
      name: "Custom Loan System",
      description: "Custom loan and reimbursement management",
      status: "Inactive",
      lastSync: "2025-01-20 18:00:00",
      nextSync: "Manual",
      frequency: "Manual",
      dataPoints: [
        "Custom loan types",
        "Manual processing",
        "Exception handling",
        "Policy overrides",
        "Reporting data",
      ],
      icon: Settings,
      color: "yellow",
    },
  ];

  const loanTypes = [
    {
      type: "Personal Loan",
      activeLoans: 25,
      totalAmount: 450000,
      monthlyDeduction: 15000,
      interestRate: "8.5%",
      icon: DollarSign,
      color: "blue",
    },
    {
      type: "Vehicle Loan",
      activeLoans: 12,
      totalAmount: 1200000,
      monthlyDeduction: 25000,
      interestRate: "6.5%",
      icon: CreditCard,
      color: "green",
    },
    {
      type: "Housing Loan",
      activeLoans: 8,
      totalAmount: 8000000,
      monthlyDeduction: 45000,
      interestRate: "7.2%",
      icon: Users,
      color: "purple",
    },
    {
      type: "Emergency Loan",
      activeLoans: 5,
      totalAmount: 150000,
      monthlyDeduction: 5000,
      interestRate: "5.0%",
      icon: DollarSign,
      color: "yellow",
    },
  ];

  const reimbursementTypes = [
    {
      type: "Travel Expenses",
      pendingClaims: 15,
      totalAmount: 25000,
      averageProcessingTime: "3 days",
      approvalRate: "95%",
      icon: CreditCard,
      color: "blue",
    },
    {
      type: "Medical Reimbursement",
      pendingClaims: 8,
      totalAmount: 12000,
      averageProcessingTime: "2 days",
      approvalRate: "98%",
      icon: Users,
      color: "green",
    },
    {
      type: "Training Expenses",
      pendingClaims: 6,
      totalAmount: 18000,
      averageProcessingTime: "5 days",
      approvalRate: "90%",
      icon: Settings,
      color: "purple",
    },
    {
      type: "Office Supplies",
      pendingClaims: 12,
      totalAmount: 8000,
      averageProcessingTime: "1 day",
      approvalRate: "99%",
      icon: DollarSign,
      color: "yellow",
    },
  ];

  const syncHistory = [
    {
      id: 1,
      integration: "SAP Integration",
      timestamp: "2025-01-21 10:30:00",
      status: "Success",
      recordsProcessed: 18,
      errors: 0,
      duration: "1.5s",
    },
    {
      id: 2,
      integration: "Oracle Financials",
      timestamp: "2025-01-21 10:15:00",
      status: "Success",
      recordsProcessed: 24,
      errors: 0,
      duration: "2.1s",
    },
    {
      id: 3,
      integration: "Workday Integration",
      timestamp: "2025-01-21 10:00:00",
      status: "Warning",
      recordsProcessed: 15,
      errors: 1,
      duration: "1.8s",
    },
    {
      id: 4,
      integration: "SAP Integration",
      timestamp: "2025-01-21 09:30:00",
      status: "Success",
      recordsProcessed: 20,
      errors: 0,
      duration: "1.2s",
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
          <h1 className="text-2xl font-bold text-gray-900">Loan & Reimbursement Module Integration</h1>
          <p className="text-gray-600 mt-1">
            Integration with loan management and reimbursement processing systems
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

      {/* Loan Types Overview */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Types Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loanTypes.map((loan, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <loan.icon className={`w-6 h-6 text-${loan.color}-600`} />
                <h3 className="font-semibold text-gray-900">{loan.type}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Loans:</span>
                  <span className="font-semibold">{loan.activeLoans}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">AED {loan.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Deduction:</span>
                  <span className="font-semibold text-red-600">AED {loan.monthlyDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">{loan.interestRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reimbursement Types Overview */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reimbursement Types Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reimbursementTypes.map((reimbursement, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <reimbursement.icon className={`w-6 h-6 text-${reimbursement.color}-600`} />
                <h3 className="font-semibold text-gray-900">{reimbursement.type}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Claims:</span>
                  <span className="font-semibold">{reimbursement.pendingClaims}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">AED {reimbursement.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Processing Time:</span>
                  <span className="font-semibold">{reimbursement.averageProcessingTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approval Rate:</span>
                  <span className="font-semibold text-green-600">{reimbursement.approvalRate}</span>
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
                      <DollarSign className="w-4 h-4 text-gray-400" />
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
          <p className="text-3xl font-bold text-green-600">97%</p>
          <p className="text-sm text-gray-600 mt-1">Last 24 hours</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Total Loan Amount</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">AED 9.8M</p>
          <p className="text-sm text-gray-600 mt-1">Outstanding loans</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Pending Claims</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">41</p>
          <p className="text-sm text-gray-600 mt-1">Reimbursement claims</p>
        </Card>
      </div>

      {/* Integration Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Real-time loan balance synchronization</li>
              <li>• Automatic deduction calculations</li>
              <li>• Approval workflow integration</li>
              <li>• Interest calculation accuracy</li>
              <li>• Compliance with financial regulations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Employee ID consistency across systems</li>
              <li>• Loan type mapping and validation</li>
              <li>• Interest rate synchronization</li>
              <li>• Payment schedule accuracy</li>
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

export default LoanReimbursementModule;
