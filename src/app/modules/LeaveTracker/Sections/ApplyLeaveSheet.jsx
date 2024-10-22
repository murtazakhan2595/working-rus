import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import moment from "moment";
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
import { getLeaveComponents } from "app/hooks/leaveTracker";
import { saveLeave } from "app/hooks/leaveTracker";
import { saveLeaveTransaction } from "app/hooks/leaveTracker";

const ApplyLeaveSheet = ({ userProfile, reload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newAttachment, setNewAttachment] = useState(null);
  const [LeaveTypeOptions, setLeaveTypeOptions] = useState([]);
  console.log("userProfile", userProfile);

  const leaveRequest = {
    component_type: "",
    no_of_days: "",
    start_date: "",
    end_date: "",
    reason: "",
    employee: userProfile.id,
  };
  const formSheetData = {
    triggerText: "Send Request",
    title: "Apply Leave",

    description: null,
    footer: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLeaveComponents({});
      if (response) {
        const LeaveTypeOptions = response.map((item) => ({
          value: item.id,
          label: item.name,
          ...item,
        }));
        console.log("response", LeaveTypeOptions);
        setLeaveTypeOptions(LeaveTypeOptions);
      }
    };
    fetchData();
  }, [userProfile]);

  const handleFormSubmit = async (values) => {
    console.log("values", values);
    const response = await saveLeave(values);
    if (response) {
      const type = LeaveTypeOptions.filter(
        (item) => item?.id === values?.component_type
      );
      const employeeLeaveTransaction = {
        leave_days: values?.no_of_days,
        balance_after: type[0]?.max_days - values?.no_of_days,
        action_manager: "Pending",
        action_hr: "Pending",
        employee_id: userProfile.id,
        leave_request_id: response.id,
        leave_component_id: values?.component_type,
      };
      const tran = saveLeaveTransaction(employeeLeaveTransaction);
      if (tran) {
        toast.success("Leave request sent successfully");
        setIsOpen(false);
        reload();
      }
    }
    // if (!newAttachment) {
    //   toast.error("Please upload an attachment");
    //   return;
    // }
    // values.attachment = newAttachment ? newAttachment : "";

    // values.status_hr = {
    //   status: "pending",
    // };
    // values.status_manager = {
    //   status: "pending",
    // };
    // values.status_superadmin = {
    //   status: "pending",
    // };
    // values.status = "pending";
    // values.is_paid = false;
    // values.employee_payroll = payroll.id;
    // console.log(values);
    // const response = await saveReimbursement(values);
    // if (response) {
    //   toast.success("Reimbursement request sent successfully");
    //   setNewAttachment(null);
    //   reload();

    //   setIsOpen(false);
    // }
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

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="600px"
      >
        <Formik
          initialValues={leaveRequest}
          // validate={validateClaimRequestForm}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              <div className={`flex w-full flex-col rounded-lg`}>
                <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium  tracking-[0px] text-zinc-900">
                  <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                    <div className="text-zinc-950">Details</div>
                  </div>
                  <SelectComponent
                    name={"component_type"}
                    error={props.errors?.component_type}
                    touch={props.touched?.component_type}
                    value={props.values?.component_type}
                    label={"Leave Type"}
                    required={true}
                    options={LeaveTypeOptions}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    placeholder="Select option"
                  />
                  <TextInput
                    name={"no_of_days"}
                    error={props.errors?.no_of_days}
                    touch={props.touched?.no_of_days}
                    value={props.values?.no_of_days}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    regEx={/^\d+$/}
                    placeholder="Add count"
                    label="Number of Days"
                    required="true"
                  />
                  <div className="gap-4 flex items-center ">
                    <div className="flex-1 space-y-2">
                      <DateInput
                        name={"start_date"}
                        error={props.errors?.start_date}
                        touch={props.touched?.start_date}
                        value={props.values?.start_date}
                        label={"Start Date"}
                        required={true}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        placeholder=""
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <DateInput
                        name={"end_date"}
                        error={props.errors?.end_date}
                        touch={props.touched?.end_date}
                        value={props.values?.end_date}
                        label={"End Date"}
                        required={true}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        placeholder=""
                      />
                    </div>
                  </div>
                  <TextAreaInput
                    name={"reason"}
                    error={props.errors?.reason}
                    touch={props.touched?.reason}
                    value={props.values?.reason}
                    options={ClaimExpenseTypeOptions}
                    label={"Reason for Leave"}
                    required={true}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    maxRows={3}
                    placeholder="Type your remarks here"
                  />

                  <div className="h-[118px] flex-col justify-start  gap-2 inline-flex">
                    <div className=" justify-center  gap-12">
                      <div className=" flex-col justify-start  inline-flex text-neutral-800 text-sm font-medium ">
                        Attachments
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="grow flex-col justify-start  inline-flex p-4 pr-5 border border-solid border-zinc-200 rounded-md">
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
                                    PNG, JPG, GIF up to 10MB
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button
                              className="bg-white border border-[#e8e8ec] text-[#1c2024]"
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
                          accept="image/png, image/jpeg, image/gif"
                          style={{ display: "none" }} // Hide the file input
                          onChange={handleFileChange} // Call the file change handler
                        />
                        {/* <Button className="bg-white border border-[#e8e8ec] text-[#1c2024] text-sm font-medium w-fit">
                          + Add another
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row pt-6">
                <Button
                  variant="outline"
                  type="button"
                  size="lg"
                  onClick={() => {
                    setNewAttachment(null);
                    setIsOpen(false);
                  }}
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

export default connect(mapStateToProps)(ApplyLeaveSheet);
