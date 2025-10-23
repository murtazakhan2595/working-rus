import React, { useState } from "react";
import { FileText, Plus, Save, Edit2, Trash2, Search, Filter } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";
import { Tabs } from "components/ui/tabs";

const StatutoryRulesSettings = () => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [rules, setRules] = useState([
    {
      id: 1,
      country: "United Kingdom",
      countryCode: "GB",
      type: "Tax",
      name: "Income Tax",
      percentage: 20,
      threshold: 12570,
      maxAmount: null,
      enabled: true,
    },
    {
      id: 2,
      country: "United Kingdom",
      countryCode: "GB",
      type: "NI",
      name: "National Insurance",
      percentage: 12,
      threshold: 9568,
      maxAmount: null,
      enabled: true,
    },
    {
      id: 3,
      country: "United Kingdom",
      countryCode: "GB",
      type: "Pension",
      name: "Workplace Pension",
      percentage: 5,
      threshold: 6240,
      maxAmount: null,
      enabled: true,
    },
    {
      id: 4,
      country: "India",
      countryCode: "IN",
      type: "Tax",
      name: "Income Tax",
      percentage: 30,
      threshold: 250000,
      maxAmount: null,
      enabled: true,
    },
    {
      id: 5,
      country: "India",
      countryCode: "IN",
      type: "PF",
      name: "Provident Fund",
      percentage: 12,
      threshold: 0,
      maxAmount: 1800,
      enabled: true,
    },
    {
      id: 6,
      country: "India",
      countryCode: "IN",
      type: "Social Security",
      name: "ESI (Employee State Insurance)",
      percentage: 0.75,
      threshold: 0,
      maxAmount: 21000,
      enabled: true,
    },
    {
      id: 7,
      country: "Pakistan",
      countryCode: "PK",
      type: "Tax",
      name: "Income Tax",
      percentage: 15,
      threshold: 600000,
      maxAmount: null,
      enabled: true,
    },
    {
      id: 8,
      country: "Pakistan",
      countryCode: "PK",
      type: "Social Security",
      name: "EOBI (Social Security)",
      percentage: 1,
      threshold: 0,
      maxAmount: null,
      enabled: true,
    },
    {
      id: 9,
      country: "South Africa",
      countryCode: "ZA",
      type: "Tax",
      name: "Income Tax",
      percentage: 18,
      threshold: 95750,
      maxAmount: null,
      enabled: true,
    },
  ]);

  const [currentRule, setCurrentRule] = useState({
    country: "",
    countryCode: "",
    type: "Tax",
    name: "",
    percentage: "",
    threshold: "",
    maxAmount: "",
    enabled: true,
  });

  const countries = [
    { code: "all", name: "All Countries" },
    { code: "GB", name: "United Kingdom" },
    { code: "IN", name: "India" },
    { code: "PK", name: "Pakistan" },
    { code: "ZA", name: "South Africa" },
  ];

  const ruleTypes = [
    "Tax",
    "PF",
    "Social Security",
    "Gratuity",
    "NI",
    "Pension",
    "Other",
  ];

  const handleSaveRule = () => {
    if (currentRule.id) {
      setRules(rules.map((r) => (r.id === currentRule.id ? currentRule : r)));
    } else {
      setRules([...rules, { ...currentRule, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentRule({
      country: "",
      countryCode: "",
      type: "Tax",
      name: "",
      percentage: "",
      threshold: "",
      maxAmount: "",
      enabled: true,
    });
  };

  const handleEditRule = (rule) => {
    setCurrentRule(rule);
    setIsEditing(true);
  };

  const handleDeleteRule = (id) => {
    if (window.confirm("Are you sure you want to delete this statutory rule?")) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const handleToggleRule = (id) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentRule({
      country: "",
      countryCode: "",
      type: "Tax",
      name: "",
      percentage: "",
      threshold: "",
      maxAmount: "",
      enabled: true,
    });
  };

  const filteredRules = rules.filter((rule) => {
    const matchesCountry =
      selectedCountry === "all" || rule.countryCode === selectedCountry;
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const getTypeColor = (type) => {
    const colors = {
      Tax: "bg-purple-100 text-purple-700",
      PF: "bg-blue-100 text-blue-700",
      "Social Security": "bg-green-100 text-green-700",
      Gratuity: "bg-orange-100 text-orange-700",
      NI: "bg-pink-100 text-pink-700",
      Pension: "bg-indigo-100 text-indigo-700",
      Other: "bg-gray-100 text-gray-700",
    };
    return colors[type] || colors.Other;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statutory Rules Configuration</h1>
          <p className="text-gray-600 mt-1">
            Set up statutory rules including tax, PF, social security, gratuity, NI, and pension
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, type, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRules.map((rule) => (
          <Card key={rule.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => handleToggleRule(rule.id)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Country:</span>
                <span className="text-sm font-medium text-gray-900">
                  {rule.country} ({rule.countryCode})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                    rule.type
                  )}`}
                >
                  {rule.type}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Rate:</span>
                <span className="ml-2 font-medium text-gray-900">{rule.percentage}%</span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Threshold:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {rule.threshold.toLocaleString()}
                </span>
              </div>

              {rule.maxAmount && (
                <div className="text-sm">
                  <span className="text-gray-600">Max Amount:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {rule.maxAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {rule.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={() => handleEditRule(rule)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteRule(rule.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No statutory rules found matching your criteria</p>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentRule.id ? "Edit Statutory Rule" : "Add New Statutory Rule"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="ruleName" className="text-sm font-medium text-gray-700">
                  Rule Name
                </Label>
                <input
                  id="ruleName"
                  type="text"
                  value={currentRule.name}
                  onChange={(e) =>
                    setCurrentRule({ ...currentRule, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Income Tax"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country
                </Label>
                <select
                  id="country"
                  value={currentRule.countryCode}
                  onChange={(e) => {
                    const selected = countries.find((c) => c.code === e.target.value);
                    setCurrentRule({
                      ...currentRule,
                      countryCode: e.target.value,
                      country: selected?.name || "",
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Country</option>
                  {countries.filter((c) => c.code !== "all").map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Rule Type
                </Label>
                <select
                  id="type"
                  value={currentRule.type}
                  onChange={(e) =>
                    setCurrentRule({ ...currentRule, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  {ruleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="percentage" className="text-sm font-medium text-gray-700">
                  Percentage (%)
                </Label>
                <input
                  id="percentage"
                  type="number"
                  step="0.01"
                  value={currentRule.percentage}
                  onChange={(e) =>
                    setCurrentRule({
                      ...currentRule,
                      percentage: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <Label htmlFor="threshold" className="text-sm font-medium text-gray-700">
                  Threshold Amount
                </Label>
                <input
                  id="threshold"
                  type="number"
                  value={currentRule.threshold}
                  onChange={(e) =>
                    setCurrentRule({
                      ...currentRule,
                      threshold: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 12570"
                />
              </div>

              <div>
                <Label htmlFor="maxAmount" className="text-sm font-medium text-gray-700">
                  Maximum Amount (Optional)
                </Label>
                <input
                  id="maxAmount"
                  type="number"
                  value={currentRule.maxAmount || ""}
                  onChange={(e) =>
                    setCurrentRule({
                      ...currentRule,
                      maxAmount: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Leave empty for no limit"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={currentRule.enabled}
                  onCheckedChange={(checked) =>
                    setCurrentRule({ ...currentRule, enabled: checked })
                  }
                />
                <Label className="text-sm font-medium text-gray-700">Enable Rule</Label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentRule({
                    country: "",
                    countryCode: "",
                    type: "Tax",
                    name: "",
                    percentage: "",
                    threshold: "",
                    maxAmount: "",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRule}
                disabled={
                  !currentRule.name ||
                  !currentRule.country ||
                  !currentRule.percentage ||
                  currentRule.threshold === ""
                }
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Rule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatutoryRulesSettings;

