import { Label } from "src/@/components/ui/label";
import { ShiftInformation } from "app/utils/Types/Shift";
import { TextInput ,TimePicker} from "components/FormControl";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useState } from "react";
import { SelectInputComponent } from "components/FormControl";
import { shiftType } from "data/Data";
import { toast } from "react-toastify";
import moment from "moment";

import { saveShift } from "app/hooks/general";
import { validateShiftFormSchema } from "app/utils/FormSchema/ShiftFormSchema";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";

const AddShiftForm = ({ isOpen, setIsOpen, edit, setEdit, reload }) => {
  console.log("Reload in AddShiftForm:", reload);
  const [formData, setFormData] = useState(() => {
    if (edit?.data) {
      const localStartTime = moment(edit.data.starttime)
        .local()
        .format("hh:mm A");
      const localEndTime = moment(edit.data.endtime).local().format("hh:mm A");
      return {
        ...edit.data,
        starttime: localStartTime,
        endtime: localEndTime,
      };
    }
    return ShiftInformation;
  });
  const [closeSheet, setCloseSheet] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const localDate = moment().format("YYYY-MM-DD");

      // Use default times if no value is selected
      const startTime = values.starttime || "09:00 AM"; // Default start time
      const endTime = values.endtime || "05:00 PM"; // Default end time

      const startTimeUTC = moment(
        `${localDate} ${startTime}`,
        "YYYY-MM-DD hh:mm A"
      )
        .utc()
        .format();
      const endTimeUTC = moment(`${localDate} ${endTime}`, "YYYY-MM-DD hh:mm A")
        .utc()
        .format();

      const updatedValues = {
        ...values,
        starttime: startTimeUTC,
        endtime: endTimeUTC,
      };

      console.log(updatedValues, "UPDATE VALUES");

      const response = await saveShift(updatedValues?.id, updatedValues);
      if (response) {
        toast.success(`Shift ${edit ? "Updated": "Added"} Successfully!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log("response", response)
        reload();
        setIsOpen(false);
        setEdit({
          open: false,
          data: null,
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  const handleTimeChange = (field, time, props) => {
    props.setFieldValue(field, time);
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
        onSubmit={handleSubmit}
        validate={validateShiftFormSchema}
      >
        {(props) => (
          <form onSubmit={props?.handleSubmit}>
            <SheetCardExtension title="Shift Details">
              <TextInput
                name="name"
                label="Shift Name"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  console.log(field, value, "FIELD VALUE");
                  props.handleChange(field)(value);
                }}
              />

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

              <Label>Start Time</Label>
              <TimePicker
                value={props.values.starttime || "09:00 AM"} // Bind Formik value for starttime
                onChange={(time) => handleTimeChange("starttime", time, props)} // Update Formik value on time change
              />

              <Label>End Time</Label>
              <TimePicker
                value={props.values.endtime || "05:00 PM"} // Bind Formik value for endtime
                onChange={(time) => handleTimeChange("endtime", time, props)} // Update Formik value on time change
              />
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
                <Button type="submit" size="lg" variant="default">
                  {edit ? "Update" : "Add"}
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
