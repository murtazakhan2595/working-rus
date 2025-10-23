import React, { useState } from "react";
import { TrendingUp, DollarSign, Calendar, BarChart3, Target, Download, Eye } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const ForecastReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("12");
  const [selectedModel, setSelectedModel] = useState("hybrid");

  const forecastData = [
    {
      period: "February 2025",
      category: "Base Salary",
      currentValue: 1200000,
      forecastValue: 1250000,
      variance: 50000,
      variancePercent: 4.2,
      confidence: 92,
      currency: "AED",
      trend: "up",
    },
    {
      period: "March 2025",
      category: "Base Salary",
      currentValue: 1200000,
      forecastValue: 1300000,
      variance: 100000,
      variancePercent: 8.3,
      confidence: 88,
      currency: "AED",
      trend: "up",
    },
    {
      period: "April 2025",
      category: "Base Salary",
      currentValue: 1200000,
      forecastValue: 1280000,
      variance: 80000,
      variancePercent: 6.7,
      confidence: 85,
      currency: "AED",
      trend: "up",
    },
    {
      period: "May 2025",
      category: "Base Salary",
      currentValue: 1200000,
      forecastValue: 1320000,
      variance: 120000,
      variancePercent: 10,
      confidence: 90,
      currency: "AED",
      trend: "up",
    },
  ];

  const budgetForecasts = [
    {
      department: "IT",
      currentBudget: 500000,
      forecastBudget: 520000,
      variance: 20000,
      variancePercent: 4,
      riskLevel: "Low",
      recommendations: "Budget increase approved",
    },
    {
      department: "HR",
      currentBudget: 200000,
      forecastBudget: 225000,
      variance: 25000,
      variancePercent: 12.5,
      riskLevel: "Medium",
      recommendations: "Review hiring plans",
    },
    {
      department: "Finance",
      currentBudget: 180000,
      forecastBudget: 185000,
      variance: 5000,
      variancePercent: 2.8,
      riskLevel: "Low",
      recommendations: "Maintain current levels",
    },
    {
      department: "Operations",
      currentBudget: 550000,
      forecastBudget: 600000,
      variance: 50000,
      variancePercent: 9.1,
      riskLevel: "High",
      recommendations: "Consider cost optimization",
    },
  ];

  const forecastModels = [
    {
      name: "Linear Regression",
      description: "Simple trend-based forecasting",
      accuracy: 78,
      complexity: "Low",
      icon: TrendingUp,
      color: "blue",
    },
    {
      name: "Seasonal Analysis",
      description: "Accounts for seasonal patterns",
      accuracy: 85,
      complexity: "Medium",
      icon: Calendar,
      color: "green",
    },
    {
      name: "Machine Learning",
      description: "Advanced AI-powered forecasting",
      accuracy: 92,
      complexity: "High",
      icon: BarChart3,
      color: "purple",
    },
    {
      name: "Hybrid Model",
      description: "Combines multiple forecasting methods",
      accuracy: 94,
      complexity: "High",
      icon: Target,
      color: "yellow",
    },
  ];

  const scenarioAnalysis = [
    {
      scenario: "Optimistic",
      description: "Best-case scenario with high growth",
      totalCost: 2500000,
      growthRate: 15,
      probability: 25,
      color: "green",
    },
    {
      scenario: "Realistic",
      description: "Most likely scenario based on trends",
      totalCost: 2200000,
      growthRate: 8,
      probability: 50,
      color: "blue",
    },
    {
      scenario: "Pessimistic",
      description: "Conservative scenario with minimal growth",
      totalCost: 2000000,
      growthRate: 2,
      probability: 25,
      color: "red",
    },
  ];

  const handleGenerateForecast = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "High":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-yellow-600";
    if (confidence >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forecast Reports & Budgeting Support</h1>
          <p className="text-gray-600 mt-1">
            AI-powered forecasting and budgeting support for payroll planning
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateForecast}
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
                <TrendingUp className="w-4 h-4" />
                Generate Forecast
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Forecast
          </Button>
        </div>
      </div>

      {/* Forecast Configuration */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Forecast Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="period" className="text-sm font-medium text-gray-700">
              Forecast Period
            </Label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="18">18 Months</option>
              <option value="24">24 Months</option>
            </select>
          </div>

          <div>
            <Label htmlFor="model" className="text-sm font-medium text-gray-700">
              Forecast Model
            </Label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="linear">Linear Regression</option>
              <option value="seasonal">Seasonal Analysis</option>
              <option value="ml">Machine Learning</option>
              <option value="hybrid">Hybrid Model</option>
            </select>
          </div>

          <div>
            <Label htmlFor="confidence" className="text-sm font-medium text-gray-700">
              Confidence Level
            </Label>
            <select
              id="confidence"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="95">95% Confidence</option>
              <option value="90">90% Confidence</option>
              <option value="85">85% Confidence</option>
              <option value="80">80% Confidence</option>
            </select>
          </div>

          <div>
            <Label htmlFor="scenario" className="text-sm font-medium text-gray-700">
              Scenario
            </Label>
            <select
              id="scenario"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="realistic">Realistic</option>
              <option value="optimistic">Optimistic</option>
              <option value="pessimistic">Pessimistic</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Forecast Models */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {forecastModels.map((model, index) => (
          <Card key={index} className={`p-6 bg-${model.color}-50 border-${model.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <model.icon className={`w-6 h-6 text-${model.color}-600`} />
              <h3 className="font-semibold text-gray-900">{model.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{model.description}</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Accuracy: {model.accuracy}%</p>
              <p>Complexity: {model.complexity}</p>
            </div>
            <Button className="w-full mt-3 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
              Use Model
            </Button>
          </Card>
        ))}
      </div>

      {/* Forecast Data */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Forecast</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Period</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Current Value</th>
                <th className="p-3 text-left">Forecast Value</th>
                <th className="p-3 text-left">Variance</th>
                <th className="p-3 text-left">Confidence</th>
                <th className="p-3 text-left">Trend</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.map((data, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{data.period}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{data.category}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">{data.currentValue.toLocaleString()} {data.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{data.forecastValue.toLocaleString()} {data.currency}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${getTrendColor(data.trend)}`}>
                      {data.variance > 0 ? '+' : ''}{data.variance.toLocaleString()} {data.currency}
                      <br />
                      <span className="text-sm">({data.variancePercent > 0 ? '+' : ''}{data.variancePercent}%)</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${getConfidenceColor(data.confidence)}`}>
                      {data.confidence}%
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${getTrendColor(data.trend)}`} />
                      <span className="capitalize">{data.trend}</span>
                    </div>
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

      {/* Budget Forecasts */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Budget Forecasts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Current Budget</th>
                <th className="p-3 text-left">Forecast Budget</th>
                <th className="p-3 text-left">Variance</th>
                <th className="p-3 text-left">Risk Level</th>
                <th className="p-3 text-left">Recommendations</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgetForecasts.map((forecast, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <span className="font-semibold">{forecast.department}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{forecast.currentBudget.toLocaleString()} AED</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{forecast.forecastBudget.toLocaleString()} AED</span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${
                      forecast.variance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {forecast.variance > 0 ? '+' : ''}{forecast.variance.toLocaleString()} AED
                      <br />
                      <span className="text-sm">({forecast.variancePercent > 0 ? '+' : ''}{forecast.variancePercent}%)</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(forecast.riskLevel)}`}>
                      {forecast.riskLevel}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{forecast.recommendations}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analyze
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

      {/* Scenario Analysis */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scenario Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarioAnalysis.map((scenario, index) => (
            <div key={index} className={`p-4 bg-${scenario.color}-50 border-${scenario.color}-200 rounded-lg`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{scenario.scenario}</h3>
                <span className="text-sm text-gray-600">{scenario.probability}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-semibold">{scenario.totalCost.toLocaleString()} AED</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Growth Rate:</span>
                  <span className="font-semibold">{scenario.growthRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${scenario.color}-500`}
                    style={{ width: `${scenario.probability}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Forecast Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Forecast Accuracy</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">94%</p>
          <p className="text-sm text-gray-600 mt-1">Overall accuracy</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Projected Cost</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">AED 2.2M</p>
          <p className="text-sm text-gray-600 mt-1">Next 12 months</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Growth Rate</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">8.2%</p>
          <p className="text-sm text-gray-600 mt-1">Year-over-year</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Risk Level</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">Medium</p>
          <p className="text-sm text-gray-600 mt-1">Overall risk</p>
        </Card>
      </div>

      {/* Forecast Insights */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Forecast Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Key Trends</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Base salary costs expected to increase by 8.2% annually</li>
              <li>• Operations department shows highest growth potential</li>
              <li>• HR department requires budget review and optimization</li>
              <li>• IT department maintains stable cost structure</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Budget Recommendations</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Increase IT budget by 4% for planned expansion</li>
              <li>• Review HR budget allocation and hiring plans</li>
              <li>• Consider cost optimization for Operations</li>
              <li>• Maintain Finance department current budget levels</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <TrendingUp className="w-4 h-4 mr-2" />
          Generate New Forecast
        </Button>
        <Button className="bg-green-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Forecast Report
        </Button>
        <Button className="bg-gray-200 text-gray-700">Schedule Forecast Updates</Button>
      </div>
    </div>
  );
};

export default ForecastReports;
