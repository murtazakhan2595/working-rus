import React, { useState } from "react";
import { TrendingUp, TrendingDown, Plus, Save, Edit2, Trash2, Search } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const EarningsDeductionsSettings = () => {
  const [activeTab, setActiveTab] = useState("earnings");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [components, setComponents] = useState([
    {
      id: 1,
      type: "earning",
      name: "Basic Salary",
      code: "BASIC",
      calculationType: "fixed",
      value: 0,
      isTaxable: true,
      isRecurring: true,
      enabled: true,
    },
    {
      id: 2,
      type: "earning",
      name: "House Rent Allowance",
      code: "HRA",
      calculationType: "percentage",
      value: 40,
      isTaxable: true,
      isRecurring: true,
      enabled: true,
    },
    {
      id: 3,
      type: "earning",
      name: "Transport Allowance",
      code: "TA",
      calculationType: "fixed",
      value: 1600,
      isTaxable: false,
      isRecurring: true,
      enabled: true,
    },
    {
      id: 4,
      type: "earning",
      name: "Performance Bonus",
      code: "BONUS",
      calculationType: "fixed",
      value: 0,
      isTaxable: true,
      isRecurring: false,
      enabled: true,
    },
    {
      id: 5,
      type: "deduction",
      name: "Income Tax",
      code: "INCOME_TAX",
      calculationType: "percentage",
      value: 20,
      isTaxable: false,
      isRecurring: true,
      enabled: true,
    },
    {
      id: 6,
      type: "deduction",
      name: "Provident Fund",
      code: "PF",
      calculationType: "percentage",
      value: 12,
      isTaxable: false,
      isRecurring: true,
      enabled: true,
    },
    {
      id: 7,
      type: "deduction",
      name: "Professional Tax",
      code: "PT",
      calculationType: "fixed",
      value: 200,
      isTaxable: false,
      isRecurring: true,
      enabled: true,
    },
  ]);

  const [currentComponent, setCurrentComponent] = useState({
    type: "earning",
    name: "",
    code: "",
    calculationType: "fixed",
    value: "",
    isTaxable: true,
    isRecurring: true,
    enabled: true,
  });

  const handleSaveComponent = () => {
    if (currentComponent.id) {
      setComponents(
        components.map((c) => (c.id === currentComponent.id ? currentComponent : c))
      );
    } else {
      setComponents([
        ...components,
        { ...currentComponent, id: Date.now(), type: activeTab === "earnings" ? "earning" : "deduction" },
      ]);
    }
    setIsEditing(false);
    setCurrentComponent({
      type: activeTab === "earnings" ? "earning" : "deduction",
      name: "",
      code: "",
      calculationType: "fixed",
      value: "",
      isTaxable: true,
      isRecurring: true,
      enabled: true,
    });
  };

  const handleEditComponent = (component) => {
    setCurrentComponent(component);
    setIsEditing(true);
  };

  const handleDeleteComponent = (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      setComponents(components.filter((c) => c.id !== id));
    }
  };

  const handleToggleComponent = (id) => {
    setComponents(
      components.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentComponent({
      type: activeTab === "earnings" ? "earning" : "deduction",
      name: "",
      code: "",
      calculationType: "fixed",
      value: "",
      isTaxable: true,
      isRecurring: true,
      enabled: true,
    });
  };

  const filteredComponents = components.filter(
    (c) =>
      c.type === (activeTab === "earnings" ? "earning" : "deduction") &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Deductions Configuration</h1>
          <p className="text-gray-600 mt-1">
            Configure earning and deduction components for payroll processing
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Component
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("earnings")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === "earnings"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Earnings
            </div>
          </button>
          <button
            onClick={() => setActiveTab("deductions")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === "deductions"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Deductions
            </div>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Components List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
          <Card key={component.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                {component.type === "earning" ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
              </div>
              <Switch
                checked={component.enabled}
                onCheckedChange={() => handleToggleComponent(component.id)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Code:</span>
                <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  {component.code}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Calculation:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {component.calculationType}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Value:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {component.calculationType === "percentage"
                    ? `${component.value}%`
                    : component.value || "Variable"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t">
                {component.isTaxable && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Taxable
                  </span>
                )}
                {component.isRecurring && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Recurring
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    component.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {component.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={() => handleEditComponent(component)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteComponent(component.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          {activeTab === "earnings" ? (
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          ) : (
            <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          )}
          <p className="text-gray-600">No {activeTab} components found</p>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentComponent.id
                ? "Edit Component"
                : `Add New ${activeTab === "earnings" ? "Earning" : "Deduction"}`}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="componentName" className="text-sm font-medium text-gray-700">
                  Component Name
                </Label>
                <input
                  id="componentName"
                  type="text"
                  value={currentComponent.name}
                  onChange={(e) =>
                    setCurrentComponent({ ...currentComponent, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Basic Salary"
                />
              </div>

              <div>
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Component Code
                </Label>
                <input
                  id="code"
                  type="text"
                  value={currentComponent.code}
                  onChange={(e) =>
                    setCurrentComponent({
                      ...currentComponent,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-mono"
                  placeholder="e.g., BASIC"
                />
              </div>

              <div>
                <Label htmlFor="calculationType" className="text-sm font-medium text-gray-700">
                  Calculation Type
                </Label>
                <select
                  id="calculationType"
                  value={currentComponent.calculationType}
                  onChange={(e) =>
                    setCurrentComponent({
                      ...currentComponent,
                      calculationType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                  <option value="formula">Formula Based</option>
                </select>
              </div>

              <div>
                <Label htmlFor="value" className="text-sm font-medium text-gray-700">
                  Value
                </Label>
                <input
                  id="value"
                  type="number"
                  step="0.01"
                  value={currentComponent.value}
                  onChange={(e) =>
                    setCurrentComponent({
                      ...currentComponent,
                      value: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder={
                    currentComponent.calculationType === "percentage"
                      ? "e.g., 40"
                      : "e.g., 5000"
                  }
                />
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={currentComponent.isTaxable}
                    onCheckedChange={(checked) =>
                      setCurrentComponent({ ...currentComponent, isTaxable: checked })
                    }
                  />
                  <Label className="text-sm font-medium text-gray-700">Taxable</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={currentComponent.isRecurring}
                    onCheckedChange={(checked) =>
                      setCurrentComponent({ ...currentComponent, isRecurring: checked })
                    }
                  />
                  <Label className="text-sm font-medium text-gray-700">Recurring</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={currentComponent.enabled}
                    onCheckedChange={(checked) =>
                      setCurrentComponent({ ...currentComponent, enabled: checked })
                    }
                  />
                  <Label className="text-sm font-medium text-gray-700">Enable Component</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentComponent({
                    type: activeTab === "earnings" ? "earning" : "deduction",
                    name: "",
                    code: "",
                    calculationType: "fixed",
                    value: "",
                    isTaxable: true,
                    isRecurring: true,
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveComponent}
                disabled={!currentComponent.name || !currentComponent.code}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Component
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsDeductionsSettings;

