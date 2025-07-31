import { Button } from "components/ui/button";
import {
  DateInput,
  TextInput,
  TextAreaInput,
  NumberInput,
} from "components/FormControl";
import { FinalSettlement } from "app/utils/Types/Payroll";
import { useEffect, useState } from "react";
import {
  saveFinalSettlement,
  saveEmployeePayroll,
  getEmployeePayrollDetailByEmpId,
  getFinalSettlementByEmpPayrollId,
} from "app/hooks/payroll";
import { toast } from "react-toastify";
import { validateClearanceForm } from "app/utils/FormSchema/exitAndClearanceFormSchema";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { SheetUI, EmployeeDetailUI } from "components";

const ClearanceSheet = ({
  isOpen,
  setIsOpen,
  employee_id,
  exit_id,
}) => {
  const [employee_payroll, setEmployeePayroll] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [FormData, setFormData] = useState(FinalSettlement);
  const [isSettlementExist, setIsSettlementExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employee payroll and existing final settlement data
  const fetchData = async (isMounted, employee_id) => {
    setIsLoading(true);
    try {
      // First, try to get payroll data
      const payrollDetails = await getEmployeePayrollDetailByEmpId(employee_id);
      if (isMounted) {
        setEmployeePayroll(payrollDetails);
        const settlementData = await getFinalSettlementByEmpPayrollId(
          payrollDetails.id
        );
        if (settlementData) {
          setIsSettlementExist(true);
          setFormData(settlementData);
        } else {
          setFormData({
            ...FinalSettlement,
            employee_payroll: payrollDetails.id,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (employee_id) fetchData(isMounted, employee_id);
    return () => {
      isMounted = false;
    };
  }, [employee_id]);

  // Helper function to calculate final amount
  const calculateFinalAmount = (field, value, formValues, handleChange) => {
    const updatedValues = formValues;
    updatedValues[field] = value;
    const {
      remaining_salary,
      earned_leave_encashment,
      total_deductions,
      gratuity_amount,
    } = updatedValues || {};
    const remainingSalary = parseFloat(remaining_salary || 0);
    const earnedLeaveEncashment = parseFloat(earned_leave_encashment || 0);
    const totalDeductions = parseFloat(total_deductions || 0);
    const gratuityAmount = parseFloat(gratuity_amount || 0);

    const final_amount = (
      remainingSalary +
      earnedLeaveEncashment -
      totalDeductions +
      gratuityAmount
    )
      .toFixed(2)
      .toString();
    handleChange("final_amount", final_amount);
    return final_amount;
  };

  const FormSheetData = {
    triggerText: null,
    title: "Final Settlement",
    description: null,
    footer: null,
  };

  const handleSubmit = async (values) => {
    setIsSubmittingForm(true);
    try {
      if (!employee_payroll) {
        throw new Error("Payroll data is missing");
      }
      // Save the final settlement
      const response = await saveFinalSettlement(values, values.id);
      if (response) {
        // Then update employee payroll to mark EOS applicable
        await saveEmployeePayroll(
          { is_eos_applicable: true },
          employee_payroll.id
        );
        // Update status and close the form
        if (exit_id)
          await saveEmployeeExitDetail(
            { clearance_status: "INITIATED" },
            exit_id
          );
        return {
          status: true,
          title: "Clearance Initiated Succesfully",
          description: "The clearance of employee have initiated successfully.",
          messageType: "Success",
        };
      }
    } catch (error) {
      console.error("Error in final settlement submission:", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: FormData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: (values) => {
          const errors = validateClearanceForm(values);
          if (!employee_payroll)
            errors.settlement_details =
              "No payroll details found for this employee";

          return errors;
        },
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 2,
        disableSubmit: isLoading || isSubmittingForm || !employee_payroll,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Employee Details",
            InputFields: [
              {
                InputField: EmployeeDetailUI,
                id: employee_id,
                InformationKeys: ["name", "department", "branch", "position"],
                variant: "FormView",
                colsSpan: 2,
                className: "grid grid-cols-2 gap-4",
              },
            ],
          },
          {
            sheetCardExtension: true,
            sheetCardTitle: "Settlement Details",
            sheetCardName: "settlement_details",
            description: isSettlementExist
              ? "Existing settlement found - you are editing the current settlement"
              : "",
            InputFields: [
              {
                InputField: DateInput,
                name: "last_working_date",
                label: "Last Working Date",
                required: true,
                onFieldUpdate: calculateFinalAmount,
              },
              {
                InputField: NumberInput,
                name: "remaining_salary",
                required: true,
                label: "Remaining Salary",
                onFieldUpdate: calculateFinalAmount,
              },
              {
                InputField: NumberInput,
                name: "earned_leave_encashment",
                label: "Earned Leave Encashment",
                onFieldUpdate: calculateFinalAmount,
              },
              {
                InputField: NumberInput,
                name: "total_deductions",
                label: "Total Deductions",
                onFieldUpdate: calculateFinalAmount,
              },
              {
                InputField: NumberInput,
                name: "gratuity_amount",
                label: "Gratuity Amount",
                onFieldUpdate: calculateFinalAmount,
              },
              {
                InputField: NumberInput,
                name: "final_amount",
                required: true,
                disabled: true,
                label: "Final Amount",
              },

              {
                InputField: TextAreaInput,
                name: "notes",
                label: "Notes",
                placeholder: "Enter Additional Notes",
                colsSpan: 2,
              },
            ].filter(Boolean),
          },
        ],
      }}
    ></SheetUI>
  );
};

export default ClearanceSheet;
