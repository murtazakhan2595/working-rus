import { Button } from "components/ui/button";
import { DateInput, TextInput, TextAreaInput } from "components/FormControl";
import SheetComponent from "../../../../components/ui/SheetComponent";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { getEmployeePayroll, saveFinalSettlement, saveEmployeePayroll } from "app/hooks/payroll";
import { toast } from "react-toastify";
import { validateClearanceForm } from "app/utils/FormSchema/exitAndClearanceFormSchema";
import useEOSSettlement from "app/hooks/useEOSSettlement";

const ClearanceSheet = ({
  isOpen,
  setIsOpen,
  handleOptionSelect,
  employeeId,
}) => {
  const [payroll, setPayroll] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchEmployePayrollID = async () => {
    try {
      if (!employeeId) {
        console.error("Employee ID is missing");
        return;
      }

      const payrollData = await getEmployeePayroll({
        filterData: { employee_id: employeeId },
      });
      
      console.log("Fetched payroll data:", payrollData);
      
      if (payrollData && payrollData.results && payrollData.results.length > 0) {
        setPayroll(payrollData.results[0]);
      } else {
        console.error("No payroll data found for employee ID:", employeeId);
        setErrorMessage("No payroll data found for this employee");
      }
    } catch (error) {
      console.error("Error fetching employee payroll:", error);
      setErrorMessage("Failed to fetch employee payroll data");
    }
  };

  useEffect(() => {
    if (employeeId && isOpen) {
      fetchEmployePayrollID();
    }
  }, [employeeId, isOpen]);

  // Helper function to calculate final amount
  const calculateFinalAmount = (values) => {
    const remainingSalary = parseFloat(values.remaining_salary) || 0;
    const earnedLeaveEncashment = parseFloat(values.earned_leave_encashment) || 0;
    const totalDeductions = parseFloat(values.total_deductions) || 0;
    const gratuityAmount = parseFloat(values.gratuity_amount) || 0;
    
    return (remainingSalary + earnedLeaveEncashment - totalDeductions + gratuityAmount).toFixed(2);
  };

  const formSheetData = {
    triggerText: null,
    title: "Final Settlement",
    description: null,
    footer: null,
  };

  const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      if (!payroll) {
        throw new Error("Payroll data is missing");
      }
      
      // Prepare the final data with payroll ID
      const finalValues = { 
        ...values, 
        employee_payroll: payroll.id 
      };
      
      console.log("Submitting final settlement:", finalValues);
      
      // First save the final settlement
      const response = await saveFinalSettlement(finalValues);
      
      if (!response) {
        throw new Error("Failed to save final settlement");
      }
      
      console.log("Final settlement saved successfully");
      
      // Then update employee payroll to mark EOS applicable
      const empPayrollUpdateData = {
        ...payroll,
        is_eos_applicable: true
      };
      
      console.log("Updating employee payroll:", empPayrollUpdateData);
      
      const empPayroll = await saveEmployeePayroll(empPayrollUpdateData);
      
      if (!empPayroll) {
        throw new Error("Failed to update employee payroll");
      }
      
      console.log("Employee payroll updated successfully");
      
      // Update status and close the form
      handleOptionSelect("initiated clearance");
      setIsOpen(false);
      toast.success("Final Settlement saved successfully");
      resetForm();
    } catch (error) {
      console.error("Error in final settlement submission:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
      toast.error(error instanceof Error ? error.message : "Failed to save final settlement");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const { showEOSSettlement } = useEOSSettlement(
    { id: employeeId, status: "terminated" },
    null
  );

  return (
    <SheetComponent
      {...formSheetData}
      contentClassName="custom-sheet-width"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {errorMessage && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {errorMessage}
        </div>
      )}
      
      {!payroll && !errorMessage && (
        <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg">
          Loading employee payroll data...
        </div>
      )}
      
      <Formik
        initialValues={{
          last_working_date: "",
          remaining_salary: "",
          earned_leave_encashment: "",
          total_deductions: "",
          gratuity_amount: "",
          final_amount: "",
          notes: "",
        }}
        validate={validateClearanceForm}
        enableReinitialize={true}
        onSubmit={handleFormSubmit}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} className="my-6 space-y-6">
            <div className={`flex w-full flex-col rounded-lg`}>
              <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium tracking-[0px] text-zinc-900">
                <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                  <div className="text-zinc-950">Details</div>
                </div>
                <DateInput
                  name={"last_working_date"}
                  error={props.errors?.last_working_date}
                  touch={props.touched?.last_working_date}
                  value={props.values?.last_working_date}
                  label={"Last Working Date"}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  required={true}
                  placeholder="Pick a date"
                />
                <div className="flex items-center gap-4 ">
                  <div className="flex-1 space-y-2">
                    <TextInput
                      name={"remaining_salary"}
                      error={props.errors?.remaining_salary}
                      touch={props.touched?.remaining_salary}
                      value={props.values?.remaining_salary}
                      label={"Remaining Salary"}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                        // Calculate final amount when this field changes
                        const updatedValues = {
                          ...props.values,
                          remaining_salary: value
                        };
                        props.setFieldValue("final_amount", calculateFinalAmount(updatedValues));
                      }}
                      required={true}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <TextInput
                      name={"earned_leave_encashment"}
                      error={props.errors?.earned_leave_encashment}
                      touch={props.touched?.earned_leave_encashment}
                      value={props.values?.earned_leave_encashment}
                      label={"Earned Leave Encashment"}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                        // Calculate final amount when this field changes
                        const updatedValues = {
                          ...props.values,
                          earned_leave_encashment: value
                        };
                        props.setFieldValue("final_amount", calculateFinalAmount(updatedValues));
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 ">
                  <div className="flex-1 space-y-2">
                    <TextInput
                      name={"total_deductions"}
                      error={props.errors?.total_deductions}
                      touch={props.touched?.total_deductions}
                      value={props.values?.total_deductions}
                      label={"Total Deductions"}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                        // Calculate final amount when this field changes
                        const updatedValues = {
                          ...props.values,
                          total_deductions: value
                        };
                        props.setFieldValue("final_amount", calculateFinalAmount(updatedValues));
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <TextInput
                      name={"gratuity_amount"}
                      error={props.errors?.gratuity_amount}
                      touch={props.touched?.gratuity_amount}
                      value={props.values?.gratuity_amount}
                      label={"Gratuity Amount"}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                        // Calculate final amount when this field changes
                        const updatedValues = {
                          ...props.values,
                          gratuity_amount: value
                        };
                        props.setFieldValue("final_amount", calculateFinalAmount(updatedValues));
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 ">
                  <div className="flex-1 space-y-2">
                    <TextInput
                      name={"final_amount"}
                      error={props.errors?.final_amount}
                      touch={props.touched?.final_amount}
                      value={props.values?.final_amount}
                      label={"Final Amount"}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                      required={true}
                      disabled={true}
                    />
                  </div>
                </div>
                <TextAreaInput
                  name={"notes"}
                  error={props.errors?.notes}
                  touch={props.touched?.notes}
                  value={props.values?.notes}
                  label={"Notes"}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  maxRows={3}
                  placeholder="Type your description here"
                />
              </div>
            </div>
            <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
              <Button
                variant="outline"
                size="lg"
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="default"
                disabled={isSubmitting || !payroll}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </SheetComponent>
  );
};

export default ClearanceSheet;
