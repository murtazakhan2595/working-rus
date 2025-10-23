import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  createPayrollRun,
  fetchCountries,
  fetchExchangeRates,
  fetchAIRecommendations
} from "state/slices/GlobalPayrollSlice";
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  FileText,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Checkbox } from "components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import MultiCurrencySelector from "../components/MultiCurrencySelector";
import AIAlertWidget from "../components/AIAlertWidget";
import ApprovalFlowComponent from "../components/ApprovalFlowComponent";
import { formatCurrency, generatePayrollSummary } from "utils/payrollUtils";
import { toast } from "react-toastify";

const STEPS = [
  { id: 1, title: "Period & Country", icon: Calendar },
  { id: 2, title: "Select Employees", icon: Users },
  { id: 3, title: "Components & Calculation", icon: DollarSign },
  { id: 4, title: "AI Review", icon: Sparkles },
  { id: 5, title: "Summary & Approval", icon: FileText },
];

const PayrollRunWizard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { countries, exchangeRates } = useSelector((state) => state.globalPayroll);
  const baseUrl = useSelector((state) => state.user.baseUrl);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Wizard Data
  const [wizardData, setWizardData] = useState({
    // Step 1
    period: "",
    periodType: "monthly",
    country: "",
    currency: "",
    
    // Step 2
    selectedEmployees: [],
    includeAllEmployees: true,
    excludedEmployees: [],
    departments: [],
    branches: [],
    
    // Step 3
    includeBasic: true,
    includeAllowances: true,
    includeOvertime: true,
    includeDeductions: true,
    overtimeHours: {},
    adjustments: {},
    
    // Step 4
    aiReviewCompleted: false,
    aiAnomalies: [],
    
    // Step 5
    approvalRequired: true,
    approvalLevels: [],
    notes: "",
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchExchangeRates());
  }, [dispatch]);

  // Fetch employees when country is selected
  useEffect(() => {
    if (wizardData.country && currentStep === 2) {
      fetchEmployees();
    }
  }, [wizardData.country, currentStep]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockEmployees = [
        { id: 1, name: "John Doe", department: "Engineering", basic_salary: 15000, currency: "AED" },
        { id: 2, name: "Jane Smith", department: "Sales", basic_salary: 12000, currency: "AED" },
        { id: 3, name: "Ahmed Ali", department: "HR", basic_salary: 10000, currency: "AED" },
        { id: 4, name: "Sarah Johnson", department: "Finance", basic_salary: 14000, currency: "AED" },
        { id: 5, name: "Mohammed Hassan", department: "Engineering", basic_salary: 16000, currency: "AED" },
      ];
      
      setEmployees(mockEmployees);
      
      if (wizardData.includeAllEmployees) {
        setWizardData((prev) => ({
          ...prev,
          selectedEmployees: mockEmployees.map((e) => e.id),
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!wizardData.period || !wizardData.country || !wizardData.currency) {
        toast.error("Please fill all required fields");
        return;
      }
    }
    
    if (currentStep === 2) {
      if (wizardData.selectedEmployees.length === 0) {
        toast.error("Please select at least one employee");
        return;
      }
    }

    // Run AI review on step 4
    if (currentStep === 3) {
      runAIReview();
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFieldChange = (field, value) => {
    setWizardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmployeeToggle = (employeeId) => {
    setWizardData((prev) => {
      const isSelected = prev.selectedEmployees.includes(employeeId);
      return {
        ...prev,
        selectedEmployees: isSelected
          ? prev.selectedEmployees.filter((id) => id !== employeeId)
          : [...prev.selectedEmployees, employeeId],
      };
    });
  };

  const runAIReview = () => {
    // Simulate AI review
    dispatch(fetchAIRecommendations());
    
    const mockAnomalies = [
      {
        type: "missing_timesheet",
        severity: "medium",
        message: "2 employees have missing timesheet data for overtime calculation",
        suggestion: "Review overtime entries for Employee ID: 1234, 5678",
      },
    ];

    setWizardData((prev) => ({
      ...prev,
      aiReviewCompleted: true,
      aiAnomalies: mockAnomalies,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const selectedEmployeesData = employees.filter((e) =>
        wizardData.selectedEmployees.includes(e.id)
      );

      const payrollData = {
        period: wizardData.period,
        period_type: wizardData.periodType,
        country: wizardData.country,
        currency: wizardData.currency,
        employees: selectedEmployeesData,
        include_basic: wizardData.includeBasic,
        include_allowances: wizardData.includeAllowances,
        include_overtime: wizardData.includeOvertime,
        include_deductions: wizardData.includeDeductions,
        adjustments: wizardData.adjustments,
        notes: wizardData.notes,
        status: wizardData.approvalRequired ? "draft" : "approved",
      };

      await dispatch(createPayrollRun(payrollData)).unwrap();
      
      toast.success("Payroll run created successfully!");
      navigate("/payroll/runs");
    } catch (error) {
      toast.error("Failed to create payroll run");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1PeriodCountry 
          data={wizardData}
          onChange={handleFieldChange}
          countries={countries}
        />;
      case 2:
        return <Step2SelectEmployees
          data={wizardData}
          employees={employees}
          loading={loading}
          onEmployeeToggle={handleEmployeeToggle}
          onChange={handleFieldChange}
        />;
      case 3:
        return <Step3Components
          data={wizardData}
          employees={employees.filter((e) => wizardData.selectedEmployees.includes(e.id))}
          onChange={handleFieldChange}
        />;
      case 4:
        return <Step4AIReview
          data={wizardData}
          onRunReview={runAIReview}
        />;
      case 5:
        return <Step5Summary
          data={wizardData}
          employees={employees.filter((e) => wizardData.selectedEmployees.includes(e.id))}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/payroll")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Create Payroll Run
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Step {currentStep} of {STEPS.length}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          ${isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isCurrent
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 ${
                          isCompleted
                            ? "bg-green-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="min-h-[500px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={handleNext}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Creating..." : "Create Payroll Run"}
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Step 1: Period & Country
const Step1PeriodCountry = ({ data, onChange, countries }) => {
  const defaultCountries = [
    { code: "UAE", name: "United Arab Emirates", currency: "AED" },
    { code: "UK", name: "United Kingdom", currency: "GBP" },
    { code: "Kenya", name: "Kenya", currency: "KES" },
    { code: "Nigeria", name: "Nigeria", currency: "NGN" },
  ];

  const availableCountries = countries.length > 0 ? countries : defaultCountries;

  const handleCountryChange = (country) => {
    onChange("country", country);
    const selectedCountry = availableCountries.find((c) => c.code === country);
    if (selectedCountry) {
      onChange("currency", selectedCountry.currency);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Payroll Period & Country Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payroll Period */}
          <div className="space-y-2">
            <Label htmlFor="period">Payroll Period *</Label>
            <Input
              id="period"
              type="month"
              value={data.period}
              onChange={(e) => onChange("period", e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Period Type */}
          <div className="space-y-2">
            <Label htmlFor="periodType">Period Type</Label>
            <Select
              value={data.periodType}
              onValueChange={(value) => onChange("periodType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={data.country}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <MultiCurrencySelector
              value={data.currency}
              onChange={(value) => onChange("currency", value)}
              label="Currency *"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Country-Specific Configuration
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Tax rules, statutory deductions, and compliance requirements will be automatically
                applied based on the selected country.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Select Employees
const Step2SelectEmployees = ({ data, employees, loading, onEmployeeToggle, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Select Employees
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Checkbox
            id="includeAll"
            checked={data.includeAllEmployees}
            onCheckedChange={(checked) => {
              onChange("includeAllEmployees", checked);
              if (checked) {
                onChange("selectedEmployees", employees.map((e) => e.id));
              }
            }}
          />
          <Label htmlFor="includeAll" className="font-medium">
            Include all employees from selected country
          </Label>
        </div>

        {/* Employee List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Employees ({data.selectedEmployees.length} selected)</h4>
            {loading && <span className="text-sm text-gray-500">Loading...</span>}
          </div>

          <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={data.selectedEmployees.includes(employee.id)}
                    onCheckedChange={() => onEmployeeToggle(employee.id)}
                  />
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(employee.basic_salary, employee.currency)}
                  </p>
                  <p className="text-xs text-gray-500">Basic Salary</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Components & Calculation
const Step3Components = ({ data, employees, onChange }) => {
  const summary = generatePayrollSummary(
    employees.map((e) => ({ gross_salary: e.basic_salary, net_salary: e.basic_salary }))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Salary Components & Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Component Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Include Components:</h4>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeBasic"
                checked={data.includeBasic}
                onCheckedChange={(checked) => onChange("includeBasic", checked)}
              />
              <Label htmlFor="includeBasic">Basic Salary</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAllowances"
                checked={data.includeAllowances}
                onCheckedChange={(checked) => onChange("includeAllowances", checked)}
              />
              <Label htmlFor="includeAllowances">Allowances (HRA, Transport, etc.)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeOvertime"
                checked={data.includeOvertime}
                onCheckedChange={(checked) => onChange("includeOvertime", checked)}
              />
              <Label htmlFor="includeOvertime">Overtime</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDeductions"
                checked={data.includeDeductions}
                onCheckedChange={(checked) => onChange("includeDeductions", checked)}
              />
              <Label htmlFor="includeDeductions">Deductions (Tax, PF, etc.)</Label>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <h4 className="font-semibold mb-3">Payroll Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-xl font-bold">{summary.totalEmployees}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Gross</p>
              <p className="text-xl font-bold">{formatCurrency(summary.totalGross)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Salary</p>
              <p className="text-xl font-bold">{formatCurrency(summary.averageSalary)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 4: AI Review
const Step4AIReview = ({ data, onRunReview }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI-Powered Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {!data.aiReviewCompleted ? (
              <div className="space-y-4">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
                <h3 className="text-lg font-semibold">Review Required</h3>
                <p className="text-gray-500">
                  AI will analyze the payroll data for anomalies, missing information, and suggestions.
                </p>
                <Button onClick={onRunReview} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Run AI Review
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Check className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold">Review Completed</h3>
                <p className="text-gray-500">AI analysis complete. Check alerts below.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {data.aiReviewCompleted && <AIAlertWidget />}
    </div>
  );
};

// Step 5: Summary & Approval
const Step5Summary = ({ data, employees }) => {
  const summary = generatePayrollSummary(
    employees.map((e) => ({ gross_salary: e.basic_salary, net_salary: e.basic_salary }))
  );

  const mockApprovalFlow = [
    {
      role: "Manager",
      status: "pending",
      approver: { name: "John Manager", email: "john@company.com" },
      required: true,
    },
    {
      role: "Finance Head",
      status: "pending",
      approver: { name: "Sarah Finance", email: "sarah@company.com" },
      required: true,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Run Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Period</p>
              <p className="font-medium">{data.period}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Country</p>
              <p className="font-medium">{data.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Currency</p>
              <p className="font-medium">{data.currency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Employees</p>
              <p className="font-medium">{summary.totalEmployees}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="font-bold text-lg">{formatCurrency(summary.totalGross, data.currency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ApprovalFlowComponent approvalLevels={mockApprovalFlow} currentLevel={0} />
    </div>
  );
};

export default PayrollRunWizard;

