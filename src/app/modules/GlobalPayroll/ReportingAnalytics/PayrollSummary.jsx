import React, { useState } from "react";
import { BarChart3, DollarSign, Users, Calendar, Globe, Building2, Download, Eye } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const PayrollSummary = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const payrollSummaryData = [
    {
      period: "January 2025",
      country: "UAE",
      department: "IT",
      totalEmployees: 25,
      grossSalary: 450000,
      netSalary: 360000,
      deductions: 90000,
      currency: "AED",
      avgSalary: 18000,
      overtime: 15000,
      bonuses: 25000,
    },
    {
      period: "January 2025",
      country: "UAE",
      department: "HR",
      totalEmployees: 15,
      grossSalary: 225000,
      netSalary: 180000,
      deductions: 45000,
      currency: "AED",
      avgSalary: 15000,
      overtime: 8000,
      bonuses: 12000,
    },
    {
      period: "January 2025",
      country: "UK",
      department: "Finance",
      totalEmployees: 12,
      grossSalary: 36000,
      netSalary: 28800,
      deductions: 7200,
      currency: "GBP",
      avgSalary: 3000,
      overtime: 2000,
      bonuses: 3000,
    },
    {
      period: "January 2025",
      country: "India",
      department: "Operations",
      totalEmployees: 35,
      grossSalary: 1750000,
      netSalary: 1400000,
      deductions: 350000,
      currency: "INR",
      avgSalary: 50000,
      overtime: 75000,
      bonuses: 100000,
    },
  ];

  const summaryStats = [
    {
      title: "Total Employees",
      value: "150",
      change: "+5",
      changeType: "positive",
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Gross Salary",
      value: "AED 2.1M",
      change: "+8.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Total Deductions",
      value: "AED 450K",
      change: "+3.2%",
      changeType: "positive",
      icon: BarChart3,
      color: "purple",
    },
    {
      title: "Average Salary",
      value: "AED 14K",
      change: "+2.1%",
      changeType: "positive",
      icon: Calendar,
      color: "yellow",
    },
  ];

  const countryBreakdown = [
    {
      country: "UAE",
      employees: 75,
      totalSalary: 1250000,
      avgSalary: 16667,
      currency: "AED",
      percentage: 50,
    },
    {
      country: "UK",
      employees: 25,
      totalSalary: 75000,
      avgSalary: 3000,
      currency: "GBP",
      percentage: 16.7,
    },
    {
      country: "India",
      employees: 35,
      totalSalary: 1750000,
      avgSalary: 50000,
      currency: "INR",
      percentage: 23.3,
    },
    {
      country: "Pakistan",
      employees: 15,
      totalSalary: 450000,
      avgSalary: 30000,
      currency: "PKR",
      percentage: 10,
    },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Summary Reports</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive payroll summaries by period, department, or country
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateReport}
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
                <BarChart3 className="w-4 h-4" />
                Generate Report
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="period" className="text-sm font-medium text-gray-700">
              Period
            </Label>
            <input
              id="period"
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="filter" className="text-sm font-medium text-gray-700">
              Filter By
            </Label>
            <select
              id="filter"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="country">By Country</option>
              <option value="department">By Department</option>
              <option value="employee">By Employee</option>
            </select>
          </div>

          <div>
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country
            </Label>
            <select
              id="country"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              <option value="UAE">UAE</option>
              <option value="UK">UK</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
            </select>
          </div>

          <div>
            <Label htmlFor="department" className="text-sm font-medium text-gray-700">
              Department
            </Label>
            <select
              id="department"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <Card key={index} className={`p-6 bg-${stat.color}-50 border-${stat.color}-200`}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              <h3 className="text-sm text-gray-600">{stat.title}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className={`text-sm mt-1 ${getChangeColor(stat.changeType)}`}>
              {stat.change} from last period
            </p>
          </Card>
        ))}
      </div>

      {/* Payroll Summary Table */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Summary Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Period</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Gross Salary</th>
                <th className="p-3 text-left">Net Salary</th>
                <th className="p-3 text-left">Deductions</th>
                <th className="p-3 text-left">Avg Salary</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollSummaryData.map((data, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{data.period}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{data.country}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold">{data.department}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{data.totalEmployees}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{data.grossSalary.toLocaleString()} {data.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{data.netSalary.toLocaleString()} {data.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-red-600">{data.deductions.toLocaleString()} {data.currency}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{data.avgSalary.toLocaleString()} {data.currency}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Country Breakdown */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Country-wise Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {countryBreakdown.map((country, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{country.country}</h3>
                </div>
                <span className="text-sm text-gray-600">{country.percentage}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Employees:</span>
                  <span className="font-semibold">{country.employees}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Salary:</span>
                  <span className="font-semibold">{country.totalSalary.toLocaleString()} {country.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Salary:</span>
                  <span className="font-semibold">{country.avgSalary.toLocaleString()} {country.currency}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chart Placeholder */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Trends</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive Payroll Trends Chart</p>
            <p className="text-sm text-gray-500">Monthly salary trends and department comparisons</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Summary Report
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
        <Button className="bg-gray-200 text-gray-700">Schedule Reports</Button>
      </div>
    </div>
  );
};

export default PayrollSummary;
