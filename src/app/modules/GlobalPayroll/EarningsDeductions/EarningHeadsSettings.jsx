import React, { useState } from "react";
import { TrendingUp, Plus, Edit2, Trash2, Save, DollarSign } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const EarningHeadsSettings = () => {
  const [earningHeads, setEarningHeads] = useState([
    {
      id: 1,
      name: "Basic Salary",
      code: "BASIC",
      calculationType: "Fixed",
      percentage: null,
      isTaxable: true,
      isRecurring: true,
      displayOrder: 1,
      enabled: true,
    },
    {
      id: 2,
      name: "House Rent Allowance",
      code: "HRA",
      calculationType: "Percentage",
      percentage: 40,
      isTaxable: true,
      isRecurring: true,
      displayOrder: 2,
      enabled: true,
    },
    {
      id: 3,
      name: "Transport Allowance",
      code: "TA",
      calculationType: "Fixed",
      percentage: null,
      isTaxable: false,
      isRecurring: true,
      displayOrder: 3,
      enabled: true,
    },
    {
      id: 4,
      name: "Medical Allowance",
      code: "MED",
      calculationType: "Fixed",
      percentage: null,
      isTaxable: false,
      isRecurring: true,
      displayOrder: 4,
      enabled: true,
    },
    {
      id: 5,
      name: "Special Allowance",
      code: "SPEC",
      calculationType: "Fixed",
      percentage: null,
      isTaxable: true,
      isRecurring: true,
      displayOrder: 5,
      enabled: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentHead, setCurrentHead] = useState({
    name: "",
    code: "",
    calculationType: "Fixed",
    percentage: null,
    isTaxable: true,
    isRecurring: true,
    displayOrder: earningHeads.length + 1,
    enabled: true,
  });

  const handleSave = () => {
    if (currentHead.id) {
      setEarningHeads(
        earningHeads.map((h) => (h.id === currentHead.id ? currentHead : h))
      );
    } else {
      setEarningHeads([...earningHeads, { ...currentHead, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentHead({
      name: "",
      code: "",
      calculationType: "Fixed",
      percentage: null,
      isTaxable: true,
      isRecurring: true,
      displayOrder: earningHeads.length + 2,
      enabled: true,
    });
  };

  const handleEdit = (head) => {
    setCurrentHead(head);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this earning head?")) {
      setEarningHeads(earningHeads.filter((h) => h.id !== id));
    }
  };

  const handleToggle = (id) => {
    setEarningHeads(
      earningHeads.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h))
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earning Heads Configuration</h1>
          <p className="text-gray-600 mt-1">
            Configure earning heads like Basic, HRA, Transport, etc.
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Earning Head
        </Button>
      </div>

      {/* Earning Heads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {earningHeads
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((head) => (
            <Card
              key={head.id}
              className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{head.name}</h3>
                </div>
                <Switch checked={head.enabled} onCheckedChange={() => handleToggle(head.id)} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Code:</span>
                  <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {head.code}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Calculation:</span>
                  <span className="ml-2 font-medium text-gray-900">{head.calculationType}</span>
                  {head.percentage && (
                    <span className="ml-1 text-blue-600">({head.percentage}%)</span>
                  )}
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Order:</span>
                  <span className="ml-2 font-medium text-gray-900">{head.displayOrder}</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t">
                  {head.isTaxable && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      Taxable
                    </span>
                  )}
                  {head.isRecurring && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Recurring
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      head.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {head.enabled ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  onClick={() => handleEdit(head)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(head.id)}
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
              {currentHead.id ? "Edit Earning Head" : "Add New Earning Head"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Earning Name
                </Label>
                <input
                  id="name"
                  type="text"
                  value={currentHead.name}
                  onChange={(e) => setCurrentHead({ ...currentHead, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Dearness Allowance"
                />
              </div>

              <div>
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Code
                </Label>
                <input
                  id="code"
                  type="text"
                  value={currentHead.code}
                  onChange={(e) =>
                    setCurrentHead({ ...currentHead, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-mono"
                  placeholder="e.g., DA"
                />
              </div>

              <div>
                <Label htmlFor="calculationType" className="text-sm font-medium text-gray-700">
                  Calculation Type
                </Label>
                <select
                  id="calculationType"
                  value={currentHead.calculationType}
                  onChange={(e) =>
                    setCurrentHead({ ...currentHead, calculationType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Fixed">Fixed Amount</option>
                  <option value="Percentage">Percentage of Basic</option>
                  <option value="Formula">Formula Based</option>
                </select>
              </div>

              {currentHead.calculationType === "Percentage" && (
                <div>
                  <Label htmlFor="percentage" className="text-sm font-medium text-gray-700">
                    Percentage (%)
                  </Label>
                  <input
                    id="percentage"
                    type="number"
                    step="0.01"
                    value={currentHead.percentage || ""}
                    onChange={(e) =>
                      setCurrentHead({ ...currentHead, percentage: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    placeholder="e.g., 40"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="displayOrder" className="text-sm font-medium text-gray-700">
                  Display Order
                </Label>
                <input
                  id="displayOrder"
                  type="number"
                  value={currentHead.displayOrder}
                  onChange={(e) =>
                    setCurrentHead({ ...currentHead, displayOrder: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Taxable</Label>
                  <Switch
                    checked={currentHead.isTaxable}
                    onCheckedChange={(checked) =>
                      setCurrentHead({ ...currentHead, isTaxable: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Recurring</Label>
                  <Switch
                    checked={currentHead.isRecurring}
                    onCheckedChange={(checked) =>
                      setCurrentHead({ ...currentHead, isRecurring: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Enable</Label>
                  <Switch
                    checked={currentHead.enabled}
                    onCheckedChange={(checked) =>
                      setCurrentHead({ ...currentHead, enabled: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentHead({
                    name: "",
                    code: "",
                    calculationType: "Fixed",
                    percentage: null,
                    isTaxable: true,
                    isRecurring: true,
                    displayOrder: earningHeads.length + 1,
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!currentHead.name || !currentHead.code}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningHeadsSettings;

