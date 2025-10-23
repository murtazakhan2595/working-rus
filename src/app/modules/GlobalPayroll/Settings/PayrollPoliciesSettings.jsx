import React, { useState } from "react";
import { Calendar, Clock, Plus, Save, Edit2, Trash2 } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const PayrollPoliciesSettings = () => {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: "Monthly Payroll",
      frequency: "monthly",
      paymentDay: 25,
      cutoffDay: 23,
      enabled: true,
    },
    {
      id: 2,
      name: "Weekly Payroll",
      frequency: "weekly",
      paymentDay: "Friday",
      cutoffDay: "Wednesday",
      enabled: false,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState({
    name: "",
    frequency: "monthly",
    paymentDay: "",
    cutoffDay: "",
    enabled: true,
  });

  const handleSavePolicy = () => {
    if (currentPolicy.id) {
      setPolicies(
        policies.map((p) => (p.id === currentPolicy.id ? currentPolicy : p))
      );
    } else {
      setPolicies([...policies, { ...currentPolicy, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentPolicy({
      name: "",
      frequency: "monthly",
      paymentDay: "",
      cutoffDay: "",
      enabled: true,
    });
  };

  const handleEditPolicy = (policy) => {
    setCurrentPolicy(policy);
    setIsEditing(true);
  };

  const handleDeletePolicy = (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      setPolicies(policies.filter((p) => p.id !== id));
    }
  };

  const handleTogglePolicy = (id) => {
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentPolicy({
      name: "",
      frequency: "monthly",
      paymentDay: "",
      cutoffDay: "",
      enabled: true,
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Policies</h1>
          <p className="text-gray-600 mt-1">
            Define company payroll policies including monthly, weekly, and custom cycles
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add New Policy
        </Button>
      </div>

      {/* Policies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <Card key={policy.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{policy.name}</h3>
              </div>
              <Switch
                checked={policy.enabled}
                onCheckedChange={() => handleTogglePolicy(policy.id)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {policy.frequency}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Payment Day:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {policy.paymentDay}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Cutoff Day:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {policy.cutoffDay}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    policy.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {policy.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={() => handleEditPolicy(policy)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeletePolicy(policy.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentPolicy.id ? "Edit Policy" : "Create New Policy"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="policyName" className="text-sm font-medium text-gray-700">
                  Policy Name
                </Label>
                <input
                  id="policyName"
                  type="text"
                  value={currentPolicy.name}
                  onChange={(e) =>
                    setCurrentPolicy({ ...currentPolicy, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Enter policy name"
                />
              </div>

              <div>
                <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
                  Frequency
                </Label>
                <select
                  id="frequency"
                  value={currentPolicy.frequency}
                  onChange={(e) =>
                    setCurrentPolicy({ ...currentPolicy, frequency: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="semi-monthly">Semi-Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <Label htmlFor="paymentDay" className="text-sm font-medium text-gray-700">
                  Payment Day
                </Label>
                <input
                  id="paymentDay"
                  type="text"
                  value={currentPolicy.paymentDay}
                  onChange={(e) =>
                    setCurrentPolicy({ ...currentPolicy, paymentDay: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 25 or Friday"
                />
              </div>

              <div>
                <Label htmlFor="cutoffDay" className="text-sm font-medium text-gray-700">
                  Cutoff Day
                </Label>
                <input
                  id="cutoffDay"
                  type="text"
                  value={currentPolicy.cutoffDay}
                  onChange={(e) =>
                    setCurrentPolicy({ ...currentPolicy, cutoffDay: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 23 or Wednesday"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={currentPolicy.enabled}
                  onCheckedChange={(checked) =>
                    setCurrentPolicy({ ...currentPolicy, enabled: checked })
                  }
                />
                <Label className="text-sm font-medium text-gray-700">Enable Policy</Label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPolicy({
                    name: "",
                    frequency: "monthly",
                    paymentDay: "",
                    cutoffDay: "",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePolicy}
                disabled={!currentPolicy.name || !currentPolicy.paymentDay}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Policy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPoliciesSettings;

