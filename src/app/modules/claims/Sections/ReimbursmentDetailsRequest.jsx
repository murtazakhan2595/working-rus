import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";

import {
  TextInput,
  SelectInputComponent,
  TextAreaInput,
} from "components/FormControl";
import { DateInput } from "components/FormControl";
import { getEmployeePayroll } from "app/hooks/payroll";
import { connect } from "react-redux";
import { saveReimbursement,claimExpenseChoices  } from "app/hooks/payroll";
import { toast } from "react-toastify";
import { validateClaimRequestForm } from "app/utils/FormSchema/payrollFormSchema";
import { SheetCardExtension } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { Attachments } from "app/modules/TaskManagment/Sections";

const ReimbursmentDetailsRequest = ({ userProfile, reload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [payroll, setPayroll] = useState({});
  const [closeSheet, setCloseSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseTypeOptions, setExpenseTypeOptions] = useState([]);

  const claimRequest = {
    expense_type: "",
    payment_date: "",
    amount: "",
    description: "",
    reason: "", // Added reason field
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
        const options = await claimExpenseChoices()
        console.log("options",options);
        if(options){
          setExpenseTypeOptions(
            options.results.map((op) => ({
              value: op.id,
              label: op.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };
    fetchPayroll();
  }, []);


const handleFormSubmit = async (values) => {
  console.log("Form values before submission:", values);
  // Remove the 'return' statement that was here

  setLoading(true);
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

  // Add all non-attachment form values to FormData
  Object.keys(values).forEach((key) => {
    if (key !== "attachment") {
      if (
        key === "status_hr" ||
        key === "status_manager" ||
        key === "status_superadmin"
      ) {
        // Serialize status objects as JSON strings
        formData.append(key, JSON.stringify(values[key]));
      } else {
        formData.append(key, values[key]);
      }
    }
  });

  // Simpler attachment handling
  if (values.attachment && Array.isArray(values.attachment)) {
    values.attachment.forEach((item) => {
      // If item is an object with attachment property (from console log)
      if (item && item.attachment && item.attachment instanceof File) {
        formData.append("attachment", item.attachment);
      }
      // If item is directly a File
      else if (item instanceof File) {
        formData.append("attachment", item);
      }
      // If item has an ID (for existing attachments)
      else if (item && item.id) {
        formData.append("attachment", item.id);
      }
    });
  }

  // Log FormData entries for debugging
  console.log("FormData entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await saveReimbursement(formData);
    if (response) {
      toast.success("Reimbursement request sent successfully");
      reload();
      setIsOpen(false);
    }
  } catch (error) {
    console.error("Error submitting reimbursement request:", error);
    toast.error("Failed to send reimbursement request");
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
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
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentClassName="custom-sheet-width"
        width="568px"
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
                <SelectInputComponent
                  name={"expense_type"}
                  error={props.errors?.expense_type}
                  touch={props.touched?.expense_type}
                  value={props.values?.expense_type}
                  label={"Expense Type"}
                  required={true}
                  options={expenseTypeOptions}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  placeholder={
                    expenseTypeOptions.length
                      ? "Select"
                      : "Loading expense types..."
                  }
                  isLoading={expenseTypeOptions.length === 0}
                />
                <div className="flex items-center gap-4 ">
                  <div className="flex-1 space-y-2">
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

                {/* Reason field - added new */}
                <TextAreaInput
                  name={"reason"}
                  error={props.errors?.reason}
                  touch={props.touched?.reason}
                  value={props.values?.reason}
                  label={"Reason"}
                  required={true}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  maxRows={3}
                  placeholder="Explain reason for this expense (min 10 characters)"
                />

                {/* Description field - updated */}
                <TextAreaInput
                  name={"description"}
                  error={props.errors?.description}
                  touch={props.touched?.description}
                  value={props.values?.description}
                  label={"Description"}
                  required={true}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  maxRows={3}
                  placeholder="Provide detailed description (min 10 characters)"
                />

                {/* Using the Attachments component from TaskManagement module */}
                <Attachments
                  attachmentSelected={props.values.attachment || []}
                  onChange={(attachment) => {
                    console.log("attachment", attachment);
                    props.setFieldValue("attachment", attachment);
                  }}
                  acceptedFileTypes=".pdf,.png,.jpg,.jpeg"
                  error={props.errors.attachment}
                  touch={props.touched.attachment}
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
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
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
