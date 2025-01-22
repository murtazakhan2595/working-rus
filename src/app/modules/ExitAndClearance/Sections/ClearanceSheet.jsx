import { Button } from "components/ui/button";
import { DateInput, TextInput, TextAreaInput } from "components/FormControl";
import SheetComponent from "../../../../components/ui/SheetComponent";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { getEmployeePayroll } from "app/hooks/payroll";
import { saveFinalSettlement } from "app/hooks/payroll";
import { toast } from "react-toastify";
import { saveEmployeePayroll } from "app/hooks/payroll";
import { validateClearanceForm } from "app/utils/FormSchema/exitAndClearanceFormSchema";

const ClearanceSheet = ({
  isOpen,
  setIsOpen,
  handleOptionSelect,
  employeeId,
}) => {
  const [payroll, setPayroll] = useState(null);
  const fetchEmployePayrollID = async () => {
    const payroll = await getEmployeePayroll({
      filterData: { employee_id: employeeId },
    });
    console.log("payroll", payroll);
    if (payroll) {
      setPayroll(payroll.results[0]);
    }
  };
  useEffect(() => {
    fetchEmployePayrollID();
  }, [employeeId]);
  console.log("payroll", payroll);

  const formSheetData = {
    triggerText: null,
    title: "Final Settlement",

    description: null,
    footer: null,
  };
  const handleFormSubmit = async (values) => {
    values = { ...values, employee_payroll: payroll.id };
    console.log("values", values);
    const response = await saveFinalSettlement(values);
    const empPayroll = await saveEmployeePayroll({
      ...payroll,
      is_eos_applicable: true,
    });
    if (response && empPayroll) {
      handleOptionSelect("initiated clearance");
      setIsOpen(false);
      toast.success("Final Settlement saved successfully");
    }
  };

  return (
    <SheetComponent
      {...formSheetData}
      contentClassName="custom-sheet-width"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      
    >
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
            {/* {console.log("props", props)} */}
            <div className={`flex w-full flex-col rounded-lg`}>
              <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium  tracking-[0px] text-zinc-900">
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
                      }}
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="default"
                // className=" bg-[#1c2024] text-white"
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </SheetComponent>
  );
};

export default ClearanceSheet;
