import React, { useState } from "react";
import { TrendingUp, DollarSign, Calendar, Users, BarChart3, Target, Download } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const SalaryForecast = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("12");
  const [isGenerating, setIsGenerating] = useState(false);

  const forecastData = [
    {
      month: "February 2025",
      currentSalary: 450000,
      projectedSalary: 465000,
      variance: 15000,
      variancePercent: 3.3,
      trend: "up",
      factors: ["Annual increment", "New hires", "Promotions"],
    },
    {
      month: "March 2025",
      currentSalary: 450000,
      projectedSalary: 480000,
      variance: 30000,
      variancePercent: 6.7,
      trend: "up",
      factors: ["Bonus payments", "Overtime increase", "New positions"],
    },
    {
      month: "April 2025",
      currentSalary: 450000,
      projectedSalary: 460000,
      variance: 10000,
      variancePercent: 2.2,
      trend: "up",
      factors: ["Regular increments", "Performance bonuses"],
    },
    {
      month: "May 2025",
      currentSalary: 450000,
      projectedSalary: 455000,
      variance: 5000,
      variancePercent: 1.1,
      trend: "up",
      factors: ["Standard growth", "Minor adjustments"],
    },
  ];

  const costTrends = [
    {
      category: "Base Salary",
      currentCost: 350000,
      projectedCost: 365000,
      change: 4.3,
      trend: "up",
    },
    {
      category: "Overtime",
      currentCost: 45000,
      projectedCost: 52000,
      change: 15.6,
      trend: "up",
    },
    {
      category: "Bonuses",
      currentCost: 25000,
      projectedCost: 35000,
      change: 40.0,
      trend: "up",
    },
    {
      category: "Allowances",
      currentCost: 30000,
      projectedCost: 28000,
      change: -6.7,
      trend: "down",
    },
  ];

  const predictions = [
    {
      type: "Salary Growth",
      prediction: "Moderate increase expected",
      confidence: 85,
      timeframe: "Next 6 months",
      impact: "Medium",
    },
    {
      type: "Overtime Costs",
      prediction: "Significant increase likely",
      confidence: 92,
      timeframe: "Next 3 months",
      impact: "High",
    },
    {
      type: "Bonus Payments",
      prediction: "Peak season approaching",
      confidence: 78,
      timeframe: "Q2 2025",
      impact: "High",
    },
    {
      type: "New Hires",
      prediction: "Expansion planned",
      confidence: 88,
      timeframe: "Q1-Q2 2025",
      impact: "Medium",
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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case "stable":
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "bg-green-100 text-green-700";
    if (confidence >= 75) return "bg-yellow-100 text-yellow-700";
    if (confidence >= 60) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Predictive Salary Forecast & Cost Trend Analysis</h1>
          <p className="text-gray-600 mt-1">
            AI-powered salary forecasting and cost trend analysis for budget planning
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
            Export Report
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
              AI Model
            </Label>
            <select
              id="model"
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
              <option value="optimistic">Optimistic</option>
              <option value="realistic">Realistic</option>
              <option value="pessimistic">Pessimistic</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Salary Forecast Chart */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Salary Forecast Trend</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive Forecast Chart</p>
            <p className="text-sm text-gray-500">Monthly salary projections with confidence intervals</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Current Salary</th>
                <th className="p-3 text-left">Projected Salary</th>
                <th className="p-3 text-left">Variance</th>
                <th className="p-3 text-left">Trend</th>
                <th className="p-3 text-left">Key Factors</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.map((data, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{data.month}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">{data.currentSalary.toLocaleString()} AED</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{data.projectedSalary.toLocaleString()} AED</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${getTrendColor(data.trend)}`}>
                      {data.variance > 0 ? '+' : ''}{data.variance.toLocaleString()} AED ({data.variancePercent}%)
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(data.trend)}
                      <span className="capitalize">{data.trend}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-gray-600">
                      {data.factors.map((factor, idx) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cost Trend Analysis */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Trend Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {costTrends.map((trend, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{trend.category}</h3>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trend.trend)}
                  <span className={`text-sm font-semibold ${getTrendColor(trend.trend)}`}>
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-semibold">{trend.currentCost.toLocaleString()} AED</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Projected:</span>
                  <span className="font-semibold">{trend.projectedCost.toLocaleString()} AED</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${trend.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(trend.change) * 2, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Predictions */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Predictions & Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{prediction.type}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}% confidence
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{prediction.prediction}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{prediction.timeframe}</span>
                <span className={`px-2 py-1 rounded ${
                  prediction.impact === 'High' ? 'bg-red-100 text-red-700' :
                  prediction.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {prediction.impact} Impact
                </span>
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
            <h3 className="text-sm text-gray-600">Total Projected</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">AED 5.4M</p>
          <p className="text-sm text-gray-600 mt-1">Next 12 months</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Growth Rate</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">8.2%</p>
          <p className="text-sm text-gray-600 mt-1">Year-over-year</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Accuracy</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">94%</p>
          <p className="text-sm text-gray-600 mt-1">Prediction accuracy</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Employees</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">150</p>
          <p className="text-sm text-gray-600 mt-1">Total workforce</p>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Key Trends Identified</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Overtime costs increasing by 15.6% due to project deadlines</li>
              <li>• Bonus payments expected to peak in Q2 2025</li>
              <li>• New hire costs will impact Q1-Q2 budget significantly</li>
              <li>• Allowance costs decreasing due to policy changes</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Budget Recommendations</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Increase overtime budget by 20% for Q2-Q3</li>
              <li>• Plan for bonus payments in Q2 2025</li>
              <li>• Consider hiring freeze to control costs</li>
              <li>• Implement overtime approval process</li>
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
        <Button className="bg-gray-200 text-gray-700">View Historical Forecasts</Button>
      </div>
    </div>
  );
};

export default SalaryForecast;
