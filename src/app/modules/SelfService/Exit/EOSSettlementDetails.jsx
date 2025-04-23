import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "components/ui/card.jsx";
import { Button } from "components/ui/button";
import { PageLoader } from "components";
import { toast } from "react-toastify";
import { 
  getEOSSettlementById, 
  acknowledgeEOSSettlement 
} from "app/utils/MockData/eosSettlementMockData";
import { BadgeCheck, Clock, ArrowLeft, PenTool, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";

const EOSSettlementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);

  useEffect(() => {
    const fetchSettlement = async () => {
      try {
        setLoading(true);
        console.log("SelfService/EOSDetails - Fetching settlement with ID:", id);
        
        // First try with parse ID
        let data;
        try {
          data = await getEOSSettlementById(parseInt(id));
        } catch (parseError) {
          // If parsing fails, try with the original ID
          console.log("SelfService/EOSDetails - Trying with original ID format");
          data = await getEOSSettlementById(id);
        }
        
        if (data) {
          console.log("SelfService/EOSDetails - Settlement data found:", data);
          console.log("SelfService/EOSDetails - Department value:", data.department);
          setSettlement(data);
        } else {
          console.error("SelfService/EOSDetails - No settlement found with ID:", id);
          toast.error("Settlement not found");
        }
      } catch (error) {
        console.error("Error fetching EOS settlement details:", error);
        toast.error("Failed to load settlement details");
      } finally {
        setLoading(false);
      }
    };

    fetchSettlement();
  }, [id]);

  const handleAcknowledge = async () => {
    try {
      setAcknowledging(true);
      const response = await acknowledgeEOSSettlement(parseInt(id));
      if (response.success) {
        setSettlement(prev => ({ ...prev, status: "Acknowledged" }));
        toast.success("Settlement acknowledged successfully");
        setSignatureComplete(true);
        setTimeout(() => {
          setShowSignatureDialog(false);
          setSignatureComplete(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error acknowledging settlement:", error);
      toast.error("Failed to acknowledge settlement");
    } finally {
      setAcknowledging(false);
    }
  };

  const handleBack = () => {
    navigate("/exit-employee");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStatusBadge = (status) => {
    if (status === "Acknowledged") {
      return (
        <div className="flex items-center text-green-600">
          <BadgeCheck className="w-5 h-5 mr-1" />
          <span className="font-medium">Acknowledged</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-amber-600">
        <Clock className="w-5 h-5 mr-1" />
        <span className="font-medium">Pending Acknowledgment</span>
      </div>
    );
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!settlement) {
    return (
      <div className="p-6 text-center">
        <h2 className="mb-4 text-xl font-semibold">Settlement not found</h2>
        <Button onClick={handleBack} variant="outline" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  console.log("SelfService/EOSDetails - Rendering settlement with department:", settlement.department);

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
              <p>Return to previous page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center">
          {renderStatusBadge(settlement.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="border-b border-neutral-200">
            <h2 className="text-2xl font-semibold text-primary-1100">
              End of Service Settlement
            </h2>
            <p className="text-sm text-gray-1100">
              {settlement.resignationType} - {formatDate(settlement.resignationDate)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-neutral-900">Employee ID</h3>
                  <p className="text-base font-medium">{settlement.employeeId}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-neutral-900">Employee Name</h3>
                  <p className="text-base font-medium">{settlement.employeeName}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-neutral-900">Department</h3>
                  <p className="text-base font-medium">{settlement.department}</p>
                  {console.log("SelfService/EOSDetails - Department in render:", settlement.department)}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">Settlement Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Last Working Date</span>
                  <span className="text-base font-medium">{formatDate(settlement.lastWorkingDate)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Joining Date</span>
                  <span className="text-base font-medium">{formatDate(settlement.joiningDate)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Service Period</span>
                  <span className="text-base font-medium">{settlement.totalServiceYears} years</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">Earnings</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Basic Salary</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.basicSalary)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Allowances</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.allowances)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Gross Salary</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.grossSalary)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Gratuity</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.gratuityAmount)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Earned Leave</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.earnedLeave)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Unpaid Salary</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.unpaidSalary)}</span>
                </div>
                <div className="flex items-center justify-between p-3 font-semibold bg-gray-100 rounded-lg">
                  <span className="text-sm text-neutral-1100">Total Earnings</span>
                  <span className="text-base text-primary-900">{formatCurrency(settlement.settlementDetails.totalEarnings)}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">Deductions</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Loans</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.deductions.loans)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Advance Salary</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.deductions.advanceSalary)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-neutral-1100">Other Deductions</span>
                  <span className="text-base font-medium">{formatCurrency(settlement.settlementDetails.deductions.otherDeductions)}</span>
                </div>
                <div className="flex items-center justify-between p-3 font-semibold bg-gray-100 rounded-lg">
                  <span className="text-sm text-neutral-1100">Total Deductions</span>
                  <span className="text-base text-red-600">{formatCurrency(settlement.settlementDetails.deductions.totalDeductions)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 mb-8 rounded-md bg-primary-50">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-primary-900">Final Settlement Amount</h3>
                  <p className="text-xl font-bold text-primary-900">{formatCurrency(settlement.settlementDetails.finalSettlementAmount)}</p>
                </div>
              </div>
            </div>

            {settlement.status === "Acknowledged" && (
              <div className="flex items-center p-4 mt-6 text-green-700 border rounded-md bg-green-50">
                <BadgeCheck className="w-5 h-5 mr-2" />
                <span>This settlement has been acknowledged by the employee.</span>
              </div>
            )}

            <div className="flex justify-end mt-6">
              {settlement.status === "Pending" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => setShowSignatureDialog(true)}
                        className="flex items-center gap-2"
                      >
                        <PenTool className="w-4 h-4" />
                        E-Sign & Acknowledge
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Acknowledge your End of Service settlement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {signatureComplete ? "Acknowledgment Complete" : "E-Sign & Acknowledge"}
            </DialogTitle>
          </DialogHeader>
          
          {signatureComplete ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
              <p className="text-lg font-medium text-center">
                Thank you for acknowledging your settlement.
              </p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <p className="mb-4">
                  By acknowledging this End of Service settlement, you confirm that:
                </p>
                <ul className="pl-5 space-y-2 text-sm list-disc">
                  <li>You have reviewed and understand the settlement calculations</li>
                  <li>The information presented in this settlement is accurate</li>
                  <li>You accept the final settlement amount of {formatCurrency(settlement.settlementDetails.finalSettlementAmount)}</li>
                </ul>
                
                <div className="p-4 mt-6 border rounded-md bg-amber-50 text-amber-700">
                  <p className="mb-2 font-medium">Important Next Steps:</p>
                  <p>After electronic acknowledgment, please visit our Head Office to complete your physical signature and collect your EOS check.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSignatureDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleAcknowledge}
                  disabled={acknowledging}
                >
                  {acknowledging ? "Processing..." : "Acknowledge"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EOSSettlementDetails; 