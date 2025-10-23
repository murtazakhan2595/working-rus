import React, { useState } from "react";
import { Shield, Globe, DollarSign, Users, Download } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const PFSocialSecurity = () => {
  const [selectedCountry, setSelectedCountry] = useState("IN");

  const pfSchemes = [
    {
      country: "India",
      countryCode: "IN",
      scheme: "Provident Fund (EPF)",
      employeeRate: 12,
      employerRate: 12,
      maxSalary: 15000,
      maxContribution: 1800,
      totalEmployees: 120,
      totalContribution: 172800,
    },
    {
      country: "India",
      countryCode: "IN",
      scheme: "Employee State Insurance (ESI)",
      employeeRate: 0.75,
      employerRate: 3.25,
      maxSalary: 21000,
      maxContribution: null,
      totalEmployees: 85,
      totalContribution: 85000,
    },
    {
      country: "United Kingdom",
      countryCode: "GB",
      scheme: "National Insurance",
      employeeRate: 12,
      employerRate: 13.8,
      maxSalary: null,
      maxContribution: null,
      totalEmployees: 65,
      totalContribution: 125000,
    },
    {
      country: "Pakistan",
      countryCode: "PK",
      scheme: "EOBI (Social Security)",
      employeeRate: 1,
      employerRate: 5,
      maxSalary: null,
      maxContribution: null,
      totalEmployees: 40,
      totalContribution: 24000,
    },
  ];

  const filteredSchemes =
    selectedCountry === "all"
      ? pfSchemes
      : pfSchemes.filter((s) => s.countryCode === selectedCountry);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">PF & Social Security</h1>
        <p className="text-gray-600 mt-1">
          Provident Fund and Social Security contribution calculations
        </p>
      </div>

      {/* Country Filter */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-4">
          <Globe className="w-6 h-6 text-blue-600" />
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700">Filter by Country</Label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              <option value="GB">United Kingdom</option>
              <option value="IN">India</option>
              <option value="PK">Pakistan</option>
              <option value="ZA">South Africa</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-sm text-gray-600 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">
            {filteredSchemes.reduce((sum, s) => sum + s.totalEmployees, 0)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <h3 className="text-sm text-gray-600 mb-2">Employee Contribution</h3>
          <p className="text-3xl font-bold text-green-600">$206,400</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50">
          <h3 className="text-sm text-gray-600 mb-2">Employer Contribution</h3>
          <p className="text-3xl font-bold text-purple-600">$200,400</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50">
          <h3 className="text-sm text-gray-600 mb-2">Total Contribution</h3>
          <p className="text-3xl font-bold text-orange-600">$406,800</p>
        </Card>
      </div>

      {/* PF/Social Security Schemes */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme, index) => (
          <Card key={index} className="p-6 bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{scheme.scheme}</h3>
                  <p className="text-sm text-gray-600">
                    {scheme.country} ({scheme.countryCode})
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Covered Employees</p>
                <p className="text-xl font-bold text-gray-900">{scheme.totalEmployees}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Contribution */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Employee Contribution</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rate:</span>
                    <span className="text-lg font-bold text-green-600">{scheme.employeeRate}%</span>
                  </div>
                  {scheme.maxSalary && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Salary:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${scheme.maxSalary.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {scheme.maxContribution && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Contribution:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${scheme.maxContribution.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Employer Contribution */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Employer Contribution</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rate:</span>
                    <span className="text-lg font-bold text-purple-600">{scheme.employerRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Contribution:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${scheme.totalContribution.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Row */}
            <div className="mt-4 pt-4 border-t bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Combined Contribution:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {scheme.employeeRate + scheme.employerRate}% (Employee + Employer)
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">Calculate All Contributions</Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Details</Button>
      </div>
    </div>
  );
};

export default PFSocialSecurity;

