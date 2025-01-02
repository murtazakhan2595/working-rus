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
import { validateLeaveRequestFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import { saveAttachment } from "app/hooks/leaveTracker";
import { getRemainingLeaves } from "app/hooks/leaveTracker";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { CoverFileUpload } from "components/form-control";

const ApplyLeaveSheet = ({ userProfile, reload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newAttachment, setNewAttachment] = useState(null);
  const [LeaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [selectedNoOfDays, setSelectedNoOfDays] = useState(0);
  const [leaveAfter, setLeaveAfter] = useState(null);
  const [maxDays, setMaxDays] = useState(0);
  const [closeSheet, setCloseSheet] = useState(false);

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
      const response = await getLeaveComponents({
        filterData: {
          employee_id_and_org: `${userProfile.id},${true}`,
          status: true,
        },
      });
      if (response) {
        const LeaveTypeOptions = response?.results?.map((item) => ({
          value: item.id,
          label: item.name,
          ...item,
        }));
        setLeaveTypeOptions(LeaveTypeOptions);
      }
    };
    fetchData();
  }, [userProfile]);

  const getAvailableLeaves = async (leaveTypeId) => {
    let leavesAfter = await getRemainingLeaves(leaveTypeId, userProfile.id);

    const leaveType = LeaveTypeOptions.find(
      (item) => item.value === leaveTypeId
    );
    if (leavesAfter === -1) {
      setLeaveAfter(leaveType.max_days);
      leavesAfter = leaveType.max_days;
    } else {
      setLeaveAfter(leavesAfter);
    }
    setMaxDays(leaveType.max_days);
    if (leavesAfter !== null && selectedNoOfDays > 0) {
      console.log(
        "this is the thing",
        leaveType.max_days,
        leavesAfter,
        selectedNoOfDays,
        selectedNoOfDays > leavesAfter
      );
      if (selectedNoOfDays > leavesAfter) {
        toast.error("You don't have enough leaves to apply for this request");
      }
    }
  };

  useEffect(() => {
    if (selectedLeaveType) {
      console.log("selectedLeaveType", selectedLeaveType);
      selectedLeaveType &&
        selectedNoOfDays &&
        getAvailableLeaves(selectedLeaveType);
    }
  }, [selectedLeaveType, selectedNoOfDays]);

  const handleFormSubmit = async (values) => {
    if (leaveAfter !== null && selectedNoOfDays > 0) {
      if (selectedNoOfDays > leaveAfter) {
        toast.error("You don't have enough leaves to apply for this request");
        return;
      }
    }

    let attachmentId = null;
    console.log(attachmentId, "ATTACHMENT ID")
    // Step 1: Check if there is an attachment and save it
    if (newAttachment) {
      const formData = new FormData();
      formData.append("attachment", newAttachment);

      const attachmentResponse = await saveAttachment(formData);

      if (!attachmentResponse || !attachmentResponse.id) {
        throw new Error("Failed to upload the attachment.");
      }
      attachmentId = attachmentResponse.id; // Save attachment ID
    }

    // Step 2: Save leave request with the attachment (if exists)
    const leaveRequestPayload = {
      ...values,
      ...(attachmentId && { attachments: attachmentId }), // Only add attachments if present
    };
    const response = await saveLeave(leaveRequestPayload);
    if (response) {
      // Step 3: Prepare the leave transaction
      const employeeLeaveTransaction = {
        leave_days: values?.no_of_days,
        action_manager: "Pending",
        action_hr: "Pending",
        employee_id: userProfile.id,
        leave_request_id: response.id, // Link to the saved leave request
        leave_component_id: values?.component_type,
      };

      // Step 4: Save the leave transaction
      const tran = await saveLeaveTransaction(employeeLeaveTransaction);
      if (tran) {
        toast.success("Leave request sent successfully");
        setIsOpen(false);
        setNewAttachment(null); // Clear the attachment
        reload(); // Reload the page or data
      } else {
        toast.error("Error in saving leave transaction");
      }
    } else {
      toast.error("Error in submitting leave request");
    }
  };

  const handleFileChange = (field, value) => {
    console.log(value, "VALUE IS HERE")
    if (value) {
      const file = value.file; // Extract the file data
      const maxFileSize = 10 * 1024 * 1024; // Max file size: 10MB
      if (value.size > maxFileSize) {
        toast.error("File is too large, must be less than 10MB");
        return;
      }
  
      setNewAttachment(value); // Update the state with the selected file
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
        setNewAttachment,
      })}
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="568px"
      >
        <Formik
          initialValues={leaveRequest}
          validate={validateLeaveRequestFormSchema}
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
                      setSelectedLeaveType(value);
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
                      setSelectedNoOfDays(value);
                    }}
                    regEx={/^\d+$/}
                    placeholder="Add count"
                    label="Number of Days"
                    required="true"
                  />
                  <div className="flex items-center gap-4 ">
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
                  <CoverFileUpload
                    acceptType=".pdf,.jpg,.png" // Allow multiple file types
                    name={`attachments`}
                    value={props.values.attachments} // Bind to Formik value
                    onChange={(field, value) => {
                      handleFileChange(field, value);
                      props.setFieldValue(field, value); // Update Formik value
                    }}
                    label={"Attachments"}
                    touch={props.touched.attachments}
                  />
                </div>
              </div>
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

export default connect(mapStateToProps)(ApplyLeaveSheet);
