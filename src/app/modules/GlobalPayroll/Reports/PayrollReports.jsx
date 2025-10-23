import React, { useState } from "react";
import { BarChart, Download, FileText, TrendingUp } from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { BarChart as RechartsBar, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "utils/payrollUtils";

const PayrollReports = () => {
  const [reportType, setReportType] = useState("summary");
  const [period, setPeriod] = useState("monthly");

  const monthlyData = [
    { month: "Jan", payroll: 3200000, employees: 145 },
    { month: "Feb", payroll: 3350000, employees: 148 },
    { month: "Mar", payroll: 3280000, employees: 147 },
    { month: "Apr", payroll: 3520000, employees: 152 },
    { month: "May", payroll: 3680000, employees: 155 },
    { month: "Jun", payroll: 3850000, employees: 160 },
  ];

  const departmentData = [
    { name: "Engineering", value: 1200000 },
    { name: "Sales", value: 800000 },
    { name: "HR", value: 400000 },
    { name: "Finance", value: 600000 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Payroll Reports & Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Comprehensive payroll analytics and reporting
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary Report</SelectItem>
              <SelectItem value="detailed">Detailed Report</SelectItem>
              <SelectItem value="statutory">Statutory Report</SelectItem>
              <SelectItem value="cost-center">Cost Center Analysis</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Payroll Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="payroll" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Payroll (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(20880000)}
            </p>
            <p className="text-sm text-gray-500 mt-2">+12% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(22000)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Per employee/month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tax Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(1500000)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Total statutory deductions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollReports;

