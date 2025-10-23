import React, { useState } from "react";
import { Lock, Shield, Key, Eye, EyeOff, Settings, Download, AlertTriangle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Switch } from "components/ui/switch";

const DataEncryption = () => {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  const encryptionSettings = [
    {
      dataType: "Salary Information",
      encryptionStatus: "Enabled",
      algorithm: "AES-256",
      keySize: "256-bit",
      lastUpdated: "2025-01-21 10:30:00",
      coverage: "100%",
      icon: Lock,
      color: "green",
    },
    {
      dataType: "Personal Data",
      encryptionStatus: "Enabled",
      algorithm: "AES-256",
      keySize: "256-bit",
      lastUpdated: "2025-01-21 09:15:00",
      coverage: "100%",
      icon: Shield,
      color: "green",
    },
    {
      dataType: "Bank Account Details",
      encryptionStatus: "Enabled",
      algorithm: "AES-256",
      keySize: "256-bit",
      lastUpdated: "2025-01-21 08:45:00",
      coverage: "100%",
      icon: Key,
      color: "green",
    },
    {
      dataType: "Tax Information",
      encryptionStatus: "Enabled",
      algorithm: "AES-256",
      keySize: "256-bit",
      lastUpdated: "2025-01-21 07:30:00",
      coverage: "100%",
      icon: Lock,
      color: "green",
    },
  ];

  const encryptionKeys = [
    {
      keyId: "KEY-001",
      keyName: "Primary Encryption Key",
      algorithm: "AES-256",
      keySize: "256-bit",
      status: "Active",
      createdDate: "2025-01-01 00:00:00",
      expiryDate: "2025-12-31 23:59:59",
      usage: "Salary & Personal Data",
      lastRotated: "2025-01-21 10:30:00",
    },
    {
      keyId: "KEY-002",
      keyName: "Secondary Encryption Key",
      algorithm: "AES-256",
      keySize: "256-bit",
      status: "Active",
      createdDate: "2025-01-01 00:00:00",
      expiryDate: "2025-12-31 23:59:59",
      usage: "Bank Account Details",
      lastRotated: "2025-01-21 09:15:00",
    },
    {
      keyId: "KEY-003",
      keyName: "Backup Encryption Key",
      algorithm: "AES-256",
      keySize: "256-bit",
      status: "Inactive",
      createdDate: "2024-12-01 00:00:00",
      expiryDate: "2025-06-30 23:59:59",
      usage: "Legacy Data",
      lastRotated: "2024-12-31 23:59:59",
    },
  ];

  const securityPolicies = [
    {
      policy: "Data Encryption at Rest",
      description: "All sensitive data encrypted when stored",
      status: "Enabled",
      coverage: "100%",
      lastAudit: "2025-01-21 10:30:00",
    },
    {
      policy: "Data Encryption in Transit",
      description: "All data encrypted during transmission",
      status: "Enabled",
      coverage: "100%",
      lastAudit: "2025-01-21 09:15:00",
    },
    {
      policy: "Key Management",
      description: "Secure key generation and rotation",
      status: "Enabled",
      coverage: "100%",
      lastAudit: "2025-01-21 08:45:00",
    },
    {
      policy: "Access Control",
      description: "Role-based access to encrypted data",
      status: "Enabled",
      coverage: "100%",
      lastAudit: "2025-01-21 07:30:00",
    },
  ];

  const encryptionAlgorithms = [
    {
      name: "AES-256",
      description: "Advanced Encryption Standard 256-bit",
      security: "High",
      performance: "Good",
      recommended: true,
      icon: Lock,
      color: "green",
    },
    {
      name: "AES-128",
      description: "Advanced Encryption Standard 128-bit",
      security: "Medium",
      performance: "Excellent",
      recommended: false,
      icon: Shield,
      color: "yellow",
    },
    {
      name: "RSA-2048",
      description: "Rivest-Shamir-Adleman 2048-bit",
      security: "High",
      performance: "Fair",
      recommended: false,
      icon: Key,
      color: "blue",
    },
    {
      name: "ChaCha20",
      description: "ChaCha20 stream cipher",
      security: "High",
      performance: "Excellent",
      recommended: false,
      icon: Lock,
      color: "purple",
    },
  ];

  const handleEncryptData = () => {
    setIsEncrypting(true);
    setTimeout(() => {
      setIsEncrypting(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Enabled":
        return "bg-green-100 text-green-700";
      case "Active":
        return "bg-green-100 text-green-700";
      case "Disabled":
        return "bg-red-100 text-red-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSecurityColor = (security) => {
    switch (security) {
      case "High":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
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
          <h1 className="text-2xl font-bold text-gray-900">Secure Encryption of Salary & Personal Data</h1>
          <p className="text-gray-600 mt-1">
            Advanced encryption and security measures for sensitive payroll data
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleEncryptData}
            disabled={isEncrypting}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isEncrypting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Encrypt Data
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Security Report
          </Button>
        </div>
      </div>

      {/* Encryption Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Encryption Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {encryptionSettings.map((setting, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <setting.icon className={`w-6 h-6 text-${setting.color}-600`} />
                  <h3 className="font-semibold text-gray-900">{setting.dataType}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(setting.encryptionStatus)}`}>
                  {setting.encryptionStatus}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Algorithm:</span>
                  <span className="font-semibold">{setting.algorithm}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Key Size:</span>
                  <span className="font-semibold">{setting.keySize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coverage:</span>
                  <span className="font-semibold text-green-600">{setting.coverage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-semibold">{setting.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Encryption Keys */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Encryption Keys Management</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowKeys(!showKeys)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              {showKeys ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              {showKeys ? 'Hide' : 'Show'} Keys
            </Button>
          </div>
          <Button className="bg-blue-600 text-white">
            <Key className="w-4 h-4 mr-2" />
            Generate New Key
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Key ID</th>
                <th className="p-3 text-left">Key Name</th>
                <th className="p-3 text-left">Algorithm</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Usage</th>
                <th className="p-3 text-left">Last Rotated</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {encryptionKeys.map((key) => (
                <tr key={key.keyId} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{key.keyId}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{key.keyName}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{key.algorithm}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(key.status)}`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{key.usage}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{key.lastRotated}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Settings className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Key className="w-3 h-3 mr-1" />
                        Rotate
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Policies */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Policies</h2>
        <div className="space-y-4">
          {securityPolicies.map((policy, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{policy.policy}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                    {policy.status}
                  </span>
                  <span className="text-sm text-gray-600">{policy.coverage}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Last Audit: {policy.lastAudit}</span>
                <Switch defaultChecked />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Encryption Algorithms */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Encryption Algorithms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {encryptionAlgorithms.map((algorithm, index) => (
            <div key={index} className={`p-4 bg-${algorithm.color}-50 border-${algorithm.color}-200 rounded-lg`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <algorithm.icon className={`w-6 h-6 text-${algorithm.color}-600`} />
                  <h3 className="font-semibold text-gray-900">{algorithm.name}</h3>
                </div>
                {algorithm.recommended && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{algorithm.description}</p>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Security:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSecurityColor(algorithm.security)}`}>
                    {algorithm.security}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Performance:</span>
                  <span className="font-semibold">{algorithm.performance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Encryption Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Encrypted Data</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">100%</p>
          <p className="text-sm text-gray-600 mt-1">Coverage</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Active Keys</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">2</p>
          <p className="text-sm text-gray-600 mt-1">Encryption keys</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Security Score</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">98%</p>
          <p className="text-sm text-gray-600 mt-1">Overall security</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Last Audit</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">Today</p>
          <p className="text-sm text-gray-600 mt-1">Security audit</p>
        </Card>
      </div>

      {/* Security Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Encryption Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use AES-256 encryption for all sensitive data</li>
              <li>• Implement key rotation every 90 days</li>
              <li>• Store encryption keys separately from data</li>
              <li>• Use secure key management systems</li>
              <li>• Regular security audits and assessments</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Compliance Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• GDPR compliance for personal data protection</li>
              <li>• SOX compliance for financial data security</li>
              <li>• Industry-specific encryption standards</li>
              <li>• Regular penetration testing</li>
              <li>• Incident response and breach notification</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Lock className="w-4 h-4 mr-2" />
          Encrypt All Data
        </Button>
        <Button className="bg-green-600 text-white">
          <Key className="w-4 h-4 mr-2" />
          Rotate Encryption Keys
        </Button>
        <Button className="bg-gray-200 text-gray-700">Configure Security Settings</Button>
      </div>
    </div>
  );
};

export default DataEncryption;
