import React, { useState } from "react";
import { Globe, DollarSign, Plus, Save, Edit2, Trash2, Search } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const CountryCurrencySettings = () => {
  const [countries, setCountries] = useState([
    {
      id: 1,
      country: "United Kingdom",
      countryCode: "GB",
      currency: "GBP",
      currencySymbol: "£",
      exchangeRate: 1.27,
      enabled: true,
    },
    {
      id: 2,
      country: "India",
      countryCode: "IN",
      currency: "INR",
      currencySymbol: "₹",
      exchangeRate: 83.12,
      enabled: true,
    },
    {
      id: 3,
      country: "Pakistan",
      countryCode: "PK",
      currency: "PKR",
      currencySymbol: "₨",
      exchangeRate: 277.85,
      enabled: true,
    },
    {
      id: 4,
      country: "South Africa",
      countryCode: "ZA",
      currency: "ZAR",
      currencySymbol: "R",
      exchangeRate: 18.65,
      enabled: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCountry, setCurrentCountry] = useState({
    country: "",
    countryCode: "",
    currency: "",
    currencySymbol: "",
    exchangeRate: "",
    enabled: true,
  });

  const handleSaveCountry = () => {
    if (currentCountry.id) {
      setCountries(
        countries.map((c) => (c.id === currentCountry.id ? currentCountry : c))
      );
    } else {
      setCountries([...countries, { ...currentCountry, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentCountry({
      country: "",
      countryCode: "",
      currency: "",
      currencySymbol: "",
      exchangeRate: "",
      enabled: true,
    });
  };

  const handleEditCountry = (country) => {
    setCurrentCountry(country);
    setIsEditing(true);
  };

  const handleDeleteCountry = (id) => {
    if (window.confirm("Are you sure you want to delete this country configuration?")) {
      setCountries(countries.filter((c) => c.id !== id));
    }
  };

  const handleToggleCountry = (id) => {
    setCountries(
      countries.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentCountry({
      country: "",
      countryCode: "",
      currency: "",
      currencySymbol: "",
      exchangeRate: "",
      enabled: true,
    });
  };

  const filteredCountries = countries.filter(
    (c) =>
      c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Country & Currency Management</h1>
          <p className="text-gray-600 mt-1">
            Configure multiple countries and currencies for global payroll processing
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Country
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by country or currency..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Countries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <Card key={country.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{country.country}</h3>
              </div>
              <Switch
                checked={country.enabled}
                onCheckedChange={() => handleToggleCountry(country.id)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Code:</span>
                <span className="font-medium text-gray-900">{country.countryCode}</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Currency:</span>
                <span className="text-sm font-medium text-gray-900">
                  {country.currency} ({country.currencySymbol})
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Exchange Rate:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {country.exchangeRate} (vs USD)
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    country.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {country.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={() => handleEditCountry(country)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteCountry(country.id)}
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
              {currentCountry.id ? "Edit Country" : "Add New Country"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country Name
                </Label>
                <input
                  id="country"
                  type="text"
                  value={currentCountry.country}
                  onChange={(e) =>
                    setCurrentCountry({ ...currentCountry, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Enter country name"
                />
              </div>

              <div>
                <Label htmlFor="countryCode" className="text-sm font-medium text-gray-700">
                  Country Code
                </Label>
                <input
                  id="countryCode"
                  type="text"
                  value={currentCountry.countryCode}
                  onChange={(e) =>
                    setCurrentCountry({
                      ...currentCountry,
                      countryCode: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., GB, IN, PK"
                  maxLength={2}
                />
              </div>

              <div>
                <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                  Currency Code
                </Label>
                <input
                  id="currency"
                  type="text"
                  value={currentCountry.currency}
                  onChange={(e) =>
                    setCurrentCountry({
                      ...currentCountry,
                      currency: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., GBP, INR, PKR"
                  maxLength={3}
                />
              </div>

              <div>
                <Label htmlFor="currencySymbol" className="text-sm font-medium text-gray-700">
                  Currency Symbol
                </Label>
                <input
                  id="currencySymbol"
                  type="text"
                  value={currentCountry.currencySymbol}
                  onChange={(e) =>
                    setCurrentCountry({
                      ...currentCountry,
                      currencySymbol: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., £, ₹, ₨"
                />
              </div>

              <div>
                <Label htmlFor="exchangeRate" className="text-sm font-medium text-gray-700">
                  Exchange Rate (vs USD)
                </Label>
                <input
                  id="exchangeRate"
                  type="number"
                  step="0.01"
                  value={currentCountry.exchangeRate}
                  onChange={(e) =>
                    setCurrentCountry({
                      ...currentCountry,
                      exchangeRate: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., 83.12"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={currentCountry.enabled}
                  onCheckedChange={(checked) =>
                    setCurrentCountry({ ...currentCountry, enabled: checked })
                  }
                />
                <Label className="text-sm font-medium text-gray-700">Enable Country</Label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentCountry({
                    country: "",
                    countryCode: "",
                    currency: "",
                    currencySymbol: "",
                    exchangeRate: "",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCountry}
                disabled={
                  !currentCountry.country ||
                  !currentCountry.countryCode ||
                  !currentCountry.currency
                }
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

export default CountryCurrencySettings;

