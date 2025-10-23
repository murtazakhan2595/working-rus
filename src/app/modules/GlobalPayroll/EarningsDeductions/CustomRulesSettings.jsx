import React, { useState } from "react";
import { Settings, Plus, Edit2, Trash2, Save, Code } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const CustomRulesSettings = () => {
  const [customRules, setCustomRules] = useState([
    {
      id: 1,
      name: "Attendance Bonus Rule",
      ruleType: "Earning",
      condition: "attendance_days >= 26",
      formula: "basic_salary * 0.05",
      description: "5% bonus for full attendance",
      enabled: true,
    },
    {
      id: 2,
      name: "Late Arrival Penalty",
      ruleType: "Deduction",
      condition: "late_arrivals > 3",
      formula: "(late_arrivals - 3) * 100",
      description: "₹100 per late arrival after 3 instances",
      enabled: true,
    },
    {
      id: 3,
      name: "Performance Allowance",
      ruleType: "Earning",
      condition: "performance_rating >= 4",
      formula: "basic_salary * 0.10",
      description: "10% allowance for high performers",
      enabled: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState({
    name: "",
    ruleType: "Earning",
    condition: "",
    formula: "",
    description: "",
    enabled: true,
  });

  const handleSave = () => {
    if (currentRule.id) {
      setCustomRules(
        customRules.map((r) => (r.id === currentRule.id ? currentRule : r))
      );
    } else {
      setCustomRules([...customRules, { ...currentRule, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentRule({
      name: "",
      ruleType: "Earning",
      condition: "",
      formula: "",
      description: "",
      enabled: true,
    });
  };

  const handleEdit = (rule) => {
    setCurrentRule(rule);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this custom rule?")) {
      setCustomRules(customRules.filter((r) => r.id !== id));
    }
  };

  const handleToggle = (id) => {
    setCustomRules(
      customRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Allowance & Deduction Rules</h1>
          <p className="text-gray-600 mt-1">
            Define custom rules with conditions and formulas
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Custom Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customRules.map((rule) => (
          <Card
            key={rule.id}
            className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={() => handleToggle(rule.id)} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.ruleType === "Earning"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {rule.ruleType}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div>
                  <span className="text-xs text-gray-600 font-medium">Condition:</span>
                  <p className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded mt-1">
                    {rule.condition}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600 font-medium">Formula:</span>
                  <p className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded mt-1">
                    {rule.formula}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                <span className="font-medium">Description:</span>
                <p className="mt-1">{rule.description}</p>
              </div>

              <div className="pt-3 border-t">
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
                onClick={() => handleEdit(rule)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(rule.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentRule.id ? "Edit Custom Rule" : "Add New Custom Rule"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Rule Name
                </Label>
                <input
                  id="name"
                  type="text"
                  value={currentRule.name}
                  onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Weekend Shift Allowance"
                />
              </div>

              <div>
                <Label htmlFor="ruleType" className="text-sm font-medium text-gray-700">
                  Rule Type
                </Label>
                <select
                  id="ruleType"
                  value={currentRule.ruleType}
                  onChange={(e) => setCurrentRule({ ...currentRule, ruleType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Earning">Earning/Allowance</option>
                  <option value="Deduction">Deduction/Penalty</option>
                </select>
              </div>

              <div>
                <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
                  Condition (When to apply)
                </Label>
                <textarea
                  id="condition"
                  value={currentRule.condition}
                  onChange={(e) => setCurrentRule({ ...currentRule, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-mono text-sm"
                  rows={2}
                  placeholder="e.g., weekend_shifts > 0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use variables: attendance_days, late_arrivals, weekend_shifts, performance_rating, etc.
                </p>
              </div>

              <div>
                <Label htmlFor="formula" className="text-sm font-medium text-gray-700">
                  Formula (How to calculate)
                </Label>
                <textarea
                  id="formula"
                  value={currentRule.formula}
                  onChange={(e) => setCurrentRule({ ...currentRule, formula: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-mono text-sm"
                  rows={2}
                  placeholder="e.g., weekend_shifts * 500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use operators: +, -, *, /  |  Variables: basic_salary, gross_salary, etc.
                </p>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={currentRule.description}
                  onChange={(e) => setCurrentRule({ ...currentRule, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  rows={2}
                  placeholder="Explain what this rule does..."
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Label className="text-sm font-medium text-gray-700">Enable Rule</Label>
                <Switch
                  checked={currentRule.enabled}
                  onCheckedChange={(checked) =>
                    setCurrentRule({ ...currentRule, enabled: checked })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentRule({
                    name: "",
                    ruleType: "Earning",
                    condition: "",
                    formula: "",
                    description: "",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!currentRule.name || !currentRule.condition || !currentRule.formula}
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

export default CustomRulesSettings;

