import { useEffect, useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import {
  NumberInput,
  SelectComponent,
  TextAreaInput,
} from "components/form-control";
import { addLogTime, getDtr, addUpdateDTR } from "app/hooks/dtr";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { getAllTasks } from "app/hooks/taskManagment";
import { validateLogTimeFormSchema } from "app/utils/FormSchema/DTRFormSchema";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { getDropdownList } from "utils/Lists";
import { Attachments } from "app/modules/TaskManagment/Sections";
import { LogTime } from "app/utils/Types/DTR";
import moment from "moment";
const SaveUpdateLogTime = ({ userProfile, reload, isOpen, setIsOpen }) => {
  const [taskOptions, setTaskOptions] = useState([]);
  const [currentDTR, setCurrentDTR] = useState(null);
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
        filterData: {
          assigned_to: [userProfile.id],
        },
      });
      if (response) {
        const taskDropdownOptions = getDropdownList(
          response.results,
          "name",
          "id"
        );
        setTaskOptions(taskDropdownOptions);
      }
    };
    fetchData();
  }, [userProfile.id]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDtr({
        filterData: {
          employee_id: userProfile.id,
          date: moment().format("YYYY-MM-DD"),
        },
      });
      if (response) {
        const dtr = response.results;
        if (dtr && dtr.length > 0) setCurrentDTR(dtr[0]);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      ...{ attachment: values?.attachment?.attachments },
    };
    debugger;
    const response = await addLogTime(payload, values.id);
    if (response) {
      //Link the saved logtime with DTR of current date
      const dtrResponse = await addUpdateDTR(
        {
          dtr_status: "Pending",
          logtimes: currentDTR
            ? [response.id, ...currentDTR.logtimes]
            : [response.id],
          logtime_date: moment().format("YYYY-MM-DD"),
          employee_id: userProfile?.id || null,
          id: currentDTR?.id || null,
        },
        currentDTR?.id || null
      );

      if (dtrResponse) {
        toast.success("LogTime saved successfully");
        setIsOpen(false);
        reload(); // Reload the page or data
      }
    } else {
      toast.error("Error in saving leave transaction");
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
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        width="568px"
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
                        debugger;
                        props.setFieldValue("attachment", attachments);
                      }}
                      maxAttachments={1}
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
