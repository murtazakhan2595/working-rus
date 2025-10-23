import React, { useState } from "react";
import { Clock, Plus, Edit2, Trash2, Save } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const OvertimeCalculationSettings = () => {
  const [overtimeRules, setOvertimeRules] = useState([
    {
      id: 1,
      name: "Standard Overtime",
      type: "Standard",
      multiplier: 1.5,
      minHours: 0,
      maxHours: 4,
      applicableOn: "Weekdays",
      enabled: true,
    },
    {
      id: 2,
      name: "Extended Overtime",
      type: "Double",
      multiplier: 2.0,
      minHours: 4,
      maxHours: null,
      applicableOn: "Weekdays",
      enabled: true,
    },
    {
      id: 3,
      name: "Weekend Overtime",
      type: "Weekend",
      multiplier: 2.0,
      minHours: 0,
      maxHours: null,
      applicableOn: "Weekends",
      enabled: true,
    },
    {
      id: 4,
      name: "Holiday Overtime",
      type: "Holiday",
      multiplier: 2.5,
      minHours: 0,
      maxHours: null,
      applicableOn: "Holidays",
      enabled: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState({
    name: "",
    type: "Standard",
    multiplier: 1.5,
    minHours: 0,
    maxHours: null,
    applicableOn: "Weekdays",
    enabled: true,
  });

  const handleSave = () => {
    if (currentRule.id) {
      setOvertimeRules(
        overtimeRules.map((r) => (r.id === currentRule.id ? currentRule : r))
      );
    } else {
      setOvertimeRules([...overtimeRules, { ...currentRule, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentRule({
      name: "",
      type: "Standard",
      multiplier: 1.5,
      minHours: 0,
      maxHours: null,
      applicableOn: "Weekdays",
      enabled: true,
    });
  };

  const handleEdit = (rule) => {
    setCurrentRule(rule);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this overtime rule?")) {
      setOvertimeRules(overtimeRules.filter((r) => r.id !== id));
    }
  };

  const handleToggle = (id) => {
    setOvertimeRules(
      overtimeRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const getTypeColor = (type) => {
    const colors = {
      Standard: "bg-blue-100 text-blue-700",
      Double: "bg-purple-100 text-purple-700",
      Weekend: "bg-orange-100 text-orange-700",
      Holiday: "bg-red-100 text-red-700",
    };
    return colors[type] || colors.Standard;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overtime Calculation Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure standard, double, and weekend overtime calculations
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Overtime Rule
        </Button>
      </div>

      {/* Overtime Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overtimeRules.map((rule) => (
          <Card
            key={rule.id}
            className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={() => handleToggle(rule.id)} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(rule.type)}`}>
                  {rule.type}
                </span>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Multiplier</p>
                  <p className="text-3xl font-bold text-blue-600">{rule.multiplier}x</p>
                  <p className="text-xs text-gray-500 mt-1">hourly rate</p>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Hours Range:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {rule.minHours}h - {rule.maxHours ? `${rule.maxHours}h` : "Unlimited"}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Applicable On:</span>
                <span className="ml-2 font-medium text-gray-900">{rule.applicableOn}</span>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentRule.id ? "Edit Overtime Rule" : "Add New Overtime Rule"}
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
                  placeholder="e.g., Night Shift Overtime"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Overtime Type
                </Label>
                <select
                  id="type"
                  value={currentRule.type}
                  onChange={(e) => setCurrentRule({ ...currentRule, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Standard">Standard (1.5x)</option>
                  <option value="Double">Double (2x)</option>
                  <option value="Weekend">Weekend</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <Label htmlFor="multiplier" className="text-sm font-medium text-gray-700">
                  Multiplier
                </Label>
                <input
                  id="multiplier"
                  type="number"
                  step="0.1"
                  value={currentRule.multiplier}
                  onChange={(e) =>
                    setCurrentRule({ ...currentRule, multiplier: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 1.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Overtime rate = Hourly rate × Multiplier
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minHours" className="text-sm font-medium text-gray-700">
                    Min Hours
                  </Label>
                  <input
                    id="minHours"
                    type="number"
                    value={currentRule.minHours}
                    onChange={(e) =>
                      setCurrentRule({ ...currentRule, minHours: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxHours" className="text-sm font-medium text-gray-700">
                    Max Hours
                  </Label>
                  <input
                    id="maxHours"
                    type="number"
                    value={currentRule.maxHours || ""}
                    onChange={(e) =>
                      setCurrentRule({
                        ...currentRule,
                        maxHours: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="applicableOn" className="text-sm font-medium text-gray-700">
                  Applicable On
                </Label>
                <select
                  id="applicableOn"
                  value={currentRule.applicableOn}
                  onChange={(e) =>
                    setCurrentRule({ ...currentRule, applicableOn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Holidays">Holidays</option>
                  <option value="All Days">All Days</option>
                </select>
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
                    type: "Standard",
                    multiplier: 1.5,
                    minHours: 0,
                    maxHours: null,
                    applicableOn: "Weekdays",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!currentRule.name || !currentRule.multiplier}
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

export default OvertimeCalculationSettings;

