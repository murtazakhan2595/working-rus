import React, { useState } from "react";
import { Calendar, Clock, Save } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const PeriodSelection = () => {
  const [selectedType, setSelectedType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = ["2023", "2024", "2025", "2026"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Period Selection</h1>
        <p className="text-gray-600 mt-1">
          Select payroll period: Monthly, Weekly, or Custom
        </p>
      </div>

      {/* Period Type Selection */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Period Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setSelectedType("monthly")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedType === "monthly"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <Calendar className={`w-8 h-8 mb-3 ${selectedType === "monthly" ? "text-blue-600" : "text-gray-600"}`} />
            <h3 className="font-semibold text-lg">Monthly</h3>
            <p className="text-sm text-gray-600 mt-1">Process payroll once per month</p>
          </div>

          <div
            onClick={() => setSelectedType("weekly")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedType === "weekly"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <Clock className={`w-8 h-8 mb-3 ${selectedType === "weekly" ? "text-blue-600" : "text-gray-600"}`} />
            <h3 className="font-semibold text-lg">Weekly</h3>
            <p className="text-sm text-gray-600 mt-1">Process payroll every week</p>
          </div>

          <div
            onClick={() => setSelectedType("custom")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedType === "custom"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <Calendar className={`w-8 h-8 mb-3 ${selectedType === "custom" ? "text-blue-600" : "text-gray-600"}`} />
            <h3 className="font-semibold text-lg">Custom</h3>
            <p className="text-sm text-gray-600 mt-1">Define custom date range</p>
          </div>
        </div>
      </Card>

      {/* Period Details */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Period Details</h2>

        {selectedType === "monthly" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="month" className="text-sm font-medium text-gray-700">
                  Select Month
                </Label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                  Select Year
                </Label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Selected Period:</strong> {selectedMonth} {selectedYear}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Payroll will be processed for the entire month
              </p>
            </div>
          </div>
        )}

        {selectedType === "weekly" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="week" className="text-sm font-medium text-gray-700">
                  Select Week
                </Label>
                <select
                  id="week"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Week 1 (Jan 1-7, 2025)</option>
                  <option>Week 2 (Jan 8-14, 2025)</option>
                  <option>Week 3 (Jan 15-21, 2025)</option>
                  <option>Week 4 (Jan 22-28, 2025)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="month-week" className="text-sm font-medium text-gray-700">
                  Month
                </Label>
                <select
                  id="month-week"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Selected Period:</strong> Week 1 (Jan 1-7, 2025)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Payroll will be processed for 7 days
              </p>
            </div>
          </div>
        )}

        {selectedType === "custom" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Date
                </Label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  End Date
                </Label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {startDate && endDate && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Selected Period:</strong> {startDate} to {endDate}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Custom date range selected
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Summary & Actions */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Period Type</p>
            <p className="text-lg font-bold text-gray-900 capitalize">{selectedType}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Employees</p>
            <p className="text-lg font-bold text-gray-900">245</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Estimated Amount</p>
            <p className="text-lg font-bold text-gray-900">$100,000</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="flex items-center gap-2 bg-blue-600 text-white">
            <Save className="w-4 h-4" />
            Save & Continue
          </Button>
          <Button className="bg-gray-200 text-gray-700">Cancel</Button>
        </div>
      </Card>
    </div>
  );
};

export default PeriodSelection;

