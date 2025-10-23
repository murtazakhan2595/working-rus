import React, { useState } from "react";
import { Building2, Users, FolderTree, Plus, Save, Edit2, Trash2, Search } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const CostCentersMappingSettings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("costCenters");

  const [costCenters, setCostCenters] = useState([
    {
      id: 1,
      code: "CC001",
      name: "IT Department",
      type: "Department",
      category: "Technology",
      manager: "John Doe",
      budget: 500000,
      enabled: true,
    },
    {
      id: 2,
      code: "CC002",
      name: "HR Department",
      type: "Department",
      category: "Administration",
      manager: "Jane Smith",
      budget: 250000,
      enabled: true,
    },
    {
      id: 3,
      code: "CC003",
      name: "Sales Team",
      type: "Department",
      category: "Sales",
      manager: "Mike Johnson",
      budget: 750000,
      enabled: true,
    },
  ]);

  const [mappings, setMappings] = useState([
    {
      id: 1,
      employeeCategory: "Full-Time",
      costCenter: "IT Department",
      department: "Technology",
      allocation: 100,
      enabled: true,
    },
    {
      id: 2,
      employeeCategory: "Contract",
      costCenter: "IT Department",
      department: "Technology",
      allocation: 100,
      enabled: true,
    },
    {
      id: 3,
      employeeCategory: "Full-Time",
      costCenter: "HR Department",
      department: "Administration",
      allocation: 100,
      enabled: true,
    },
  ]);

  const [currentItem, setCurrentItem] = useState({
    code: "",
    name: "",
    type: "Department",
    category: "",
    manager: "",
    budget: "",
    enabled: true,
  });

  const [currentMapping, setCurrentMapping] = useState({
    employeeCategory: "",
    costCenter: "",
    department: "",
    allocation: 100,
    enabled: true,
  });

  const handleSaveCostCenter = () => {
    if (currentItem.id) {
      setCostCenters(
        costCenters.map((c) => (c.id === currentItem.id ? currentItem : c))
      );
    } else {
      setCostCenters([...costCenters, { ...currentItem, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentItem({
      code: "",
      name: "",
      type: "Department",
      category: "",
      manager: "",
      budget: "",
      enabled: true,
    });
  };

  const handleSaveMapping = () => {
    if (currentMapping.id) {
      setMappings(
        mappings.map((m) => (m.id === currentMapping.id ? currentMapping : m))
      );
    } else {
      setMappings([...mappings, { ...currentMapping, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentMapping({
      employeeCategory: "",
      costCenter: "",
      department: "",
      allocation: 100,
      enabled: true,
    });
  };

  const handleEditCostCenter = (item) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleEditMapping = (mapping) => {
    setCurrentMapping(mapping);
    setIsEditing(true);
  };

  const handleDeleteCostCenter = (id) => {
    if (window.confirm("Are you sure you want to delete this cost center?")) {
      setCostCenters(costCenters.filter((c) => c.id !== id));
    }
  };

  const handleDeleteMapping = (id) => {
    if (window.confirm("Are you sure you want to delete this mapping?")) {
      setMappings(mappings.filter((m) => m.id !== id));
    }
  };

  const handleToggleCostCenter = (id) => {
    setCostCenters(
      costCenters.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleToggleMapping = (id) => {
    setMappings(
      mappings.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleAddNew = () => {
    setIsEditing(true);
    if (activeTab === "costCenters") {
      setCurrentItem({
        code: "",
        name: "",
        type: "Department",
        category: "",
        manager: "",
        budget: "",
        enabled: true,
      });
    } else {
      setCurrentMapping({
        employeeCategory: "",
        costCenter: "",
        department: "",
        allocation: 100,
        enabled: true,
      });
    }
  };

  const filteredCostCenters = costCenters.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMappings = mappings.filter(
    (m) =>
      m.employeeCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.costCenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost Centers Mapping</h1>
          <p className="text-gray-600 mt-1">
            Map cost centers, departments, and employee categories
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === "costCenters" ? "Cost Center" : "Mapping"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("costCenters")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === "costCenters"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-5 h-5" />
              Cost Centers
            </div>
          </button>
          <button
            onClick={() => setActiveTab("mappings")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === "mappings"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FolderTree className="w-5 h-5" />
              Category Mappings
            </div>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cost Centers List */}
      {activeTab === "costCenters" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCostCenters.map((center) => (
            <Card key={center.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                </div>
                <Switch
                  checked={center.enabled}
                  onCheckedChange={() => handleToggleCostCenter(center.id)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Code:</span>
                  <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {center.code}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium text-gray-900">{center.type}</span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium text-gray-900">{center.category}</span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Manager:</span>
                  <span className="ml-2 font-medium text-gray-900">{center.manager}</span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    ${center.budget.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      center.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {center.enabled ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  onClick={() => handleEditCostCenter(center)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteCostCenter(center.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Mappings List */}
      {activeTab === "mappings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMappings.map((mapping) => (
            <Card key={mapping.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mapping.employeeCategory}
                  </h3>
                </div>
                <Switch
                  checked={mapping.enabled}
                  onCheckedChange={() => handleToggleMapping(mapping.id)}
                />
              </div>

              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Cost Center:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {mapping.costCenter}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Department:</span>
                  <span className="ml-2 font-medium text-gray-900">{mapping.department}</span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Allocation:</span>
                  <span className="ml-2 font-medium text-gray-900">{mapping.allocation}%</span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
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

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  onClick={() => handleEditMapping(mapping)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteMapping(mapping.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Modal for Cost Centers */}
      {isEditing && activeTab === "costCenters" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentItem.id ? "Edit Cost Center" : "Add New Cost Center"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Code
                </Label>
                <input
                  id="code"
                  type="text"
                  value={currentItem.code}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-mono"
                  placeholder="e.g., CC001"
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <input
                  id="name"
                  type="text"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., IT Department"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Type
                </Label>
                <select
                  id="type"
                  value={currentItem.type}
                  onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Department">Department</option>
                  <option value="Project">Project</option>
                  <option value="Location">Location</option>
                  <option value="Division">Division</option>
                </select>
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <input
                  id="category"
                  type="text"
                  value={currentItem.category}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Technology"
                />
              </div>

              <div>
                <Label htmlFor="manager" className="text-sm font-medium text-gray-700">
                  Manager
                </Label>
                <input
                  id="manager"
                  type="text"
                  value={currentItem.manager}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, manager: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                  Budget
                </Label>
                <input
                  id="budget"
                  type="number"
                  value={currentItem.budget}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, budget: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 500000"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={currentItem.enabled}
                  onCheckedChange={(checked) =>
                    setCurrentItem({ ...currentItem, enabled: checked })
                  }
                />
                <Label className="text-sm font-medium text-gray-700">Enable Cost Center</Label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentItem({
                    code: "",
                    name: "",
                    type: "Department",
                    category: "",
                    manager: "",
                    budget: "",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCostCenter}
                disabled={!currentItem.code || !currentItem.name}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal for Mappings */}
      {isEditing && activeTab === "mappings" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentMapping.id ? "Edit Mapping" : "Add New Mapping"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeCategory" className="text-sm font-medium text-gray-700">
                  Employee Category
                </Label>
                <select
                  id="employeeCategory"
                  value={currentMapping.employeeCategory}
                  onChange={(e) =>
                    setCurrentMapping({ ...currentMapping, employeeCategory: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Category</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div>
                <Label htmlFor="costCenter" className="text-sm font-medium text-gray-700">
                  Cost Center
                </Label>
                <select
                  id="costCenter"
                  value={currentMapping.costCenter}
                  onChange={(e) =>
                    setCurrentMapping({ ...currentMapping, costCenter: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Cost Center</option>
                  {costCenters.map((center) => (
                    <option key={center.id} value={center.name}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                  Department
                </Label>
                <input
                  id="department"
                  type="text"
                  value={currentMapping.department}
                  onChange={(e) =>
                    setCurrentMapping({ ...currentMapping, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Technology"
                />
              </div>

              <div>
                <Label htmlFor="allocation" className="text-sm font-medium text-gray-700">
                  Allocation (%)
                </Label>
                <input
                  id="allocation"
                  type="number"
                  min="0"
                  max="100"
                  value={currentMapping.allocation}
                  onChange={(e) =>
                    setCurrentMapping({
                      ...currentMapping,
                      allocation: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 100"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={currentMapping.enabled}
                  onCheckedChange={(checked) =>
                    setCurrentMapping({ ...currentMapping, enabled: checked })
                  }
                />
                <Label className="text-sm font-medium text-gray-700">Enable Mapping</Label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentMapping({
                    employeeCategory: "",
                    costCenter: "",
                    department: "",
                    allocation: 100,
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMapping}
                disabled={
                  !currentMapping.employeeCategory ||
                  !currentMapping.costCenter ||
                  !currentMapping.department
                }
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Mapping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCentersMappingSettings;

