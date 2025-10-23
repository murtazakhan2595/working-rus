import React, { useState } from "react";
import { Globe, Plus, Edit2, Trash2, Save, Filter } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const StatutoryContributionsSettings = () => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [contributions, setContributions] = useState([
    {
      id: 1,
      country: "United Kingdom",
      countryCode: "GB",
      name: "National Insurance - Employee",
      type: "Social Security",
      employeeRate: 12,
      employerRate: 13.8,
      threshold: 9568,
      enabled: true,
    },
    {
      id: 2,
      country: "India",
      countryCode: "IN",
      name: "Provident Fund",
      type: "Pension",
      employeeRate: 12,
      employerRate: 12,
      threshold: 0,
      maxAmount: 1800,
      enabled: true,
    },
    {
      id: 3,
      country: "India",
      countryCode: "IN",
      name: "ESI",
      type: "Health Insurance",
      employeeRate: 0.75,
      employerRate: 3.25,
      threshold: 0,
      maxAmount: 21000,
      enabled: true,
    },
    {
      id: 4,
      country: "Pakistan",
      countryCode: "PK",
      name: "EOBI",
      type: "Social Security",
      employeeRate: 1,
      employerRate: 5,
      threshold: 0,
      enabled: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentContribution, setCurrentContribution] = useState({
    country: "",
    countryCode: "",
    name: "",
    type: "Social Security",
    employeeRate: 0,
    employerRate: 0,
    threshold: 0,
    maxAmount: null,
    enabled: true,
  });

  const countries = [
    { code: "all", name: "All Countries" },
    { code: "GB", name: "United Kingdom" },
    { code: "IN", name: "India" },
    { code: "PK", name: "Pakistan" },
    { code: "ZA", name: "South Africa" },
  ];

  const handleSave = () => {
    if (currentContribution.id) {
      setContributions(
        contributions.map((c) => (c.id === currentContribution.id ? currentContribution : c))
      );
    } else {
      setContributions([...contributions, { ...currentContribution, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentContribution({
      country: "",
      countryCode: "",
      name: "",
      type: "Social Security",
      employeeRate: 0,
      employerRate: 0,
      threshold: 0,
      maxAmount: null,
      enabled: true,
    });
  };

  const handleEdit = (contribution) => {
    setCurrentContribution(contribution);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this statutory contribution?")) {
      setContributions(contributions.filter((c) => c.id !== id));
    }
  };

  const handleToggle = (id) => {
    setContributions(
      contributions.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const filteredContributions =
    selectedCountry === "all"
      ? contributions
      : contributions.filter((c) => c.countryCode === selectedCountry);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statutory Contributions</h1>
          <p className="text-gray-600 mt-1">
            Country-specific statutory contribution calculations
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Contribution
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <Label className="text-sm font-medium text-gray-700">Filter by Country:</Label>
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

      {/* Contributions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContributions.map((contribution) => (
          <Card
            key={contribution.id}
            className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{contribution.name}</h3>
                  <p className="text-sm text-gray-600">
                    {contribution.country} ({contribution.countryCode})
                  </p>
                </div>
              </div>
              <Switch
                checked={contribution.enabled}
                onCheckedChange={() => handleToggle(contribution.id)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  {contribution.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Employee Rate</p>
                  <p className="text-xl font-bold text-blue-600">{contribution.employeeRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Employer Rate</p>
                  <p className="text-xl font-bold text-green-600">{contribution.employerRate}%</p>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Threshold:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {contribution.threshold.toLocaleString()}
                </span>
              </div>

              {contribution.maxAmount && (
                <div className="text-sm">
                  <span className="text-gray-600">Max Amount:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {contribution.maxAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contribution.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {contribution.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={() => handleEdit(contribution)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(contribution.id)}
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
              {currentContribution.id ? "Edit Contribution" : "Add New Contribution"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country
                </Label>
                <select
                  id="country"
                  value={currentContribution.countryCode}
                  onChange={(e) => {
                    const selected = countries.find((c) => c.code === e.target.value);
                    setCurrentContribution({
                      ...currentContribution,
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
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Contribution Name
                </Label>
                <input
                  id="name"
                  type="text"
                  value={currentContribution.name}
                  onChange={(e) =>
                    setCurrentContribution({ ...currentContribution, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Social Security"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Type
                </Label>
                <select
                  id="type"
                  value={currentContribution.type}
                  onChange={(e) =>
                    setCurrentContribution({ ...currentContribution, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Social Security">Social Security</option>
                  <option value="Pension">Pension</option>
                  <option value="Health Insurance">Health Insurance</option>
                  <option value="Unemployment">Unemployment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeRate" className="text-sm font-medium text-gray-700">
                    Employee Rate (%)
                  </Label>
                  <input
                    id="employeeRate"
                    type="number"
                    step="0.01"
                    value={currentContribution.employeeRate}
                    onChange={(e) =>
                      setCurrentContribution({
                        ...currentContribution,
                        employeeRate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="employerRate" className="text-sm font-medium text-gray-700">
                    Employer Rate (%)
                  </Label>
                  <input
                    id="employerRate"
                    type="number"
                    step="0.01"
                    value={currentContribution.employerRate}
                    onChange={(e) =>
                      setCurrentContribution({
                        ...currentContribution,
                        employerRate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="threshold" className="text-sm font-medium text-gray-700">
                  Threshold Amount
                </Label>
                <input
                  id="threshold"
                  type="number"
                  value={currentContribution.threshold}
                  onChange={(e) =>
                    setCurrentContribution({
                      ...currentContribution,
                      threshold: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="maxAmount" className="text-sm font-medium text-gray-700">
                  Max Amount (Optional)
                </Label>
                <input
                  id="maxAmount"
                  type="number"
                  value={currentContribution.maxAmount || ""}
                  onChange={(e) =>
                    setCurrentContribution({
                      ...currentContribution,
                      maxAmount: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="No limit"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Label className="text-sm font-medium text-gray-700">Enable</Label>
                <Switch
                  checked={currentContribution.enabled}
                  onCheckedChange={(checked) =>
                    setCurrentContribution({ ...currentContribution, enabled: checked })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentContribution({
                    country: "",
                    countryCode: "",
                    name: "",
                    type: "Social Security",
                    employeeRate: 0,
                    employerRate: 0,
                    threshold: 0,
                    maxAmount: null,
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!currentContribution.name || !currentContribution.country}
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

export default StatutoryContributionsSettings;

