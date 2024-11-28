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

const ReimbursmentDetailsRequest = ({ userProfile, reload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newAttachment, setNewAttachment] = useState(null);
  const [payroll, setPayroll] = useState({});
  const [closeSheet , setCloseSheet] = useState(false)

  const claimRequest = {
    expense_type: "",
    payment_date: "",
    amount: "",
    description: "",
    attachment: "",
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
    if (!newAttachment) {
      toast.error("Please upload an attachment");
      return;
    }
    values.attachment = newAttachment ? newAttachment : "";

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
    const response = await saveReimbursement(values);
    if (response) {
      toast.success("Reimbursement request sent successfully");
      setNewAttachment(null);
      reload();

      setIsOpen(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileData = {
          name: file.name, // File name
          file: event.target.result, // Base64 data URL
        };
        setNewAttachment(fileData); // Update state with file data
        console.log("File uploaded:", fileData);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error); // Handle errors
      };

      reader.readAsDataURL(file); // Read file as data URL
    }
  };

  const handleClose = ()=>{
    setNewAttachment(null);
    setCloseSheet(true)
  }

  return (
    <div>
       {handleCloseWithConfirmation({isOpen: closeSheet, setCloseSheet, setIsOpen})}

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

                <div className="h-[118px] flex-col justify-start  gap-2 inline-flex">
                  <div className="justify-center gap-12 ">
                    <div className="inline-flex flex-col justify-start text-sm font-medium  text-neutral-800">
                      Attachments
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="inline-flex flex-col justify-start p-4 pr-5 border border-solid rounded-md grow border-zinc-200">
                        <div className="flex items-center">
                          <div>
                            <div className="flex items-center text-[#8b8d98] text-sm  gap-2">
                              <Paperclip size={16} />
                              {newAttachment && newAttachment.name ? (
                                <span className="mr-2">
                                  {newAttachment.name}
                                </span>
                              ) : (
                                <>
                                  <span className="text-[#ab4aba] text-sm font-semibold ">
                                    Upload a file
                                  </span>
                                  <span>or drag and drop</span>
                                </>
                              )}
                            </div>
                            {!(newAttachment && newAttachment.name) && (
                              <div className="w-[263px] h-3 pl-8 pr-[26.62px] flex-col justify-start items-start inline-flex">
                                <div className="text-[#8b8d98] text-xs  ">
                                  PNG, JPG, PDF up to 10MB
                                </div>
                              </div>
                            )}
                          </div>
                          <Button
                            className="bg-white border border-[#e8e8ec] text-neutral-1200"
                            type="button"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
                      {/* Hidden file input */}
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/png, image/jpeg, application/pdf"
                        style={{ display: "none" }} // Hide the file input
                        onChange={handleFileChange} // Call the file change handler
                      />
                      {/* <Button className="bg-white border border-[#e8e8ec] text-neutral-1200 text-sm font-medium w-fit">
                          + Add another
                        </Button> */}
                    </div>
                  </div>
                </div>
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
