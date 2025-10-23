import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Settings,
  Globe,
  DollarSign,
  Calendar,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  FileText,
  Building,
  Users,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";
import { DialogBox, TableCustom } from "components";

const PayrollSetupConfiguration = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("policies");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState("");

  // State for Payroll Policies
  const [payrollPolicies, setPayrollPolicies] = useState([
    {
      id: 1,
      name: "UAE Monthly Payroll",
      country: "United Arab Emirates",
      cycle: "Monthly",
      payDay: "Last working day",
      cutoffDay: 25,
      active: true,
    },
    {
      id: 2,
      name: "UK Weekly Payroll",
      country: "United Kingdom",
      cycle: "Weekly",
      payDay: "Friday",
      cutoffDay: "Wednesday",
      active: true,
    },
  ]);

  // State for Countries & Currencies
  const [countriesCurrencies, setCountriesCurrencies] = useState([
    {
      id: 1,
      country: "United Arab Emirates",
      code: "AE",
      currency: "AED",
      exchangeRate: 1.0,
      active: true,
    },
    {
      id: 2,
      country: "United Kingdom",
      code: "GB",
      currency: "GBP",
      exchangeRate: 4.89,
      active: true,
    },
    {
      id: 3,
      country: "India",
      code: "IN",
      currency: "INR",
      exchangeRate: 0.045,
      active: true,
    },
    {
      id: 4,
      country: "Pakistan",
      code: "PK",
      currency: "PKR",
      exchangeRate: 0.013,
      active: true,
    },
    {
      id: 5,
      country: "South Africa",
      code: "ZA",
      currency: "ZAR",
      exchangeRate: 0.20,
      active: true,
    },
  ]);

  // State for Statutory Rules
  const [statutoryRules, setStatutoryRules] = useState([
    {
      id: 1,
      country: "United Arab Emirates",
      ruleName: "End of Service Gratuity",
      type: "Gratuity",
      rate: "21 days salary per year (first 5 years)",
      mandatory: true,
    },
    {
      id: 2,
      country: "United Kingdom",
      ruleName: "National Insurance",
      type: "NI",
      rate: "13.8% (Employer), 12% (Employee)",
      mandatory: true,
    },
    {
      id: 3,
      country: "United Kingdom",
      ruleName: "Pension Auto-Enrollment",
      type: "Pension",
      rate: "3% (Employer), 5% (Employee)",
      mandatory: true,
    },
    {
      id: 4,
      country: "India",
      ruleName: "Provident Fund (PF)",
      type: "PF",
      rate: "12% (Employer + Employee)",
      mandatory: true,
    },
    {
      id: 5,
      country: "India",
      ruleName: "Income Tax (TDS)",
      type: "Tax",
      rate: "Progressive (5%-30%)",
      mandatory: true,
    },
    {
      id: 6,
      country: "Pakistan",
      ruleName: "EOBI (Social Security)",
      type: "Social Security",
      rate: "5% (Employer), 1% (Employee)",
      mandatory: true,
    },
    {
      id: 7,
      country: "South Africa",
      ruleName: "UIF (Unemployment Insurance)",
      type: "Social Security",
      rate: "1% (Employer + Employee)",
      mandatory: true,
    },
  ]);

  // State for Earnings & Deductions
  const [earningsDeductions, setEarningsDeductions] = useState([
    {
      id: 1,
      name: "Basic Salary",
      type: "Earning",
      category: "Fixed",
      taxable: true,
      countries: ["All"],
    },
    {
      id: 2,
      name: "Housing Allowance",
      type: "Earning",
      category: "Fixed",
      taxable: false,
      countries: ["UAE"],
    },
    {
      id: 3,
      name: "Transport Allowance",
      type: "Earning",
      category: "Fixed",
      taxable: false,
      countries: ["UAE", "India", "Pakistan"],
    },
    {
      id: 4,
      name: "Overtime Pay",
      type: "Earning",
      category: "Variable",
      taxable: true,
      countries: ["All"],
    },
    {
      id: 5,
      name: "Income Tax",
      type: "Deduction",
      category: "Statutory",
      taxable: false,
      countries: ["UK", "India", "South Africa"],
    },
    {
      id: 6,
      name: "Provident Fund",
      type: "Deduction",
      category: "Statutory",
      taxable: false,
      countries: ["India", "Pakistan"],
    },
    {
      id: 7,
      name: "Loan Repayment",
      type: "Deduction",
      category: "Variable",
      taxable: false,
      countries: ["All"],
    },
  ]);

  // State for Cost Center Mapping
  const [costCenterMappings, setCostCenterMappings] = useState([
    {
      id: 1,
      costCenter: "CC-001",
      name: "Engineering",
      department: "Technology",
      employeeCategory: "Full-Time",
      employeeCount: 45,
    },
    {
      id: 2,
      costCenter: "CC-002",
      name: "Sales & Marketing",
      department: "Sales",
      employeeCategory: "Full-Time",
      employeeCount: 32,
    },
    {
      id: 3,
      costCenter: "CC-003",
      name: "HR Operations",
      department: "Human Resources",
      employeeCategory: "Full-Time",
      employeeCount: 12,
    },
    {
      id: 4,
      costCenter: "CC-004",
      name: "Contract Workers",
      department: "Operations",
      employeeCategory: "Contract",
      employeeCount: 28,
    },
  ]);

  // State for Holiday Calendars
  const [holidayCalendars, setHolidayCalendars] = useState([
    {
      id: 1,
      country: "United Arab Emirates",
      workweek: "Sunday - Thursday",
      weekendDays: ["Friday", "Saturday"],
      publicHolidays: 15,
      year: 2025,
    },
    {
      id: 2,
      country: "United Kingdom",
      workweek: "Monday - Friday",
      weekendDays: ["Saturday", "Sunday"],
      publicHolidays: 8,
      year: 2025,
    },
    {
      id: 3,
      country: "India",
      workweek: "Monday - Saturday",
      weekendDays: ["Sunday"],
      publicHolidays: 21,
      year: 2025,
    },
    {
      id: 4,
      country: "Pakistan",
      workweek: "Monday - Friday",
      weekendDays: ["Saturday", "Sunday"],
      publicHolidays: 18,
      year: 2025,
    },
    {
      id: 5,
      country: "South Africa",
      workweek: "Monday - Friday",
      weekendDays: ["Saturday", "Sunday"],
      publicHolidays: 12,
      year: 2025,
    },
  ]);

  const handleAddNew = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEdit = (item, type) => {
    setModalType(type);
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDelete = (id, type) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      switch (type) {
        case "policy":
          setPayrollPolicies(payrollPolicies.filter((p) => p.id !== id));
          break;
        case "country":
          setCountriesCurrencies(countriesCurrencies.filter((c) => c.id !== id));
          break;
        case "statutory":
          setStatutoryRules(statutoryRules.filter((s) => s.id !== id));
          break;
        case "component":
          setEarningsDeductions(earningsDeductions.filter((e) => e.id !== id));
          break;
        case "costcenter":
          setCostCenterMappings(costCenterMappings.filter((c) => c.id !== id));
          break;
        case "holiday":
          setHolidayCalendars(holidayCalendars.filter((h) => h.id !== id));
          break;
        default:
          break;
      }
    }
  };

  const handleSave = () => {
    // TODO: Implement save logic with API
    setShowAddModal(false);
    setEditingItem(null);
  };

  // Table Configurations
  const policyColumns = [
    { text: "Policy Name", dataField: "name" },
    { text: "Country", dataField: "country" },
    { text: "Cycle", dataField: "cycle" },
    { text: "Pay Day", dataField: "payDay" },
    { text: "Cutoff Day", dataField: "cutoffDay" },
    {
      text: "Status",
      dataField: "active",
      formatter: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      text: "Actions",
      dataField: "actions",
      formatter: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row, "policy")}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id, "policy")}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const countryColumns = [
    { text: "Country", dataField: "country" },
    { text: "Code", dataField: "code" },
    { text: "Currency", dataField: "currency" },
    {
      text: "Exchange Rate (to AED)",
      dataField: "exchangeRate",
      formatter: (value) => value.toFixed(4),
    },
    {
      text: "Status",
      dataField: "active",
      formatter: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      text: "Actions",
      dataField: "actions",
      formatter: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row, "country")}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id, "country")}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const statutoryColumns = [
    { text: "Country", dataField: "country" },
    { text: "Rule Name", dataField: "ruleName" },
    { text: "Type", dataField: "type" },
    { text: "Rate/Calculation", dataField: "rate" },
    {
      text: "Mandatory",
      dataField: "mandatory",
      formatter: (value) => (
        <span className="flex items-center gap-1">
          {value ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
        </span>
      ),
    },
    {
      text: "Actions",
      dataField: "actions",
      formatter: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row, "statutory")}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id, "statutory")}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const componentColumns = [
    { text: "Component Name", dataField: "name" },
    {
      text: "Type",
      dataField: "type",
      formatter: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Earning"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    { text: "Category", dataField: "category" },
    {
      text: "Taxable",
      dataField: "taxable",
      formatter: (value) => (
        <span className="flex items-center gap-1">
          {value ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
        </span>
      ),
    },
    {
      text: "Countries",
      dataField: "countries",
      formatter: (value) => value.join(", "),
    },
    {
      text: "Actions",
      dataField: "actions",
      formatter: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row, "component")}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id, "component")}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const costCenterColumns = [
    { text: "Cost Center", dataField: "costCenter" },
    { text: "Name", dataField: "name" },
    { text: "Department", dataField: "department" },
    { text: "Employee Category", dataField: "employeeCategory" },
    { text: "Employee Count", dataField: "employeeCount" },
    {
      text: "Actions",
      dataField: "actions",
      formatter: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row, "costcenter")}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id, "costcenter")}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const holidayColumns = [
    { text: "Country", dataField: "country" },
    { text: "Workweek", dataField: "workweek" },
    {
      text: "Weekend Days",
      dataField: "weekendDays",
      formatter: (value) => value.join(", "),
    },
    { text: "Public Holidays", dataField: "publicHolidays" },
    { text: "Year", dataField: "year" },
    {
      text: "Actions",
      dataField: "actions",
      formatter: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row, "holiday")}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id, "holiday")}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payroll Setup & Configuration
          </h1>
          <p className="text-gray-600 mt-1">
            Configure global payroll policies, statutory rules, and regional settings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto">
          <TabsTrigger value="policies" className="flex items-center gap-2 py-3">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Payroll Policies</span>
          </TabsTrigger>
          <TabsTrigger value="countries" className="flex items-center gap-2 py-3">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Countries & Currencies</span>
          </TabsTrigger>
          <TabsTrigger value="statutory" className="flex items-center gap-2 py-3">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Statutory Rules</span>
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2 py-3">
            <DollarSign className="h-4 w-4" />
            <span className="hidden md:inline">Earnings & Deductions</span>
          </TabsTrigger>
          <TabsTrigger value="costcenters" className="flex items-center gap-2 py-3">
            <Building className="h-4 w-4" />
            <span className="hidden md:inline">Cost Centers</span>
          </TabsTrigger>
          <TabsTrigger value="holidays" className="flex items-center gap-2 py-3">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Holiday Calendars</span>
          </TabsTrigger>
        </TabsList>

        {/* Payroll Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Company Payroll Policies
              </CardTitle>
              <Button
                onClick={() => handleAddNew("policy")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Policy
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Define company payroll policies including cycle frequency (monthly, weekly, custom),
                pay schedules, and cutoff dates for different countries and regions.
              </div>
              <TableCustom
                columns={policyColumns}
                data={payrollPolicies}
                fallbackText="No payroll policies configured yet."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Countries & Currencies Tab */}
        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Countries & Currencies Configuration
              </CardTitle>
              <Button
                onClick={() => handleAddNew("country")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Country
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Configure multiple countries and their local currencies. Set exchange rates
                for multi-currency payroll processing and reporting.
              </div>
              <TableCustom
                columns={countryColumns}
                data={countriesCurrencies}
                fallbackText="No countries configured yet."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statutory Rules Tab */}
        <TabsContent value="statutory" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Statutory Rules Configuration
              </CardTitle>
              <Button
                onClick={() => handleAddNew("statutory")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Configure statutory compliance rules for different countries including tax,
                provident fund (PF), social security, gratuity, national insurance (NI), and pension schemes.
              </div>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {statutoryRules.filter((r) => r.country === "United Arab Emirates").length}
                  </div>
                  <div className="text-xs text-blue-600">UAE Rules</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {statutoryRules.filter((r) => r.country === "United Kingdom").length}
                  </div>
                  <div className="text-xs text-green-600">UK Rules</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-700">
                    {statutoryRules.filter((r) => r.country === "India").length}
                  </div>
                  <div className="text-xs text-orange-600">India Rules</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {statutoryRules.filter((r) => r.country === "Pakistan").length}
                  </div>
                  <div className="text-xs text-purple-600">Pakistan Rules</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-700">
                    {statutoryRules.filter((r) => r.country === "South Africa").length}
                  </div>
                  <div className="text-xs text-red-600">Africa Rules</div>
                </div>
              </div>
              <TableCustom
                columns={statutoryColumns}
                data={statutoryRules}
                fallbackText="No statutory rules configured yet."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earnings & Deductions Tab */}
        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Earnings & Deduction Components
              </CardTitle>
              <Button
                onClick={() => handleAddNew("component")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Component
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Configure earning and deduction components for payroll calculation.
                Define fixed and variable components, taxability, and country-specific applicability.
              </div>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {earningsDeductions.filter((e) => e.type === "Earning").length}
                  </div>
                  <div className="text-xs text-green-600">Earning Components</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-700">
                    {earningsDeductions.filter((e) => e.type === "Deduction").length}
                  </div>
                  <div className="text-xs text-orange-600">Deduction Components</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {earningsDeductions.filter((e) => e.category === "Fixed").length}
                  </div>
                  <div className="text-xs text-blue-600">Fixed Components</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {earningsDeductions.filter((e) => e.category === "Variable").length}
                  </div>
                  <div className="text-xs text-purple-600">Variable Components</div>
                </div>
              </div>
              <TableCustom
                columns={componentColumns}
                data={earningsDeductions}
                fallbackText="No earning or deduction components configured yet."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Centers Tab */}
        <TabsContent value="costcenters" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Cost Center & Department Mapping
              </CardTitle>
              <Button
                onClick={() => handleAddNew("costcenter")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Mapping
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Map cost centers to departments and employee categories for accurate
                payroll allocation and financial reporting.
              </div>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-indigo-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-700">
                    {costCenterMappings.length}
                  </div>
                  <div className="text-xs text-indigo-600">Total Cost Centers</div>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-teal-700">
                    {[...new Set(costCenterMappings.map((c) => c.department))].length}
                  </div>
                  <div className="text-xs text-teal-600">Departments</div>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-700">
                    {costCenterMappings.reduce((sum, c) => sum + c.employeeCount, 0)}
                  </div>
                  <div className="text-xs text-pink-600">Total Employees</div>
                </div>
              </div>
              <TableCustom
                columns={costCenterColumns}
                data={costCenterMappings}
                fallbackText="No cost center mappings configured yet."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holiday Calendars Tab */}
        <TabsContent value="holidays" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Country-wise Holiday Calendar & Workweek
              </CardTitle>
              <Button
                onClick={() => handleAddNew("holiday")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Calendar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Configure country-specific holiday calendars, workweek patterns, and weekend days
                for accurate payroll calculation and leave management.
              </div>
              <TableCustom
                columns={holidayColumns}
                data={holidayCalendars}
                fallbackText="No holiday calendars configured yet."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal Placeholder */}
      {showAddModal && (
        <DialogBox
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={`${editingItem ? "Edit" : "Add"} ${modalType}`}
          maxWidth="md"
        >
          <div className="p-4 space-y-4">
            <div className="text-center text-gray-600">
              Form fields for {modalType} will be implemented here based on the type.
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogBox>
      )}
    </div>
  );
};

export default PayrollSetupConfiguration;

