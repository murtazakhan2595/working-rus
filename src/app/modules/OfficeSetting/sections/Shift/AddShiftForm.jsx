// src/app/modules/OfficeSetting/sections/Shift/AddShiftForm.jsx
import { Label } from "src/@/components/ui/label";
import { TextInput, TimePicker, CheckBoxInput } from "components/FormControl";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useState } from "react";
import { SelectInputComponent } from "components/FormControl";
import { shiftType } from "data/Data";
import { toast } from "react-toastify";
import moment from "moment";
import { saveShift } from "app/hooks/general";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { ShiftInformation } from "app/utils/Types/ShiftManagement";
import { validateShiftFormSchema } from 'app/utils/FormSchema/ShiftManagementFormSchema';

const AddShiftForm = ({
  isOpen,
  setIsOpen,
  shiftData,
  setEdit,
  reload = () => {},
  setEmployeeShift = () => {},
}) => {
  const formData = shiftData ?? ShiftInformation;
  const [closeSheet, setCloseSheet] = useState(false);
  const [isSplitShift, setIsSplitShift] = useState(false);

  const handleSubmit = async (values) => {
    try {
      // Use default times if no value is selected
      const startTime = moment(values.starttime);
      const endTime = moment(values.endtime);

      const startTimeUTC = moment(startTime).utc().toISOString();
      const endTimeUTC = moment(endTime).utc().toISOString();

      // Check if total hours don't exceed 9 hours limit
      const duration = moment.duration(endTime.diff(startTime));
      const hours = duration.asHours();

      if (hours > 9) {
        toast.error("Shift duration cannot exceed 9 hours", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      let updatedValues = {
        ...values,
        starttime: startTimeUTC,
        endtime: endTimeUTC,
      };

      // Add split shift data if enabled
      if (isSplitShift) {
        // Validate the split shift format (4.5 hours + 4.5 hours)
        const splitStart1 = moment(values.split_start_time1);
        const splitEnd1 = moment(values.split_end_time1);
        const splitStart2 = moment(values.split_start_time2);
        const splitEnd2 = moment(values.split_end_time2);

        const duration1 = moment
          .duration(splitEnd1.diff(splitStart1))
          .asHours();
        const duration2 = moment
          .duration(splitEnd2.diff(splitStart2))
          .asHours();

        if (
          Math.abs(duration1 - 4.5) > 0.25 ||
          Math.abs(duration2 - 4.5) > 0.25
        ) {
          toast.error("Split shift should be 4.5 hours each", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return;
        }

        updatedValues = {
          ...updatedValues,
          is_split_shift: true,
          split_start_time1: moment(splitStart1).utc().toISOString(),
          split_end_time1: moment(splitEnd1).utc().toISOString(),
          split_start_time2: moment(splitStart2).utc().toISOString(),
          split_end_time2: moment(splitEnd2).utc().toISOString(),
        };
      }

      console.log(updatedValues, "UPDATE VALUES");

      const response = await saveShift(updatedValues?.id, updatedValues);
      if (response) {
        toast.success(
          `Shift ${shiftData ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        console.log("response", response);
        reload(true);
        setIsOpen(false);
        setEmployeeShift(response.id);
        if (setEdit) {
          setEdit({
            open: false,
            data: null,
          });
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen: setIsOpen,
      })}
      <Formik
        initialValues={formData}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        validate={validateShiftFormSchema}
      >
        {(props) => (
          <form onSubmit={props?.handleSubmit}>
            <SheetCardExtension title="Shift Details">
              <div className="mb-6 space-y-2">
              <TextInput
                name="name"
                label="Shift Name"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              </div>
             
              <div className="mb-6 space-y-2">
              <SelectInputComponent
                name={"type"}
                options={shiftType}
                error={props.errors.type}
                touch={props.touched.type}
                value={props.values.type}
                label={"Type"}
                required
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />

              <CheckBoxInput
                label="Split Shift (4.5 hr + 4.5 hr format)"
                name="is_split_shift"
                value={isSplitShift}
                onChange={(name, value) => {
                  setIsSplitShift(value);
                  props.setFieldValue("is_split_shift", value);
                }}
              />

              {!isSplitShift ? (
                <>
                  <Label>Start Time</Label>
                  <TimePicker
                    value={props.values.starttime}
                    onChange={(field, time) => props.setFieldValue(field, time)}
                    date={props.values.starttime}
                    name={"starttime"}
                  />

                  <Label>End Time</Label>
                  <TimePicker
                    value={props.values.endtime}
                    onChange={(field, time) => props.setFieldValue(field, time)}
                    date={props.values.endtime}
                    name="endtime"
                  />
                </>
              ) : (
                <>
                  <div className="mb-2 font-medium">Split Shift 1</div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Start Time</Label>
                      <TimePicker
                        value={props.values.split_start_time1}
                        onChange={(field, time) =>
                          props.setFieldValue(field, time)
                        }
                        date={props.values.split_start_time1}
                        name="split_start_time1"
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <TimePicker
                        value={props.values.split_end_time1}
                        onChange={(field, time) =>
                          props.setFieldValue(field, time)
                        }
                        date={props.values.split_end_time1}
                        name="split_end_time1"
                      />
                    </div>
                  </div>

                  <div className="mb-2 font-medium">Split Shift 2</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <TimePicker
                        value={props.values.split_start_time2}
                        onChange={(field, time) =>
                          props.setFieldValue(field, time)
                        }
                        date={props.values.split_start_time2}
                        name="split_start_time2"
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <TimePicker
                        value={props.values.split_end_time2}
                        onChange={(field, time) =>
                          props.setFieldValue(field, time)
                        }
                        date={props.values.split_end_time2}
                        name="split_end_time2"
                      />
                    </div>
                  </div>
                </>
              )}
            </SheetCardExtension>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  onClick={(e) => {
                    e.preventDefault();
                    props.handleSubmit();
                  }}
                >
                  {shiftData ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddShiftForm;
