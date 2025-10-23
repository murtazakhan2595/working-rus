import React, { useState } from "react";
import { Globe, Download, Upload, Building2, MapPin } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const AfricaBankFormats = () => {
  const [selectedCountry, setSelectedCountry] = useState("ZA");
  const [isGenerating, setIsGenerating] = useState(false);

  const countryFormats = [
    {
      country: "South Africa",
      code: "ZA",
      currency: "ZAR",
      format: "CSV",
      bankName: "Standard Bank",
      employeeCount: 45,
      totalAmount: 450000,
      status: "Generated",
    },
    {
      country: "Nigeria",
      code: "NG",
      currency: "NGN",
      format: "TXT",
      bankName: "First Bank",
      employeeCount: 78,
      totalAmount: 12000000,
      status: "Pending",
    },
    {
      country: "Kenya",
      code: "KE",
      currency: "KES",
      format: "XML",
      bankName: "KCB Bank",
      employeeCount: 32,
      totalAmount: 3200000,
      status: "Generated",
    },
    {
      country: "Ghana",
      code: "GH",
      currency: "GHS",
      format: "CSV",
      bankName: "Ecobank",
      employeeCount: 28,
      totalAmount: 280000,
      status: "Failed",
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const currentCountry = countryFormats.find(c => c.code === selectedCountry);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Africa Region Bank Formats</h1>
          <p className="text-gray-600 mt-1">
            Generate payment files for African countries with local bank formats
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              Generate File
            </>
          )}
        </Button>
      </div>

      {/* Country Selection */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Country & Bank Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country
            </Label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ZA">South Africa (ZAR)</option>
              <option value="NG">Nigeria (NGN)</option>
              <option value="KE">Kenya (KES)</option>
              <option value="GH">Ghana (GHS)</option>
              <option value="EG">Egypt (EGP)</option>
              <option value="MA">Morocco (MAD)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
              Bank Name
            </Label>
            <select
              id="bankName"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {selectedCountry === "ZA" && (
                <>
                  <option value="STANDARD">Standard Bank</option>
                  <option value="ABSA">ABSA Bank</option>
                  <option value="FNB">First National Bank</option>
                </>
              )}
              {selectedCountry === "NG" && (
                <>
                  <option value="FIRST">First Bank</option>
                  <option value="ZENITH">Zenith Bank</option>
                  <option value="GTB">GTBank</option>
                </>
              )}
              {selectedCountry === "KE" && (
                <>
                  <option value="KCB">KCB Bank</option>
                  <option value="EQUITY">Equity Bank</option>
                  <option value="COOP">Cooperative Bank</option>
                </>
              )}
            </select>
          </div>

          <div>
            <Label htmlFor="payPeriod" className="text-sm font-medium text-gray-700">
              Pay Period
            </Label>
            <input
              id="payPeriod"
              type="month"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="2025-01"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Local Format</Label>
              <Switch defaultChecked />
            </div>
            <p className="text-xs text-gray-600">
              Use country-specific format
            </p>
          </div>
        </div>
      </Card>

      {/* Current Country Info */}
      {currentCountry && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentCountry.country}</h2>
              <p className="text-gray-600">Currency: {currentCountry.currency} • Format: {currentCountry.format}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{currentCountry.employeeCount}</p>
              <p className="text-sm text-gray-600">Employees</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{currentCountry.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Amount ({currentCountry.currency})</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">{currentCountry.format}</p>
              <p className="text-sm text-gray-600">File Format</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{currentCountry.bankName}</p>
              <p className="text-sm text-gray-600">Bank</p>
            </div>
          </div>
        </Card>
      )}

      {/* All Countries Overview */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All African Countries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Format</th>
                <th className="p-3 text-left">Bank</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {countryFormats.map((country) => (
                <tr
                  key={country.code}
                  className={`border-b hover:bg-gray-50 ${
                    country.code === selectedCountry ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{country.country}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">
                      {country.currency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {country.format}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{country.bankName}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold">{country.employeeCount}</td>
                  <td className="p-3 font-semibold">{country.totalAmount.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        country.status === "Generated"
                          ? "bg-green-100 text-green-700"
                          : country.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {country.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Regional Banking Standards */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">African Banking Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">South Africa (ZAR)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Format: CSV</li>
              <li>• Account: 11 digits</li>
              <li>• Branch: 6 digits</li>
              <li>• Reference: Alphanumeric</li>
              <li>• Encoding: UTF-8</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Nigeria (NGN)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Format: TXT</li>
              <li>• Account: 10 digits</li>
              <li>• Bank Code: 3 digits</li>
              <li>• Reference: Numeric</li>
              <li>• Encoding: ASCII</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Kenya (KES)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Format: XML</li>
              <li>• Account: 10 digits</li>
              <li>• Bank Code: 3 digits</li>
              <li>• Reference: Alphanumeric</li>
              <li>• Encoding: UTF-8</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Globe className="w-4 h-4 mr-2" />
          Generate {currentCountry?.format} File
        </Button>
        <Button className="bg-green-600 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload to Bank
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Regional Standards</Button>
      </div>
    </div>
  );
};

export default AfricaBankFormats;
