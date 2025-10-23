import React, { useState } from "react";
import { Globe, FileText, Shield, Calendar } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const CountryRules = () => {
  const [selectedCountry, setSelectedCountry] = useState("GB");

  const countryRules = [
    {
      country: "United Kingdom",
      countryCode: "GB",
      currency: "GBP",
      payrollCycle: "Monthly",
      taxSystem: "PAYE",
      workweek: "Monday-Friday",
      overtimeRules: "1.5x after 40 hours/week",
      holidayPay: "28 days annual leave",
      pensionScheme: "Workplace Pension (5%)",
      minWage: "£10.42/hour",
    },
    {
      country: "India",
      countryCode: "IN",
      currency: "INR",
      payrollCycle: "Monthly",
      taxSystem: "Income Tax Act",
      workweek: "Monday-Saturday",
      overtimeRules: "2x on holidays",
      holidayPay: "As per company policy",
      pensionScheme: "EPF (12%) + Pension (8.33%)",
      minWage: "State-specific",
    },
    {
      country: "Pakistan",
      countryCode: "PK",
      currency: "PKR",
      payrollCycle: "Monthly",
      taxSystem: "Income Tax Ordinance",
      workweek: "Monday-Friday",
      overtimeRules: "As per labor law",
      holidayPay: "14 days annual leave",
      pensionScheme: "EOBI (6%)",
      minWage: "Rs 32,000/month",
    },
    {
      country: "South Africa",
      countryCode: "ZA",
      currency: "ZAR",
      payrollCycle: "Monthly",
      taxSystem: "SARS",
      workweek: "Monday-Friday",
      overtimeRules: "1.5x normal rate",
      holidayPay: "21 days annual leave",
      pensionScheme: "As per employer",
      minWage: "Sector-specific",
    },
  ];

  const currentRules = countryRules.find((r) => r.countryCode === selectedCountry);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Country-Specific Payroll Rules</h1>
        <p className="text-gray-600 mt-1">
          View and manage country-specific payroll rules and tax structures
        </p>
      </div>

      {/* Country Selector */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-4">
          <Globe className="w-6 h-6 text-blue-600" />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Select Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              {countryRules.map((rule) => (
                <option key={rule.countryCode} value={rule.countryCode}>
                  {rule.country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Country Information */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentRules?.country}</h2>
            <p className="text-gray-600">Currency: {currentRules?.currency}</p>
          </div>
        </div>
      </Card>

      {/* Payroll Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">General Rules</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Payroll Cycle:</span>
              <span className="font-semibold text-gray-900">{currentRules?.payrollCycle}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Currency:</span>
              <span className="font-semibold text-gray-900">{currentRules?.currency}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Workweek:</span>
              <span className="font-semibold text-gray-900">{currentRules?.workweek}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Minimum Wage:</span>
              <span className="font-semibold text-gray-900">{currentRules?.minWage}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Compliance Rules</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 block mb-1">Tax System:</span>
              <span className="font-semibold text-gray-900">{currentRules?.taxSystem}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 block mb-1">Overtime Rules:</span>
              <span className="font-semibold text-gray-900">{currentRules?.overtimeRules}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 block mb-1">Holiday/Leave Pay:</span>
              <span className="font-semibold text-gray-900">{currentRules?.holidayPay}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 block mb-1">Pension/PF Scheme:</span>
              <span className="font-semibold text-gray-900">{currentRules?.pensionScheme}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* All Countries Overview */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Countries Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Tax System</th>
                <th className="p-3 text-left">Payroll Cycle</th>
                <th className="p-3 text-left">Workweek</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {countryRules.map((rule) => (
                <tr
                  key={rule.countryCode}
                  className={`border-b hover:bg-gray-50 ${
                    rule.countryCode === selectedCountry ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-3 font-medium">{rule.country}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">
                      {rule.currency}
                    </span>
                  </td>
                  <td className="p-3">{rule.taxSystem}</td>
                  <td className="p-3">{rule.payrollCycle}</td>
                  <td className="p-3">{rule.workweek}</td>
                  <td className="p-3">
                    <Button
                      onClick={() => setSelectedCountry(rule.countryCode)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Compliance Checklist */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {currentRules?.country} Compliance Checklist
          </h2>
        </div>
        <div className="space-y-2">
          {[
            "Tax calculations configured",
            "Statutory contributions set up",
            "Exchange rates updated",
            "Holiday calendar configured",
            "Payroll cycle defined",
            "Overtime rules configured",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-900">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CountryRules;

