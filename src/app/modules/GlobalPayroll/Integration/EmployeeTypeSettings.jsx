import React, { useState } from "react";
import { UserCircle, Briefcase, FileText, Plus, Edit2, Trash2 } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const EmployeeTypeSettings = () => {
  const [employeeTypes, setEmployeeTypes] = useState([
    {
      id: 1,
      type: "Permanent",
      code: "PERM",
      payrollCycle: "Monthly",
      benefitsIncluded: true,
      overtimeEligible: false,
      taxDeduction: true,
      pfApplicable: true,
      gratuityApplicable: true,
      noticePeriod: 90,
      employeeCount: 450,
      enabled: true,
    },
    {
      id: 2,
      type: "Contract",
      code: "CONT",
      payrollCycle: "Monthly",
      benefitsIncluded: false,
      overtimeEligible: true,
      taxDeduction: true,
      pfApplicable: false,
      gratuityApplicable: false,
      noticePeriod: 30,
      employeeCount: 120,
      enabled: true,
    },
    {
      id: 3,
      type: "Part-Time",
      code: "PT",
      payrollCycle: "Bi-Weekly",
      benefitsIncluded: false,
      overtimeEligible: true,
      taxDeduction: false,
      pfApplicable: false,
      gratuityApplicable: false,
      noticePeriod: 15,
      employeeCount: 45,
      enabled: true,
    },
    {
      id: 4,
      type: "Consultant",
      code: "CONS",
      payrollCycle: "Custom",
      benefitsIncluded: false,
      overtimeEligible: false,
      taxDeduction: true,
      pfApplicable: false,
      gratuityApplicable: false,
      noticePeriod: 0,
      employeeCount: 28,
      enabled: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentType, setCurrentType] = useState({
    type: "",
    code: "",
    payrollCycle: "Monthly",
    benefitsIncluded: false,
    overtimeEligible: false,
    taxDeduction: true,
    pfApplicable: false,
    gratuityApplicable: false,
    noticePeriod: 0,
    enabled: true,
  });

  const handleSaveType = () => {
    if (currentType.id) {
      setEmployeeTypes(
        employeeTypes.map((t) => (t.id === currentType.id ? currentType : t))
      );
    } else {
      setEmployeeTypes([
        ...employeeTypes,
        { ...currentType, id: Date.now(), employeeCount: 0 },
      ]);
    }
    setIsEditing(false);
    setCurrentType({
      type: "",
      code: "",
      payrollCycle: "Monthly",
      benefitsIncluded: false,
      overtimeEligible: false,
      taxDeduction: true,
      pfApplicable: false,
      gratuityApplicable: false,
      noticePeriod: 0,
      enabled: true,
    });
  };

  const handleEditType = (type) => {
    setCurrentType(type);
    setIsEditing(true);
  };

  const handleDeleteType = (id) => {
    if (window.confirm("Are you sure you want to delete this employee type?")) {
      setEmployeeTypes(employeeTypes.filter((t) => t.id !== id));
    }
  };

  const handleToggleType = (id) => {
    setEmployeeTypes(
      employeeTypes.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentType({
      type: "",
      code: "",
      payrollCycle: "Monthly",
      benefitsIncluded: false,
      overtimeEligible: false,
      taxDeduction: true,
      pfApplicable: false,
      gratuityApplicable: false,
      noticePeriod: 0,
      enabled: true,
    });
  };

  const getTypeIcon = (type) => {
    if (type === "Permanent") return <UserCircle className="w-5 h-5 text-green-600" />;
    if (type === "Contract") return <Briefcase className="w-5 h-5 text-blue-600" />;
    if (type === "Part-Time") return <UserCircle className="w-5 h-5 text-orange-600" />;
    return <FileText className="w-5 h-5 text-purple-600" />;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Type Support</h1>
          <p className="text-gray-600 mt-1">
            Configure payroll settings for contract and permanent employees
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Employee Type
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {employeeTypes.map((type) => (
          <Card key={type.id} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(type.type)}
              <h3 className="font-semibold text-gray-900">{type.type}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{type.employeeCount}</p>
            <p className="text-xs text-gray-600">Employees</p>
          </Card>
        ))}
      </div>

      {/* Employee Types Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employeeTypes.map((type) => (
          <Card key={type.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(type.type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{type.type}</h3>
                  <p className="text-sm text-gray-600">
                    Code: <span className="font-mono">{type.code}</span>
                  </p>
                </div>
              </div>
              <Switch
                checked={type.enabled}
                onCheckedChange={() => handleToggleType(type.id)}
              />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm">
                  <span className="text-gray-600">Payroll Cycle:</span>
                  <p className="font-medium text-gray-900">{type.payrollCycle}</p>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Notice Period:</span>
                  <p className="font-medium text-gray-900">{type.noticePeriod} days</p>
                </div>
              </div>

              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Benefits Included:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      type.benefitsIncluded
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {type.benefitsIncluded ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Overtime Eligible:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      type.overtimeEligible
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {type.overtimeEligible ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax Deduction:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      type.taxDeduction
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {type.taxDeduction ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">PF Applicable:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      type.pfApplicable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {type.pfApplicable ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gratuity:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      type.gratuityApplicable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {type.gratuityApplicable ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t">
                <span className="text-sm text-gray-600">Employees:</span>
                <span className="text-sm font-bold text-gray-900">{type.employeeCount}</span>
                <span
                  className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                    type.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {type.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={() => handleEditType(type)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteType(type.id)}
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
              {currentType.id ? "Edit Employee Type" : "Add Employee Type"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Employee Type
                </Label>
                <input
                  id="type"
                  type="text"
                  value={currentType.type}
                  onChange={(e) => setCurrentType({ ...currentType, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Intern"
                />
              </div>

              <div>
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Code
                </Label>
                <input
                  id="code"
                  type="text"
                  value={currentType.code}
                  onChange={(e) =>
                    setCurrentType({ ...currentType, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-mono"
                  placeholder="e.g., INTR"
                  maxLength={6}
                />
              </div>

              <div>
                <Label htmlFor="payrollCycle" className="text-sm font-medium text-gray-700">
                  Payroll Cycle
                </Label>
                <select
                  id="payrollCycle"
                  value={currentType.payrollCycle}
                  onChange={(e) =>
                    setCurrentType({ ...currentType, payrollCycle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <Label htmlFor="noticePeriod" className="text-sm font-medium text-gray-700">
                  Notice Period (Days)
                </Label>
                <input
                  id="noticePeriod"
                  type="number"
                  value={currentType.noticePeriod}
                  onChange={(e) =>
                    setCurrentType({ ...currentType, noticePeriod: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 30"
                />
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Benefits Included</Label>
                  <Switch
                    checked={currentType.benefitsIncluded}
                    onCheckedChange={(checked) =>
                      setCurrentType({ ...currentType, benefitsIncluded: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Overtime Eligible</Label>
                  <Switch
                    checked={currentType.overtimeEligible}
                    onCheckedChange={(checked) =>
                      setCurrentType({ ...currentType, overtimeEligible: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Tax Deduction</Label>
                  <Switch
                    checked={currentType.taxDeduction}
                    onCheckedChange={(checked) =>
                      setCurrentType({ ...currentType, taxDeduction: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">PF Applicable</Label>
                  <Switch
                    checked={currentType.pfApplicable}
                    onCheckedChange={(checked) =>
                      setCurrentType({ ...currentType, pfApplicable: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Gratuity Applicable</Label>
                  <Switch
                    checked={currentType.gratuityApplicable}
                    onCheckedChange={(checked) =>
                      setCurrentType({ ...currentType, gratuityApplicable: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Enable Type</Label>
                  <Switch
                    checked={currentType.enabled}
                    onCheckedChange={(checked) =>
                      setCurrentType({ ...currentType, enabled: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentType({
                    type: "",
                    code: "",
                    payrollCycle: "Monthly",
                    benefitsIncluded: false,
                    overtimeEligible: false,
                    taxDeduction: true,
                    pfApplicable: false,
                    gratuityApplicable: false,
                    noticePeriod: 0,
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveType}
                disabled={!currentType.type || !currentType.code}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                Save Type
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTypeSettings;

