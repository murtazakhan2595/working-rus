import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  fetchPayrollDashboard, 
  fetchPayrollRuns,
  fetchAIRecommendations 
} from "state/slices/GlobalPayrollSlice";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileText,
  Download,
  Plus,
  Filter,
  RefreshCw,
  Calendar,
  AlertCircle,
  Settings
} from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import AIAlertWidget from "../components/AIAlertWidget";
import PayrollStatusBadge from "../components/PayrollStatusBadge";
import { formatCurrency, formatPayrollPeriod } from "utils/payrollUtils";
import { PageLoader } from "components";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PayrollDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    dashboardData, 
    payrollStatus, 
    loading, 
    payrollRuns 
  } = useSelector((state) => state.globalPayroll);

  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    // Temporarily disabled API calls - using mock data
    // handleRefresh();
  }, [dispatch]);

  const handleRefresh = () => {
    // TODO: Enable when backend is ready
    // dispatch(fetchPayrollDashboard());
    // dispatch(fetchPayrollRuns({ status: "all", limit: 10 }));
    // dispatch(fetchAIRecommendations());
    console.log("Refresh clicked - using mock data");
  };

  const handleCreatePayrollRun = () => {
    navigate("/payroll/run/create");
  };

  const handleGenerateWPS = () => {
    navigate("/payroll/wps/generate");
  };

  const handleExportReports = () => {
    navigate("/payroll/reports");
  };

  const handleSetupConfiguration = () => {
    navigate("/payroll/setup-configuration");
  };

  // Mock data for demo - replace with real data from API
  const statusCards = [
    {
      title: "Draft",
      count: dashboardData?.draft_count || payrollStatus.draft || 0,
      amount: dashboardData?.draft_amount || 0,
      currency: "AED",
      icon: FileText,
      color: "bg-gray-100 text-gray-800",
      trend: "+5%",
    },
    {
      title: "In Review",
      count: dashboardData?.in_review_count || payrollStatus.inReview || 0,
      amount: dashboardData?.in_review_amount || 0,
      currency: "AED",
      icon: AlertCircle,
      color: "bg-blue-100 text-blue-800",
      trend: "+12%",
    },
    {
      title: "Approved",
      count: dashboardData?.approved_count || payrollStatus.approved || 0,
      amount: dashboardData?.approved_amount || 0,
      currency: "AED",
      icon: TrendingUp,
      color: "bg-green-100 text-green-800",
      trend: "+8%",
    },
    {
      title: "Processed",
      count: dashboardData?.processed_count || payrollStatus.processed || 0,
      amount: dashboardData?.processed_amount || 0,
      currency: "AED",
      icon: DollarSign,
      color: "bg-purple-100 text-purple-800",
      trend: "+3%",
    },
  ];

  const countryData = dashboardData?.by_country || [
    { country: "UAE", amount: 2500000, employees: 150, currency: "AED" },
    { country: "UK", amount: 800000, employees: 45, currency: "GBP" },
    { country: "Kenya", amount: 350000, employees: 80, currency: "KES" },
    { country: "Nigeria", amount: 420000, employees: 65, currency: "NGN" },
  ];

  const monthlyTrendData = dashboardData?.monthly_trend || [
    { month: "Jan", amount: 3200000 },
    { month: "Feb", amount: 3350000 },
    { month: "Mar", amount: 3280000 },
    { month: "Apr", amount: 3520000 },
    { month: "May", amount: 3680000 },
    { month: "Jun", amount: 3850000 },
  ];

  const currencyDistribution = dashboardData?.by_currency || [
    { name: "AED", value: 2500000 },
    { name: "GBP", value: 800000 },
    { name: "USD", value: 450000 },
    { name: "KES", value: 350000 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Temporarily disabled loading check - using mock data
  // if (loading && !dashboardData) {
  //   return <PageLoader height="100vh" />;
  // }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Global Payroll Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage multi-country payroll across UAE, UK, and Africa
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetupConfiguration}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Setup & Config
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReports}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleGenerateWPS}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate WPS
          </Button>
          <Button
            size="sm"
            onClick={handleCreatePayrollRun}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Payroll Run
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="UAE">UAE</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Month</SelectItem>
                <SelectItem value="last">Last Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {card.count}
                    </p>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {card.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(card.amount, card.currency)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {card.count} employees
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Payroll Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Payroll Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Country Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payroll by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#10B981" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Currency Distribution & AI Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currency Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={currencyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {currencyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Alerts Widget */}
        <div className="lg:col-span-2">
          <AIAlertWidget maxHeight="350px" />
        </div>
      </div>

      {/* Recent Payroll Runs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Payroll Runs</CardTitle>
          <Button
            variant="link"
            onClick={() => navigate("/payroll/runs")}
            className="text-blue-600"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employees
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {payrollRuns.slice(0, 5).map((run, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatPayrollPeriod(run.period || new Date())}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {run.country || "UAE"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        {run.employee_count || 0}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(run.total_amount || 0, run.currency || "AED")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <PayrollStatusBadge status={run.status || "draft"} size="sm" />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/payroll/run/${run.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollDashboard;

