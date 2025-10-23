import React, { useState } from "react";
import { DollarSign, TrendingUp, Gift, TrendingDown, Plus, Settings as SettingsIcon } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const SalaryComponentsFetchSettings = () => {
  const [fetchSettings, setFetchSettings] = useState({
    autoFetchEnabled: true,
    fetchFrequency: "daily",
    fetchBasicSalary: true,
    fetchAllowances: true,
    fetchBenefits: true,
    fetchDeductions: true,
    fetchVariableComponents: true,
    fetchHistoricalData: false,
    validateOnFetch: true,
  });

  const [componentMappings, setComponentMappings] = useState([
    {
      id: 1,
      componentType: "Basic Salary",
      sourceField: "basic_salary",
      targetField: "BASIC",
      enabled: true,
      lastFetched: "2025-01-21 10:30:00",
      recordsCount: 245,
    },
    {
      id: 2,
      componentType: "House Rent Allowance",
      sourceField: "hra",
      targetField: "HRA",
      enabled: true,
      lastFetched: "2025-01-21 10:30:00",
      recordsCount: 230,
    },
    {
      id: 3,
      componentType: "Transport Allowance",
      sourceField: "transport_allowance",
      targetField: "TA",
      enabled: true,
      lastFetched: "2025-01-21 10:30:00",
      recordsCount: 245,
    },
    {
      id: 4,
      componentType: "Medical Insurance",
      sourceField: "medical_benefit",
      targetField: "MED_INS",
      enabled: true,
      lastFetched: "2025-01-21 10:30:00",
      recordsCount: 212,
    },
    {
      id: 5,
      componentType: "Provident Fund",
      sourceField: "pf_deduction",
      targetField: "PF",
      enabled: true,
      lastFetched: "2025-01-21 10:30:00",
      recordsCount: 245,
    },
    {
      id: 6,
      componentType: "Income Tax",
      sourceField: "income_tax",
      targetField: "INCOME_TAX",
      enabled: true,
      lastFetched: "2025-01-21 10:30:00",
      recordsCount: 245,
    },
  ]);

  const [isAddingMapping, setIsAddingMapping] = useState(false);
  const [newMapping, setNewMapping] = useState({
    componentType: "",
    sourceField: "",
    targetField: "",
    enabled: true,
  });

  const handleSettingChange = (key, value) => {
    setFetchSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleMapping = (id) => {
    setComponentMappings(
      componentMappings.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleAddMapping = () => {
    if (newMapping.componentType && newMapping.sourceField && newMapping.targetField) {
      setComponentMappings([
        ...componentMappings,
        {
          ...newMapping,
          id: Date.now(),
          lastFetched: "Never",
          recordsCount: 0,
        },
      ]);
      setNewMapping({
        componentType: "",
        sourceField: "",
        targetField: "",
        enabled: true,
      });
      setIsAddingMapping(false);
    }
  };

  const getComponentIcon = (type) => {
    if (type.includes("Salary")) return <DollarSign className="w-5 h-5 text-green-600" />;
    if (type.includes("Allowance")) return <TrendingUp className="w-5 h-5 text-blue-600" />;
    if (type.includes("Insurance") || type.includes("Benefit"))
      return <Gift className="w-5 h-5 text-purple-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Components Fetch</h1>
          <p className="text-gray-600 mt-1">
            Fetch basic salary, allowances, benefits, and deductions from Employee Master
          </p>
        </div>
        <Button
          onClick={() => setIsAddingMapping(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Mapping
        </Button>
      </div>

      {/* Global Settings */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Fetch Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Auto Fetch</Label>
              <p className="text-xs text-gray-600 mt-1">Enable automatic data fetching</p>
            </div>
            <Switch
              checked={fetchSettings.autoFetchEnabled}
              onCheckedChange={(checked) => handleSettingChange("autoFetchEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Fetch Basic Salary</Label>
              <p className="text-xs text-gray-600 mt-1">Include basic salary data</p>
            </div>
            <Switch
              checked={fetchSettings.fetchBasicSalary}
              onCheckedChange={(checked) => handleSettingChange("fetchBasicSalary", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Fetch Allowances</Label>
              <p className="text-xs text-gray-600 mt-1">Include all allowances</p>
            </div>
            <Switch
              checked={fetchSettings.fetchAllowances}
              onCheckedChange={(checked) => handleSettingChange("fetchAllowances", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Fetch Benefits</Label>
              <p className="text-xs text-gray-600 mt-1">Include benefits & perks</p>
            </div>
            <Switch
              checked={fetchSettings.fetchBenefits}
              onCheckedChange={(checked) => handleSettingChange("fetchBenefits", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Fetch Deductions</Label>
              <p className="text-xs text-gray-600 mt-1">Include all deductions</p>
            </div>
            <Switch
              checked={fetchSettings.fetchDeductions}
              onCheckedChange={(checked) => handleSettingChange("fetchDeductions", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Variable Components</Label>
              <p className="text-xs text-gray-600 mt-1">Bonuses, incentives, etc.</p>
            </div>
            <Switch
              checked={fetchSettings.fetchVariableComponents}
              onCheckedChange={(checked) =>
                handleSettingChange("fetchVariableComponents", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Historical Data</Label>
              <p className="text-xs text-gray-600 mt-1">Fetch past salary data</p>
            </div>
            <Switch
              checked={fetchSettings.fetchHistoricalData}
              onCheckedChange={(checked) =>
                handleSettingChange("fetchHistoricalData", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Validate on Fetch</Label>
              <p className="text-xs text-gray-600 mt-1">Validate data integrity</p>
            </div>
            <Switch
              checked={fetchSettings.validateOnFetch}
              onCheckedChange={(checked) => handleSettingChange("validateOnFetch", checked)}
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-lg col-span-1">
            <Label htmlFor="fetchFrequency" className="text-sm font-medium text-gray-900">
              Fetch Frequency
            </Label>
            <select
              id="fetchFrequency"
              value={fetchSettings.fetchFrequency}
              onChange={(e) => handleSettingChange("fetchFrequency", e.target.value)}
              disabled={!fetchSettings.autoFetchEnabled}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Component Mappings */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Component Mappings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {componentMappings.map((mapping) => (
            <Card
              key={mapping.id}
              className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getComponentIcon(mapping.componentType)}
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {mapping.componentType}
                  </h4>
                </div>
                <Switch
                  checked={mapping.enabled}
                  onCheckedChange={() => handleToggleMapping(mapping.id)}
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs">
                  <span className="text-gray-600">Source:</span>
                  <span className="ml-2 font-mono font-medium text-gray-900 bg-blue-50 px-2 py-1 rounded">
                    {mapping.sourceField}
                  </span>
                </div>

                <div className="text-xs">
                  <span className="text-gray-600">Target:</span>
                  <span className="ml-2 font-mono font-medium text-gray-900 bg-green-50 px-2 py-1 rounded">
                    {mapping.targetField}
                  </span>
                </div>

                <div className="text-xs text-gray-600 pt-2 border-t">
                  Last Fetched: {mapping.lastFetched}
                </div>

                <div className="text-xs font-medium text-gray-900">
                  Records: {mapping.recordsCount}
                </div>

                <div className="pt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mapping.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {mapping.enabled ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Add Mapping Modal */}
      {isAddingMapping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Component Mapping</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="componentType" className="text-sm font-medium text-gray-700">
                  Component Type
                </Label>
                <input
                  id="componentType"
                  type="text"
                  value={newMapping.componentType}
                  onChange={(e) =>
                    setNewMapping({ ...newMapping, componentType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Special Allowance"
                />
              </div>

              <div>
                <Label htmlFor="sourceField" className="text-sm font-medium text-gray-700">
                  Source Field
                </Label>
                <input
                  id="sourceField"
                  type="text"
                  value={newMapping.sourceField}
                  onChange={(e) =>
                    setNewMapping({ ...newMapping, sourceField: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-mono"
                  placeholder="e.g., special_allowance"
                />
              </div>

              <div>
                <Label htmlFor="targetField" className="text-sm font-medium text-gray-700">
                  Target Field
                </Label>
                <input
                  id="targetField"
                  type="text"
                  value={newMapping.targetField}
                  onChange={(e) =>
                    setNewMapping({
                      ...newMapping,
                      targetField: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-mono"
                  placeholder="e.g., SPEC_ALLOW"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsAddingMapping(false);
                  setNewMapping({
                    componentType: "",
                    sourceField: "",
                    targetField: "",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMapping}
                disabled={
                  !newMapping.componentType ||
                  !newMapping.sourceField ||
                  !newMapping.targetField
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                Add Mapping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryComponentsFetchSettings;

