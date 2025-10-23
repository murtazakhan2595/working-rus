import React, { useState } from "react";
import { Building2, DollarSign, Users, TrendingUp, BarChart3, Target, Download, Eye } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const CostCenterAnalysis = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01");

  const costCenterData = [
    {
      costCenter: "IT-001",
      name: "Software Development",
      department: "IT",
      employees: 25,
      totalCost: 450000,
      avgCostPerEmployee: 18000,
      budget: 500000,
      variance: -50000,
      variancePercent: -10,
      currency: "AED",
      status: "Under Budget",
    },
    {
      costCenter: "HR-001",
      name: "Human Resources",
      department: "HR",
      employees: 15,
      totalCost: 225000,
      avgCostPerEmployee: 15000,
      budget: 200000,
      variance: 25000,
      variancePercent: 12.5,
      currency: "AED",
      status: "Over Budget",
    },
    {
      costCenter: "FIN-001",
      name: "Finance & Accounting",
      department: "Finance",
      employees: 12,
      totalCost: 180000,
      avgCostPerEmployee: 15000,
      budget: 180000,
      variance: 0,
      variancePercent: 0,
      currency: "AED",
      status: "On Budget",
    },
    {
      costCenter: "OPS-001",
      name: "Operations",
      department: "Operations",
      employees: 35,
      totalCost: 525000,
      avgCostPerEmployee: 15000,
      budget: 550000,
      variance: -25000,
      variancePercent: -4.5,
      currency: "AED",
      status: "Under Budget",
    },
  ];

  const costBreakdown = [
    {
      category: "Base Salary",
      amount: 1200000,
      percentage: 70,
      color: "blue",
    },
    {
      category: "Overtime",
      amount: 150000,
      percentage: 8.8,
      color: "green",
    },
    {
      category: "Bonuses",
      amount: 200000,
      percentage: 11.7,
      color: "purple",
    },
    {
      category: "Allowances",
      amount: 150000,
      percentage: 8.8,
      color: "yellow",
    },
  ];

  const budgetAnalysis = [
    {
      costCenter: "IT-001",
      name: "Software Development",
      budget: 500000,
      actual: 450000,
      variance: -50000,
      efficiency: 90,
    },
    {
      costCenter: "HR-001",
      name: "Human Resources",
      budget: 200000,
      actual: 225000,
      variance: 25000,
      efficiency: 112.5,
    },
    {
      costCenter: "FIN-001",
      name: "Finance & Accounting",
      budget: 180000,
      actual: 180000,
      variance: 0,
      efficiency: 100,
    },
    {
      costCenter: "OPS-001",
      name: "Operations",
      budget: 550000,
      actual: 525000,
      variance: -25000,
      efficiency: 95.5,
    },
  ];

  const handleGenerateAnalysis = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Under Budget":
        return "bg-green-100 text-green-700";
      case "Over Budget":
        return "bg-red-100 text-red-700";
      case "On Budget":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return "text-red-600";
    if (variance < 0) return "text-green-600";
    return "text-gray-600";
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency > 100) return "text-red-600";
    if (efficiency < 95) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost Center Analysis</h1>
          <p className="text-gray-600 mt-1">
            Detailed analysis of payroll costs by cost center and department
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateAnalysis}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                Generate Analysis
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Analysis Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Configuration</h2>
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
            <Label htmlFor="costCenter" className="text-sm font-medium text-gray-700">
              Cost Center
            </Label>
            <select
              id="costCenter"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Cost Centers</option>
              <option value="IT-001">IT-001 - Software Development</option>
              <option value="HR-001">HR-001 - Human Resources</option>
              <option value="FIN-001">FIN-001 - Finance & Accounting</option>
              <option value="OPS-001">OPS-001 - Operations</option>
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

          <div>
            <Label htmlFor="analysisType" className="text-sm font-medium text-gray-700">
              Analysis Type
            </Label>
            <select
              id="analysisType"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="detailed">Detailed Analysis</option>
              <option value="summary">Summary Report</option>
              <option value="comparison">Period Comparison</option>
              <option value="trend">Trend Analysis</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cost Center Summary */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Center Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Cost Center</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-left">Total Cost</th>
                <th className="p-3 text-left">Budget</th>
                <th className="p-3 text-left">Variance</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {costCenterData.map((data, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{data.costCenter}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{data.name}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {data.department}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{data.employees}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{data.totalCost.toLocaleString()} {data.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{data.budget.toLocaleString()} {data.currency}</span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${getVarianceColor(data.variance)}`}>
                      {data.variance > 0 ? '+' : ''}{data.variance.toLocaleString()} {data.currency}
                      <br />
                      <span className="text-sm">({data.variancePercent > 0 ? '+' : ''}{data.variancePercent}%)</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
                      {data.status}
                    </span>
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

      {/* Cost Breakdown */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Cost Categories</h3>
            <div className="space-y-3">
              {costBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 bg-${category.color}-500 rounded`}></div>
                    <span className="font-semibold text-gray-900">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{category.amount.toLocaleString()} AED</p>
                    <p className="text-sm text-gray-600">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Cost Distribution</h3>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Cost Distribution Chart</p>
                <p className="text-sm text-gray-500">Visual breakdown of cost categories</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Budget Analysis */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Cost Center</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Budget</th>
                <th className="p-3 text-left">Actual</th>
                <th className="p-3 text-left">Variance</th>
                <th className="p-3 text-left">Efficiency</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgetAnalysis.map((analysis, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{analysis.costCenter}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{analysis.name}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{analysis.budget.toLocaleString()} AED</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{analysis.actual.toLocaleString()} AED</span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${getVarianceColor(analysis.variance)}`}>
                      {analysis.variance > 0 ? '+' : ''}{analysis.variance.toLocaleString()} AED
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${getEfficiencyColor(analysis.efficiency)}`}>
                      {analysis.efficiency}%
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trend
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

      {/* Cost Center Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Cost Centers</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">4</p>
          <p className="text-sm text-gray-600 mt-1">Active centers</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Total Cost</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">AED 1.38M</p>
          <p className="text-sm text-gray-600 mt-1">This period</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Budget Efficiency</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">99.5%</p>
          <p className="text-sm text-gray-600 mt-1">Overall efficiency</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Total Employees</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">87</p>
          <p className="text-sm text-gray-600 mt-1">Across all centers</p>
        </Card>
      </div>

      {/* Analysis Insights */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Center Analysis Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Key Findings</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• IT department is 10% under budget with high efficiency</li>
              <li>• HR department exceeded budget by 12.5%</li>
              <li>• Operations department shows consistent cost control</li>
              <li>• Finance department maintained exact budget alignment</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Review HR department budget allocation</li>
              <li>• Consider reallocating IT savings to other departments</li>
              <li>• Implement cost control measures for HR</li>
              <li>• Maintain current efficiency levels</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Building2 className="w-4 h-4 mr-2" />
          Generate Cost Analysis
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Analysis Report
        </Button>
        <Button className="bg-gray-200 text-gray-700">Schedule Analysis</Button>
      </div>
    </div>
  );
};

export default CostCenterAnalysis;
