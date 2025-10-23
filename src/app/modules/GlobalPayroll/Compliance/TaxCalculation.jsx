import React, { useState } from "react";
import { Calculator, Globe, RefreshCw, Download } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const TaxCalculation = () => {
  const [selectedCountry, setSelectedCountry] = useState("GB");
  const [isCalculating, setIsCalculating] = useState(false);

  const countries = [
    { code: "GB", name: "United Kingdom", taxSystem: "PAYE" },
    { code: "IN", name: "India", taxSystem: "Income Tax Act" },
    { code: "PK", name: "Pakistan", taxSystem: "Income Tax Ordinance" },
    { code: "ZA", name: "South Africa", taxSystem: "SARS" },
    { code: "KE", name: "Kenya", taxSystem: "KRA" },
    { code: "NG", name: "Nigeria", taxSystem: "FIRS" },
  ];

  const taxSlabs = {
    GB: [
      { range: "£0 - £12,570", rate: "0%", amount: "£0" },
      { range: "£12,571 - £50,270", rate: "20%", amount: "Variable" },
      { range: "£50,271 - £125,140", rate: "40%", amount: "Variable" },
      { range: "£125,141+", rate: "45%", amount: "Variable" },
    ],
    IN: [
      { range: "₹0 - ₹2,50,000", rate: "0%", amount: "₹0" },
      { range: "₹2,50,001 - ₹5,00,000", rate: "5%", amount: "Variable" },
      { range: "₹5,00,001 - ₹10,00,000", rate: "20%", amount: "Variable" },
      { range: "₹10,00,001+", rate: "30%", amount: "Variable" },
    ],
    PK: [
      { range: "Rs 0 - Rs 600,000", rate: "0%", amount: "Rs 0" },
      { range: "Rs 600,001 - Rs 1,200,000", rate: "5%", amount: "Variable" },
      { range: "Rs 1,200,001 - Rs 2,400,000", rate: "15%", amount: "Variable" },
      { range: "Rs 2,400,001+", rate: "25%", amount: "Variable" },
    ],
    ZA: [
      { range: "R0 - R95,750", rate: "0%", amount: "R0" },
      { range: "R95,751 - R237,100", rate: "18%", amount: "Variable" },
      { range: "R237,101 - R370,500", rate: "26%", amount: "Variable" },
      { range: "R370,501+", rate: "31%", amount: "Variable" },
    ],
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 1500);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automated Tax Calculation</h1>
          <p className="text-gray-600 mt-1">
            UK PAYE, African local tax rules, India, Pakistan tax calculations
          </p>
        </div>
        <Button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              Calculate Tax
            </>
          )}
        </Button>
      </div>

      {/* Country Selection */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-4">
          <Globe className="w-6 h-6 text-blue-600" />
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700">Select Country</Label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} - {country.taxSystem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Tax System Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {countries.find((c) => c.code === selectedCountry)?.taxSystem} System
        </h2>
        <p className="text-gray-700 text-sm">
          {selectedCountry === "GB" && "Pay As You Earn (PAYE) - UK tax deduction system"}
          {selectedCountry === "IN" && "Progressive income tax slabs as per Income Tax Act, 1961"}
          {selectedCountry === "PK" && "Income tax rates as per Pakistan Income Tax Ordinance, 2001"}
          {selectedCountry === "ZA" && "South African Revenue Service (SARS) tax system"}
        </p>
      </Card>

      {/* Tax Slabs */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Slabs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Income Range</th>
                <th className="p-3 text-left">Tax Rate</th>
                <th className="p-3 text-left">Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              {(taxSlabs[selectedCountry] || taxSlabs.GB).map((slab, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{slab.range}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {slab.rate}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">{slab.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sample Tax Calculation */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sample Tax Calculation</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="annualIncome" className="text-sm font-medium text-gray-700">
                Annual Income
              </Label>
              <input
                id="annualIncome"
                type="number"
                placeholder="Enter annual income"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="taxableIncome" className="text-sm font-medium text-gray-700">
                Taxable Income
              </Label>
              <input
                id="taxableIncome"
                type="number"
                placeholder="Calculated automatically"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                readOnly
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Annual Tax</p>
                <p className="text-2xl font-bold text-purple-600">$12,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Tax</p>
                <p className="text-2xl font-bold text-blue-600">$1,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Effective Rate</p>
                <p className="text-2xl font-bold text-gray-900">24%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white">
          <h3 className="text-sm text-gray-600 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-gray-900">245</p>
          <p className="text-sm text-gray-500 mt-1">In {countries.find((c) => c.code === selectedCountry)?.name}</p>
        </Card>

        <Card className="p-6 bg-white">
          <h3 className="text-sm text-gray-600 mb-2">Total Tax Deducted</h3>
          <p className="text-3xl font-bold text-red-600">$15,000</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-white">
          <h3 className="text-sm text-gray-600 mb-2">Average Tax Rate</h3>
          <p className="text-3xl font-bold text-blue-600">22.5%</p>
          <p className="text-sm text-gray-500 mt-1">Across all employees</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Calculator className="w-4 h-4 mr-2" />
          Recalculate All
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Tax Report
        </Button>
        <Button className="bg-gray-200 text-gray-700">View History</Button>
      </div>
    </div>
  );
};

export default TaxCalculation;

