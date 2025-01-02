import { useEffect, useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import moment from "moment";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import { Paperclip } from "lucide-react";

import {
  NumberInput,
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
import { getAllTasks } from "app/hooks/taskManagment";
import { saveLeave } from "app/hooks/leaveTracker";
import { saveLeaveTransaction } from "app/hooks/leaveTracker";
import { validateLogTimeFormSchema } from "app/utils/FormSchema/DTRFormSchema";
import { saveAttachment } from "app/hooks/leaveTracker";
import { getRemainingLeaves } from "app/hooks/leaveTracker";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { getDropdownList } from "utils/Lists";
import {
  Labels,
  Assignee,
  CheckList,
  Attachments,
  TaskRelation,
} from "app/modules/TaskManagment/Sections";
import { LogTime } from "app/utils/Types/DTR";
const SaveUpdateLogTime = ({ userProfile, reload, isOpen, setIsOpen }) => {
  const [newAttachment, setNewAttachment] = useState(null);
  const [taskOptions, setTaskOptions] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [selectedNoOfDays, setSelectedNoOfDays] = useState(0);
  const [leaveAfter, setLeaveAfter] = useState(null);
  const [maxDays, setMaxDays] = useState(0);
  const [closeSheet, setCloseSheet] = useState(false);
  const formSheetData = {
    triggerText: "Save",
    title: "Log Time",

    description: null,
    footer: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllTasks({
        // filterData: {
        //   employee_id_and_org: `${userProfile.id},${true}`,
        //   status: true,
        // },
      });
      if (response) {
        setTaskOptions(getDropdownList(response.results, "name", "id"));
      }
    };
    fetchData();
  }, [userProfile]);

  const getAvailableLeaves = async (leaveTypeId) => {
    let leavesAfter = await getRemainingLeaves(leaveTypeId, userProfile.id);

    const leaveType = taskOptions.find((item) => item.value === leaveTypeId);
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
    console.log(attachmentId, "ATTACHMENT ID");
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
    console.log(value, "VALUE IS HERE");
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
      >
        <Formik
          initialValues={LogTime}
          validate={validateLogTimeFormSchema}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              {console.log(props.touched, props.errors)}
              <SheetCardExtension title="Task Details">
                <SelectComponent
                  name={"task_id"}
                  error={props.errors?.task_id}
                  touch={props.touched?.task_id}
                  value={props.values?.task_id}
                  label={"Task/ID"}
                  required={true}
                  options={taskOptions}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  placeholder="Select task"
                />

                <div className="flex items-center gap-4 ">
                  <div className="flex-1 space-y-2">
                    <NumberInput
                      name={"consumed_time"}
                      error={props.errors?.consumed_time}
                      touch={props.touched?.consumed_time}
                      value={props.values?.consumed_time}
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                      placeholder="Time Spent"
                      label="Time Spent"
                      required="true"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <SelectComponent
                      name={"status"}
                      error={props.errors?.status}
                      touch={props.touched?.status}
                      value={props.values?.status}
                      label={"Status"}
                      required={true}
                      options={taskOptions}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      placeholder="Select status"
                    />
                  </div>
                </div>
                <TextAreaInput
                  name={"notes"}
                  error={props.errors?.notes}
                  touch={props.touched?.notes}
                  value={props.values?.notes}
                  label={"Notes"}
                  required={true}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  maxRows={3}
                  placeholder="Type your notes here"
                />
                <div className="flex items-center gap-2 space-y-2">
                  <div style={{ marginRight: "1rem" }}>Attachment</div>
                  <div style={{ width: "100%" }}>
                    <Attachments
                      attachmentSelected={props.values?.attachment || []}
                      onChange={(attachments) => {
                        props.setFieldValue("attachment", attachments);
                      }}
                    />
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
                  Save
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

export default connect(mapStateToProps)(SaveUpdateLogTime);
