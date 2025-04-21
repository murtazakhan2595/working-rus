import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "src/@/components/ui/label";
import { PageLoader } from "components";
import { toast } from "react-toastify";
import { 
  getEOSSettlementById,
  acknowledgeEOSSettlement 
} from "app/utils/MockData/eosSettlementMockData";
import { 
  eosEmployeeDetailsById 
} from "app/utils/MockData/payrollEOSMockData";
import { 
  ArrowLeft, 
  Download, 
  Plus, 
  Trash2, 
  BadgeCheck, 
  Clock, 
  CheckCircle 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "src/@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/@/components/ui/dialog";

const EOSDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [customDeduction, setCustomDeduction] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [statusToChange, setStatusToChange] = useState(null);
  const [companyName, setCompanyName] = useState("TECBRIX CLOUD SERVICE & DATACENTER PROVIDERS L.L.C.");
  const formRef = useRef(null);
  const [error, setError] = useState(null);

  const deductionOptions = [
    "VISA Charges (prorata)",
    "Insurance Cost",
    "Notice Pay (As per HR instruction)",
    "Leave Pay (4 days)",
    "Fine and penalties",
    "Training cost",
    "Salary deduction",
    "Telephone Deduction",
    "Advance balance",
    "Loan Balance",
    "Agency fee",
    "Petty cash and Cash Float",
    "Others"
  ];

  const isPayrollRoute = location.pathname.includes('/payroll/eos/');
  const isSelfServiceRoute = !isPayrollRoute;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const numericId = parseInt(id, 10);
        
        // Determine which API to use based on the current route
        let data;
        if (isPayrollRoute) {
          try {
            // For payroll route
            data = await eosEmployeeDetailsById(numericId);
          } catch (error) {
            console.error("Error fetching from payroll data:", error);
            toast.error("Failed to load employee from payroll data");
          }
        } else {
          try {
            // For self-service route
            data = await getEOSSettlementById(numericId);
          } catch (error) {
            console.error("Error fetching from settlement data:", error);
            toast.error("Failed to load settlement data");
          }
        }
        
        if (!data) {
          throw new Error("No data found");
        }
        
        console.log("Fetched data:", data); // For debugging
        setEmployee(data);
        
        // Initialize form data if data is available
        if (data) {
          setFormData({
            salary: { ...data.salary },
            eosCalculation: { ...data.eosCalculation },
            deductions: [...data.deductions],
            totalDeductions: data.totalDeductions || 0,
            netPayable: data.netPayable || 0
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.pathname]);

  const handleBack = () => {
    if (isPayrollRoute) {
      navigate("/payroll/eos");
    } else {
      navigate("/self-service/exit");
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section === "salary") {
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [field]: value
        }
      }));
    } else if (section === "eosCalculation") {
      if (field === "leavePay.amount" || field === "leavePay.days") {
        const [parent, child] = field.split(".");
        setFormData(prev => ({
          ...prev,
          eosCalculation: {
            ...prev.eosCalculation,
            [parent]: {
              ...prev.eosCalculation[parent],
              [child]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          eosCalculation: {
            ...prev.eosCalculation,
            [field]: value
          }
        }));
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing && formRef.current) {
      // Reset form if canceling edit
      setFormData({
        salary: { ...employee.salary },
        eosCalculation: { ...employee.eosCalculation },
        deductions: [...employee.deductions]
      });
    }
    setIsEditing(!isEditing);
  };

  const calculateTotalGrossSalary = () => {
    if (!formData || !formData.salary) return { totalGrossSalary: 0, perDaySalary: "0.00" };
    
    const { basicSalary, housing, transportation, food, otherAllowance, mobile, salik, additionalAllowance } = formData.salary;
    const total = parseFloat(basicSalary || 0) + 
                parseFloat(housing || 0) + 
                parseFloat(transportation || 0) + 
                parseFloat(food || 0) + 
                parseFloat(otherAllowance || 0) + 
                parseFloat(mobile || 0) + 
                parseFloat(salik || 0) + 
                parseFloat(additionalAllowance || 0);
    
    // Calculate per day salary
    const perDaySalary = (total * 12) / 365;
    
    return { totalGrossSalary: total, perDaySalary: perDaySalary.toFixed(2) };
  };

  const calculateTotalPayable = () => {
    if (!formData || !formData.eosCalculation) return 0;
    
    const { leavePay, gratuity, gpssa, airTicket, netHealthCommission, commissionQ4, commissionQ1, loan, noticePay, additionalFields } = formData.eosCalculation;
    
    let total = parseFloat(leavePay?.amount || 0) + 
               parseFloat(gratuity || 0) + 
               parseFloat(gpssa || 0) + 
               parseFloat(airTicket || 0) + 
               parseFloat(netHealthCommission || 0) + 
               parseFloat(commissionQ4 || 0) + 
               parseFloat(commissionQ1 || 0) + 
               parseFloat(loan || 0) + 
               parseFloat(noticePay || 0);
    
    // Add additional fields
    if (additionalFields && additionalFields.length > 0) {
      additionalFields.forEach(field => {
        total += parseFloat(field.amount || 0);
      });
    }
    
    return total;
  };

  const calculateTotalDeductions = () => {
    if (!formData || !formData.deductions) return 0;
    
    let total = 0;
    if (formData.deductions && formData.deductions.length > 0) {
      formData.deductions.forEach(deduction => {
        total += parseFloat(deduction.amount || 0);
      });
    }
    return total;
  };

  const calculateNetPayable = () => {
    if (!formData) return 0;
    
    const totalPayable = calculateTotalPayable();
    const totalDeductions = calculateTotalDeductions();
    const netAmount = totalPayable - totalDeductions;
    
    console.log({
      totalPayable,
      totalDeductions,
      netAmount
    });
    
    return netAmount;
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      
      // Calculate totals before saving
      const { totalGrossSalary, perDaySalary } = calculateTotalGrossSalary();
      const totalPayable = calculateTotalPayable();
      const totalDeductions = calculateTotalDeductions();
      const netPayable = calculateNetPayable();
      
      console.log("Saving values:", {
        totalGrossSalary,
        perDaySalary,
        totalPayable,
        totalDeductions,
        netPayable
      });
      
      // Update formData with calculated values
      const updatedFormData = {
        ...formData,
        salary: {
          ...formData.salary,
          totalGrossSalary,
          perDaySalary
        },
        eosCalculation: {
          ...formData.eosCalculation,
          totalPayable
        },
        totalDeductions,
        netPayable
      };
      
      const response = await acknowledgeEOSSettlement(id, updatedFormData);
      
      if (response.success) {
        toast.success("EOS details updated successfully");
        setEmployee(prev => ({
          ...prev,
          ...updatedFormData
        }));
        setFormData(updatedFormData);
        setIsEditing(false);
      } else {
        toast.error(response.message || "Failed to update EOS details");
      }
    } catch (error) {
      console.error("Error saving EOS details:", error);
      toast.error("Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmStatusChange = (status) => {
    setStatusToChange(status);
    setShowConfirmDialog(true);
  };

  const handleStatusChange = async () => {
    try {
      setSubmitting(true);
      const response = await acknowledgeEOSSettlement(id);
      
      if (response.success) {
        toast.success(response.message);
        setEmployee(prev => ({
          ...prev,
          status: "Acknowledged"
        }));
        setShowConfirmDialog(false);
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = (format) => {
    toast.info(`Exporting as ${format}...`);
    // This would normally trigger a file download
  };

  const handleAddDeduction = () => {
    if (customDeduction) {
      setFormData(prev => ({
        ...prev,
        deductions: [
          ...prev.deductions,
          { type: customDeduction, amount: 0 }
        ]
      }));
      setCustomDeduction("");
    }
  };

  const handleRemoveDeduction = (index) => {
    setFormData(prev => ({
      ...prev,
      deductions: prev.deductions.filter((_, i) => i !== index)
    }));
  };

  const handleDeductionAmountChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      deductions: prev.deductions.map((item, i) => 
        i === index ? { ...item, amount: value } : item
      )
    }));
  };

  const handleAddCustomField = () => {
    setFormData(prev => ({
      ...prev,
      eosCalculation: {
        ...prev.eosCalculation,
        additionalFields: [
          ...(prev.eosCalculation.additionalFields || []),
          { label: "Custom Field", amount: 0 }
        ]
      }
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate service period in years, months, days
  const calculateServicePeriod = (joiningDate, lastWorkingDay) => {
    const startDate = new Date(joiningDate);
    const endDate = new Date(lastWorkingDay);
    
    // Calculate total days
    const diffTime = Math.abs(endDate - startDate);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, days
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = Math.floor((totalDays % 365) % 30);
    
    return {
      years,
      months,
      days,
      totalDays
    };
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <div className="flex items-center px-3 py-1 text-blue-600 ">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Approved</span>
          </div>
        );
      case "Paid":
        return (
          <div className="flex items-center px-3 py-1 text-green-600 ">
            <BadgeCheck className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Paid</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center px-3 py-1 text-amber-600 ">
            <Clock className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Pending</span>
          </div>
        );
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!employee) {
    return (
      <div className="p-6 text-center">
        <h2 className="mb-4 text-xl font-semibold">Employee not found</h2>
        <Button onClick={handleBack} variant="outline" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  const servicePeriod = calculateServicePeriod(employee.joiningDate, employee.lastWorkingDay);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleBack} 
                variant="outline"
                className="flex items-center gap-2 px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to {isPayrollRoute ? "EOS list" : "Exit Dashboard"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center gap-4">
          {renderStatusBadge(employee.status)}
          {isPayrollRoute && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleExport('pdf')}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('excel')}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="border-b border-neutral-200">
            <h2 className="text-2xl font-semibold text-primary-1100">
              End of Service Settlement
            </h2>
            <p className="text-sm text-gray-500">
              {employee.type} - {formatDate(employee.lastWorkingDay)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-neutral-900">Employee ID</h3>
                  <p className="text-base font-medium">{employee.employeeId}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-neutral-900">Employee Name</h3>
                  <p className="text-base font-medium">{employee.employeeName}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-neutral-900">Department</h3>
                  <p className="text-base font-medium">{employee.branch}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">Settlement Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-900">Last Working Date</span>
                  <span className="text-base font-medium">{formatDate(employee.lastWorkingDay)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-900">Joining Date</span>
                  <span className="text-base font-medium">{formatDate(employee.joiningDate)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-900">Service Period</span>
                  <span className="text-base font-medium">
                    {servicePeriod.years} years, {servicePeriod.months} months, {servicePeriod.days} days
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Salary Structure</h3>
                {employee.status === "Pending" && isPayrollRoute && (
                  <Button 
                    variant={isEditing ? "destructive" : "outline"} 
                    onClick={handleEditToggle}
                    size="sm"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Basic Salary</span>
                    <span className="text-base font-medium">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData?.salary.basicSalary || ""}
                          onChange={(e) => handleInputChange("salary", "basicSalary", parseFloat(e.target.value))}
                          className="w-40 text-right"
                        />
                      ) : (
                        formatCurrency(formData?.salary.basicSalary || 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Housing</span>
                    <span className="text-base font-medium">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData?.salary.housing || ""}
                          onChange={(e) => handleInputChange("salary", "housing", parseFloat(e.target.value))}
                          className="w-40 text-right"
                        />
                      ) : (
                        formatCurrency(formData?.salary.housing || 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Transportation</span>
                    <span className="text-base font-medium">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData?.salary.transportation || ""}
                          onChange={(e) => handleInputChange("salary", "transportation", parseFloat(e.target.value))}
                          className="w-40 text-right"
                        />
                      ) : (
                        formatCurrency(formData?.salary.transportation || 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Total Gross Salary</span>
                    <span className="text-base font-semibold text-primary-900">
                      {isEditing 
                        ? formatCurrency(calculateTotalGrossSalary().totalGrossSalary)
                        : formatCurrency(formData?.salary.totalGrossSalary || 0)
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">End of Service Benefits</h3>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddCustomField}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Field</span>
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Leave Pay ({formData?.eosCalculation.leavePay?.days || 0} days)</span>
                    <span className="text-base font-medium">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={formData?.eosCalculation.leavePay?.days || ""}
                            onChange={(e) => handleInputChange("eosCalculation", "leavePay.days", parseInt(e.target.value))}
                            className="w-16 text-right"
                            placeholder="Days"
                          />
                          <Input
                            type="number"
                            value={formData?.eosCalculation.leavePay?.amount || ""}
                            onChange={(e) => handleInputChange("eosCalculation", "leavePay.amount", parseFloat(e.target.value))}
                            className="w-32 text-right"
                          />
                        </div>
                      ) : (
                        formatCurrency(formData?.eosCalculation.leavePay?.amount || 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Gratuity</span>
                    <span className="text-base font-medium">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData?.eosCalculation.gratuity || ""}
                          onChange={(e) => handleInputChange("eosCalculation", "gratuity", parseFloat(e.target.value))}
                          className="w-40 text-right"
                        />
                      ) : (
                        formatCurrency(formData?.eosCalculation.gratuity || 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Air Ticket</span>
                    <span className="text-base font-medium">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData?.eosCalculation.airTicket || ""}
                          onChange={(e) => handleInputChange("eosCalculation", "airTicket", parseFloat(e.target.value))}
                          className="w-40 text-right"
                        />
                      ) : (
                        formatCurrency(formData?.eosCalculation.airTicket || 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Commission</span>
                    <span className="text-base font-medium">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={(formData?.eosCalculation.commissionQ4 || 0) + (formData?.eosCalculation.commissionQ1 || 0)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) / 2;
                            handleInputChange("eosCalculation", "commissionQ4", value);
                            handleInputChange("eosCalculation", "commissionQ1", value);
                          }}
                          className="w-40 text-right"
                        />
                      ) : (
                        formatCurrency((formData?.eosCalculation.commissionQ4 || 0) + (formData?.eosCalculation.commissionQ1 || 0))
                      )}
                    </span>
                  </div>
                  
                  {/* Render additional fields */}
                  {formData?.eosCalculation.additionalFields?.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                      <span className="text-sm font-medium text-neutral-900">
                        {isEditing ? (
                          <Input
                            type="text"
                            value={field.label}
                            onChange={(e) => {
                              const updatedFields = [...formData.eosCalculation.additionalFields];
                              updatedFields[index].label = e.target.value;
                              handleInputChange("eosCalculation", "additionalFields", updatedFields);
                            }}
                            className="w-40"
                          />
                        ) : (
                          field.label
                        )}
                      </span>
                      <div className="flex items-center">
                        <span className="text-base font-medium">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={field.amount || ""}
                              onChange={(e) => {
                                const updatedFields = [...formData.eosCalculation.additionalFields];
                                updatedFields[index].amount = parseFloat(e.target.value);
                                handleInputChange("eosCalculation", "additionalFields", updatedFields);
                              }}
                              className="w-40 text-right"
                            />
                          ) : (
                            formatCurrency(field.amount || 0)
                          )}
                        </span>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedFields = formData.eosCalculation.additionalFields.filter((_, i) => i !== index);
                              handleInputChange("eosCalculation", "additionalFields", updatedFields);
                            }}
                            className="w-8 h-8 p-0 ml-2 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between col-span-2 p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-900">Total Payable</span>
                    <span className="text-base font-semibold text-primary-900">
                      {isEditing 
                        ? formatCurrency(calculateTotalPayable())
                        : formatCurrency(formData?.eosCalculation.totalPayable || 0)
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Deductions</h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <Select value={customDeduction} onValueChange={setCustomDeduction}>
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select deduction" />
                      </SelectTrigger>
                      <SelectContent>
                        {deductionOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddDeduction}
                      disabled={!customDeduction}
                      className="flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {formData?.deductions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {formData.deductions.map((deduction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <span className="text-sm font-medium text-neutral-900">{deduction.type}</span>
                        <div className="flex items-center">
                          <span className="text-base font-medium">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={deduction.amount || ""}
                                onChange={(e) => handleDeductionAmountChange(index, parseFloat(e.target.value))}
                                className="w-40 text-right"
                              />
                            ) : (
                              formatCurrency(deduction.amount || 0)
                            )}
                          </span>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveDeduction(index)}
                              className="w-8 h-8 p-0 ml-2 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                      <span className="text-sm font-medium text-neutral-900">Total Deductions</span>
                      <span className="text-base font-semibold text-destructive">
                        {isEditing 
                          ? formatCurrency(calculateTotalDeductions())
                          : formatCurrency(formData?.totalDeductions || 0)
                        }
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">No deductions added</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 mb-4 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Net End of Service Benefits Payable</span>
                <span className="text-xl font-bold text-primary-900">
                  {isEditing 
                    ? formatCurrency(calculateNetPayable())
                    : formatCurrency(formData?.netPayable || 0)
                  }
                </span>
              </div>
            </div>
            
            <div className="pt-4 mt-8 border-t">
              <p className="mb-4 text-sm text-gray-700">
                I hereby undertake that the above calculation of my End of Service is correct and acceptable to me.
                With the above payment, I will have no further claim from {companyName}.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Employee Signature</Label>
                  <div className="h-16 p-2 mt-1 border border-gray-300 border-dashed rounded-md">
                    {employee.status !== "Pending" ? (
                      <div className="flex items-center justify-center h-full text-green-600">
                        <BadgeCheck className="w-5 h-5 mr-1" />
                        <span>Signed</span>
                      </div>
                    ) : (
                      <p className="flex items-center justify-center h-full text-sm text-gray-400">
                        Pending
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Name</Label>
                  <p className="mt-2 font-medium">{employee.employeeName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Receipt Date</Label>
                  <p className="mt-2 font-medium">
                    {employee.status !== "Pending" 
                      ? formatDate(new Date())
                      : "-"
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isEditing && (
        <div className="flex justify-end mt-6 space-x-2">
          <Button 
            variant="outline" 
            onClick={handleEditToggle}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={submitting}
          >
            Save Changes
          </Button>
        </div>
      )}
      
      {!isEditing && employee.status === "Pending" && (
        <div className="flex justify-end mt-6">
          {isSelfServiceRoute ? (
            <Button 
              onClick={() => confirmStatusChange("Approved")}
              disabled={submitting}
            >
              E-Sign & Acknowledge
            </Button>
          ) : (
            <Button 
              onClick={() => confirmStatusChange("Approved")}
              disabled={submitting}
            >
              Approve
            </Button>
          )}
        </div>
      )}
      
      {!isEditing && employee.status === "Approved" && isPayrollRoute && (
        <div className="flex justify-end mt-6">
          <Button 
            onClick={() => confirmStatusChange("Paid")}
            disabled={submitting}
          >
            Mark as Paid
          </Button>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {statusToChange === "Approved" ? "Approval" : "Payment"}</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to {statusToChange === "Approved" ? "approve" : "mark as paid"} this EOS settlement? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleStatusChange} disabled={submitting}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EOSDetails; 