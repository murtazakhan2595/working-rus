import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import { Paperclip } from "lucide-react";

import {
  TextInput,
  SelectComponent,
  TextAreaInput,
} from "components/form-control";
import { DateInput } from "components/form-control";
import { ClaimExpenseTypeOptions } from "data/Data";
import { getEmployeePayroll } from "app/hooks/payroll";
import { connect } from "react-redux";
import { saveReimbursement } from "app/hooks/payroll";
import { toast } from "react-toastify";
import { validateClaimRequestForm } from "app/utils/FormSchema/payrollFormSchema";
import { SheetCardExtension } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { CoverFileUpload } from "components/form-control";

const ReimbursmentDetailsRequest = ({ userProfile, reload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newAttachment, setNewAttachment] = useState(null);
  const [payroll, setPayroll] = useState({});
  const [closeSheet, setCloseSheet] = useState(false);

  const claimRequest = {
    expense_type: "",
    payment_date: "",
    amount: "",
    description: "",
    attachment: null,
  };
  const formSheetData = {
    triggerText: "Send Request",
    title: "Claim request",

    description: null,
    footer: null,
  };

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const response = await getEmployeePayroll({
          filterData: { employee_id: userProfile.id },
        });
        setPayroll(response?.results[0]);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };
    fetchPayroll();
  }, []);

  const handleFormSubmit = async (values) => {
    values.status_hr = {
      status: "pending",
    };
    values.status_manager = { 
      status: "pending",
    };
    values.status_superadmin = {
      status: "pending",
    };
    values.status = "pending";
    values.is_paid = false;
    values.employee_payroll = payroll.id;
  
    const formData = new FormData();
  
    Object.keys(values).forEach((key) => {
      if (key === "attachment") {
        if (values[key]) formData.append(key, values[key]);
      } else if (
        key === "status_hr" || 
        key === "status_manager" || 
        key === "status_superadmin"
      ) {
        // Serialize status objects as JSON strings
        formData.append(key, JSON.stringify(values[key]));
      } else {
        formData.append(key, values[key]);
      }
    });
  
    try {
      const response = await saveReimbursement(formData);
      if (response) {
        toast.success("Reimbursement request sent successfully");
        setNewAttachment(null);
        reload();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error submitting reimbursement request:", error);
      toast.error("Failed to send reimbursement request");
    }
  };
  

 

  const handleClose = () => {
    setNewAttachment(null);
    setCloseSheet(true);
  };

  return (
    <div>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}

      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <Formik
          initialValues={claimRequest}
          validate={validateClaimRequestForm}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              <SheetCardExtension title="Details">
                <SelectComponent
                  name={"expense_type"}
                  error={props.errors?.expense_type}
                  touch={props.touched?.expense_type}
                  value={props.values?.expense_type}
                  label={"Expense Type"}
                  required={true}
                  options={ClaimExpenseTypeOptions}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  placeholder="Select"
                />
                <div className="flex items-center gap-4 ">
                  <div className="flex-1 space-y-2">
                    {/* <div>
                        <div>Amount</div>
                      </div> */}
                    <TextInput
                      name={"amount"}
                      error={props.errors?.amount}
                      touch={props.touched?.amount}
                      value={props.values?.amount}
                      label={"Amount"}
                      required={true}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                      placeholder="Add Value"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    {/* <div>
                        <div>Date of Expense</div>
                      </div> */}
                    <DateInput
                      name={"payment_date"}
                      error={props.errors?.payment_date}
                      touch={props.touched?.payment_date}
                      value={props.values?.payment_date}
                      label={"Date of Expense"}
                      required={true}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                      placeholder=""
                    />
                  </div>
                </div>
                {/* <div className="pt-4">
                    <div>Description</div>
                  </div> */}
                <TextAreaInput
                  name={"description"}
                  error={props.errors?.description}
                  touch={props.touched?.description}
                  value={props.values?.description}
                  options={ClaimExpenseTypeOptions}
                  label={"Description"}
                  required={true}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  maxRows={3}
                  placeholder="Type your description here"
                />

                <CoverFileUpload
                  name="attachment"
                  label="Attachment"
                  acceptType=".png,.jpg,.pdf"
                  maxSize="10MB"
                  error={props.errors?.attachment}
                  touch={props.touched?.attachment}
                  value={props.values?.attachment}
                  required={true}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                    props.setFieldTouched(field, true);
                  }}
                />
              </SheetCardExtension>
              <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  type="button"
                  size="lg"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" variant="default">
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </SheetComponent>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(ReimbursmentDetailsRequest);
