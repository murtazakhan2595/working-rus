import { useEffect, useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import {
  NumberInput,
  SelectInputComponent,
  TextAreaInput,
  DateInput,
} from "components/FormControl";
import { addLogTime, getDtr, addUpdateDTR } from "app/hooks/dtr";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { getAllTasks } from "app/hooks/taskManagment";
import { validateLogTimeFormSchema } from "app/utils/FormSchema/DTRFormSchema";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { TaskStatus } from "data/Data";
import { getDropdownListWithExtraKeys } from "utils/Lists";
import { Attachments } from "app/modules/TaskManagment/Sections";
import { LogTime } from "app/utils/Types/DTR";
import moment from "moment";
const SaveUpdateLogTime = ({ userProfile, reload, isOpen, setIsOpen }) => {
  const [taskOptions, setTaskOptions] = useState([]);
  const [closeSheet, setCloseSheet] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);
  const formSheetData = {
    triggerText: "Save",
    title: "Log Time",
    description: null,
    footer: null,
  };

  useEffect(() => {
    const fetchData = async (isMounted) => {
      try {
        if (isMounted) {
          const response = await getAllTasks({
            filterData: {
              assigned_to: [userProfile.id],
            },
          });
          if (response) {
            const taskDropdownOptions = getDropdownListWithExtraKeys(
              response.results,
              "name",
              "id",
              ["status", "actual_time"]
            );
            console.log(taskDropdownOptions, "taskDropdownOptions");
            setTaskOptions(taskDropdownOptions);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [userProfile]);

  const fetchDTRData = async (isMounted, DTRDate) => {
    try {
      if (isMounted) {
        const response = await getDtr({
          filterData: {
            employee_id: userProfile.id,
            logtime_date: DTRDate,
          },
        });
        if (response) {
          const dtr = response.results;
          if (dtr && dtr.length > 0) return dtr[0];
          else {
            const dtrResponse = await addUpdateDTR(
              {
                logtime_date: DTRDate,
                employee_id: userProfile?.id || null,
                dtr_status: "Pending",
              },
              null
            );
            if (dtrResponse) {
              return dtrResponse;
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      ...{ attachment: values?.attachment?.attachments },
    };
    const response = await addLogTime(payload, values.id);
    if (response) {
      //Link the saved logtime with DTR of current date
      const currentDTR = await fetchDTRData(true, response.date);
      const dtrResponse = await addUpdateDTR(
        {
          dtr_status: "Pending",
          logtimes: currentDTR
            ? [response.id, ...currentDTR.logtimes]
            : [response.id],
          logtime_date: response.date,
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
              <SheetCardExtension title="Logtime Details">
                <DateInput
                  name={"date"}
                  error={props.errors?.date}
                  touch={props.touched?.date}
                  value={props.values?.date}
                  label={"Logtime Date"}
                  required={true}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  placeholder="Select Date"
                />
              </SheetCardExtension>
              <SheetCardExtension title="Task Details">
                <SelectInputComponent
                  name={"task_id"}
                  error={props.errors?.task_id}
                  touch={props.touched?.task_id}
                  value={props.values?.task_id}
                  label={"Task/ID"}
                  required={true}
                  options={taskOptions}
                  onChange={(field, value, optionSelected) => {
                    props.setFieldValue(field, value);
                    if (value)
                      setTaskSelected(
                        taskOptions.find((obj) => obj.value === value)
                      );
                    else setTaskSelected(null);
                  }}
                  placeholder="Select task"
                />

                <div className="flex items-center gap-4 ">
                  <div className="flex-1 space-y-2">
                    <NumberInput
                      name={"consumed_time"}
                      error={props.errors?.consumed_time}
                      touch={props.touched?.consumed_time}
                      value={
                        props.values?.consumed_time || taskSelected?.actual_time
                      }
                      onChange={(field, value) => {
                        props.handleChange(field)(value);
                      }}
                      placeholder="Time Spent"
                      label="Time Spent"
                      required="true"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <SelectInputComponent
                      name={"status"}
                      error={props.errors?.status}
                      touch={props.touched?.status}
                      value={props.values?.status || taskSelected?.status}
                      label={"Status"}
                      required={true}
                      options={TaskStatus}
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
                <Attachments
                  attachmentSelected={props.values.attachment || []}
                  onChange={async (attachment) => {
                    props.setFieldValue("attachment", attachment);
                  }}
                  acceptedFileTypes=".pdf,.png,.jpg,.jpeg"
                  error={props.errors.attachment}
                  touch={props.touched.attachment}
                  //deleteAttachmentFile={deleteAttachmentFile}
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
